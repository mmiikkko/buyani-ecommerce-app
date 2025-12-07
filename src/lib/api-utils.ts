import { NextResponse } from 'next/server';

/**
 * Adds CORS headers to API responses to allow mobile app access
 */
export function addCorsHeaders(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

/**
 * Creates a CORS-enabled JSON response
 */
export function corsResponse(data: any, status: number = 200): NextResponse {
  const response = NextResponse.json(data, { status });
  return addCorsHeaders(response);
}

/**
 * Handles OPTIONS requests for CORS preflight
 */
export function corsOptions(): NextResponse {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}

