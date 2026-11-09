import { NextResponse } from 'next/server';
import { authenticated, unauthorized } from '../../../lib/auth';
export function GET(request) {
  if (!authenticated(request)) return unauthorized();
  return NextResponse.json({ message: 'Admin authenticated' }, { headers: { 'Cache-Control': 'no-store' } });
}
