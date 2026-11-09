export function unauthorized() {
  return new Response('Authentication required', { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="URL Shortener Admin"', 'Cache-Control': 'no-store' } });
}
export function authenticated(request) {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return false;
  const header = request.headers.get('authorization') || '';
  if (!header.startsWith('Basic ')) return false;
  try {
    const decoded = atob(header.slice(6));
    return decoded === `${username}:${password}`;
  } catch { return false; }
}
