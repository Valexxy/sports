import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

// IP-Based Token Bucket Rate Limiting Store
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Malicious User-Agent Signatures
const BOT_SIGNATURES = [
  'sqlmap', 'nikto', 'acunetix', 'nmap', 'masscan', 'nessus', 'w3af', 'zgrab', 'dirbuster', 'gobuster'
];

// Malicious Payload Regex
const SQLI_XSS_PATTERN = /(\b(UNION(\s+ALL)?|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|EXEC|EXECUTE|SCRIPT|ALERT|EVAL|PROMPT)\b)|(<script)|(javascript:)|(onload=)|(onerror=)/i;

export function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
  const url = request.nextUrl.pathname;

  // 1. BOT & SCANNER BLOCKER
  if (BOT_SIGNATURES.some((bot) => userAgent.includes(bot))) {
    return new NextResponse('Access Denied: Malicious Scanner Detected', { status: 403 });
  }

  // 2. WAF INJECTION PAYLOAD INSPECTION FOR API ROUTES
  if (url.startsWith('/api/')) {
    const searchParams = request.nextUrl.search;
    if (SQLI_XSS_PATTERN.test(searchParams)) {
      return new NextResponse(JSON.stringify({ error: 'Blocked: Malicious Request Signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. TOKEN-BUCKET RATE LIMITING (Max 120 requests/minute per IP)
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    } else {
      if (entry.count >= 120) {
        return new NextResponse(JSON.stringify({ error: 'Too Many Requests: Rate Limit Exceeded' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
        });
      }
      entry.count++;
    }
  }

  // 4. ENTERPRISE SECURITY HEADERS INJECTION
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=(self), notifications=(self), vibrate=(self)');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
