import { NextResponse } from 'next/server';
import { redis } from '../../../lib/store';
import { parseOriginalUrl, serviceHostname, shortCode } from '../../../lib/url';
export const runtime = 'nodejs';
export async function POST(request) {
  let data;
  try { data = await request.json(); } catch { return NextResponse.json({ error: 'INVALID_URL' }, { status: 400 }); }
  const parsed = parseOriginalUrl(data?.originalUrl);
  if (parsed.error) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const ownHost = serviceHostname(request);
  const configuredHost = (process.env.PUBLIC_BASE_URL || '').replace(/^https?:\/\//, '').split('/')[0].split(':')[0].toLowerCase();
  if (parsed.hostname === ownHost || (configuredHost && parsed.hostname === configuredHost)) {
    return NextResponse.json({ error: 'SELF_URL_NOT_ALLOWED' }, { status: 400 });
  }
  const base = `https://${ownHost}`;
  try {
    const existing = await redis('GET', `url:${parsed.originalUrl}`);
    if (existing) return NextResponse.json({ shortCode: existing, shortUrl: `${base}/${existing}`, originalUrl: parsed.originalUrl }, { status: 200 });
    for (let i = 0; i < 10; i++) {
      const code = shortCode();
      const inserted = await redis('SET', `code:${code}`, parsed.originalUrl, 'NX');
      if (inserted === 'OK') {
        // Redis SET NX ensures one code per original URL even under simultaneous requests.
        const claimed = await redis('SET', `url:${parsed.originalUrl}`, code, 'NX');
        if (claimed !== 'OK') {
          await redis('DEL', `code:${code}`);
          const winner = await redis('GET', `url:${parsed.originalUrl}`);
          if (winner) return NextResponse.json({ shortCode: winner, shortUrl: `${base}/${winner}`, originalUrl: parsed.originalUrl }, { status: 200 });
          continue;
        }
        return NextResponse.json({ shortCode: code, shortUrl: `${base}/${code}`, originalUrl: parsed.originalUrl }, { status: 201 });
      }
    }
    return NextResponse.json({ error: 'CODE_GENERATION_FAILED' }, { status: 503 });
  } catch (error) {
    console.error('Shorten failed:', error.message);
    return NextResponse.json({ error: 'DATABASE_UNAVAILABLE' }, { status: 503 });
  }
}
