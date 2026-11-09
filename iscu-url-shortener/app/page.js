'use client';
import { useState } from 'react';
export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault(); setError(''); setResult(null); setBusy(true);
    try {
      const response = await fetch('/api/shorten', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ originalUrl: url }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '요청 처리 실패');
      setResult(data);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <main className="shell"><section className="panel"><p className="eyebrow">CLOUD COMPUTING · URL SHORTENER</p><h1>긴 주소를<br/><span>짧고 간편하게.</span></h1><p className="subtitle">URL을 입력하면 공유하기 편한 6자리 단축 주소를 만들어 드립니다.</p><form onSubmit={submit}><label htmlFor="originalUrl">원본 URL</label><input id="originalUrl" type="url" placeholder="https://example.com/long-address" value={url} onChange={e => setUrl(e.target.value)} required/><button type="submit" disabled={busy}>{busy ? '생성 중...' : '단축 URL 생성'}</button></form>{error && <p className="error" role="alert">{error}</p>}{result && <div className="result"><p>단축 주소가 준비되었습니다.</p><a href={result.shortUrl} target="_blank" rel="noreferrer">{result.shortUrl}</a><button className="secondary" onClick={() => navigator.clipboard.writeText(result.shortUrl)}>주소 복사</button></div>}<footer>동일한 URL은 기존 단축 주소를 반환합니다. · 자기 서비스 URL은 단축할 수 없습니다.</footer></section></main>;
}
