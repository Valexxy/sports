import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate Limiting Stores
const globalRateLimitMap = new Map<string, { count: number; resetTime: number }>();
const predictionRateLimitMap = new Map<string, { count: number; resetTime: number }>();

const BOT_SIGNATURES = [
  'sqlmap', 'nikto', 'acunetix', 'nmap', 'masscan', 'nessus', 'w3af', 'zgrab', 'dirbuster', 'gobuster'
];

const SQLI_XSS_PATTERN = /(\b(UNION(\s+ALL)?|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|EXECUTE|SCRIPT|ALERT|EVAL|PROMPT)\b)|(<script)|(javascript:)|(onload=)|(onerror=)/i;

export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  const pathname = request.nextUrl.pathname;

  // 1. BOT & SCANNER BLOCKER
  if (BOT_SIGNATURES.some((bot) => userAgent.includes(bot))) {
    return new NextResponse('Access Denied: Malicious Scanner Detected', { status: 403 });
  }

  // 2. WAF INJECTION INSPECTION
  if (pathname.startsWith('/api/')) {
    const searchParams = request.nextUrl.search;
    if (SQLI_XSS_PATTERN.test(searchParams)) {
      return new NextResponse(JSON.stringify({ error: 'Blocked: Malicious Request Signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // 3. TIGHT PREDICTION & WAGER RATE LIMITING (Max 10 requests / 10s per IP)
  if (pathname.startsWith('/api/predictions') || pathname.startsWith('/api/user/')) {
    const now = Date.now();
    const entry = predictionRateLimitMap.get(ip);
    if (!entry || now > entry.resetTime) {
      predictionRateLimitMap.set(ip, { count: 1, resetTime: now + 10000 });
    } else {
      if (entry.count >= 10) {
        return new NextResponse(JSON.stringify({ error: 'Rate Limit: Anti-Bot Throttling Active. Try again in 10s.' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json', 'Retry-After': '10' },
        });
      }
      entry.count++;
    }
  }

  // 4. GENERAL API TOKEN BUCKET RATE LIMITING (120 req / 60s)
  if (pathname.startsWith('/api/')) {
    const now = Date.now();
    const entry = globalRateLimitMap.get(ip);
    if (!entry || now > entry.resetTime) {
      globalRateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    } else {
      if (entry.count >= 120) {
        return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      entry.count++;
    }
  }

  // 5. ENTERPRISE SECURITY HEADERS
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
