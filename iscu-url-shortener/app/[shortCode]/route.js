import { redis } from '../../lib/store';
export const runtime = 'nodejs';
export async function GET(_request, { params }) {
  const { shortCode } = await params;
  if (!/^[A-Za-z0-9]{6}$/.test(shortCode)) return new Response('Not Found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
  try {
    const originalUrl = await redis('GET', `code:${shortCode}`);
    if (!originalUrl) return new Response('Not Found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
    return new Response(null, { status: 307, headers: { Location: originalUrl, 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Redirect failed:', error.message);
    return new Response('Service Unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
