export const dynamic = "force-dynamic"
import config from '@/datocms.config'
import { router } from 'next-dato-utils/config'
import cors from 'next-dato-utils/route-handlers/cors'

export const GET = async (req: Request, params: any) => router(req, params, config)
export const POST = async (req: Request, params: any) => router(req, params, config)

export async function OPTIONS(req: Request) {
  return await cors(req, new Response('ok', { status: 200 }), {
    origin: '*',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false
  })
}