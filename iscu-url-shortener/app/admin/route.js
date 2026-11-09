import { authenticated, unauthorized } from '../../lib/auth';
export function GET(request) {
  if (!authenticated(request)) return unauthorized();
  return new Response('<h1>URL Shortener Admin</h1><p>Authenticated.</p>', { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}
