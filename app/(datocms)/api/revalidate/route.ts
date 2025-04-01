import { revalidate } from 'next-dato-utils/route-handlers';

export const runtime = "edge"
export const dynamic = "force-dynamic"
import { buildRoute } from '@/lib/routes';

export async function POST(req: Request) {

  return await revalidate(req, async (payload, revalidate) => {

    const { api_key, entity, entity: { id } } = payload;
    const paths = buildRoute(api_key, entity.attributes)
    const tags: string[] = [api_key, id].filter(t => t)
    return await revalidate(paths, tags)
  })
}