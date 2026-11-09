const endpoint = () => process.env.UPSTASH_REDIS_REST_URL?.replace(/\/$/, '');
const token = () => process.env.UPSTASH_REDIS_REST_TOKEN;
export async function redis(...args) {
  if (!endpoint() || !token()) throw new Error('Redis environment variables are missing');
  const response = await fetch(endpoint(), {
    method: 'POST',
    headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args), cache: 'no-store'
  });
  if (!response.ok) throw new Error(`Redis HTTP ${response.status}`);
  const payload = await response.json();
  if (payload.error) throw new Error(payload.error);
  return payload.result;
}
