import { NextRequest } from 'next/server';
import { corsResponse, corsOptions } from '@/lib/api-utils';

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(req: NextRequest) {
  return corsResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'API is running',
  });
}

