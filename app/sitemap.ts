import config from '@/datocms.config'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return await config.sitemap()
}
