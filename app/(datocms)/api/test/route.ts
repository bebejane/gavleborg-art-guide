export { test as GET } from 'next-dato-utils/route-handlers';
import { cors } from 'next-dato-utils/route-handlers';

export const runtime = "edge"

export async function OPTIONS(req: Request) {

  return await cors(req, new Response('ok', { status: 200 }), {
    origin: '*',
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false
  })
}