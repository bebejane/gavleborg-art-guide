import { NextRequest } from 'next/server';
import { webPreviews, cors } from 'next-dato-utils/route-handlers';
import { buildRoute } from '@/lib/routes';

export const runtime = "edge"

export async function POST(req: NextRequest) {
  return await webPreviews(req, async ({ item, itemType, locale }) => {

    const { api_key } = itemType.attributes;
    const path = buildRoute(api_key, item.attributes)?.[0]
    return path
  })
}

export async function OPTIONS(req: Request) {
  return await cors(req, new Response('ok', { status: 200 }), {
    origin: '*',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false
  })
}