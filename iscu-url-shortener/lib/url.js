export function parseOriginalUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return { error: 'MISSING_URL' };
  try {
    const url = new URL(value.trim());
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) return { error: 'INVALID_URL' };
    return { originalUrl: value.trim(), hostname: url.hostname.toLowerCase() };
  } catch { return { error: 'INVALID_URL' }; }
}
export function serviceHostname(request) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  return host.split(',')[0].trim().split(':')[0].toLowerCase();
}
export function shortCode() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, n => alphabet[n % alphabet.length]).join('');
}
