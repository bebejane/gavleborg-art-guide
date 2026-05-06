import { DatoCmsConfig, getUploadReferenceRoutes, getItemReferenceRoutes } from 'next-dato-utils/config';
import { apiQuery } from 'next-dato-utils/api';
import { AllProgramsDocument } from '@/graphql';
import { MetadataRoute } from 'next';

export default {
	routes: {
		program: async ({ slug }) => [`/${slug}`],
		program_category: async () => [`/`, '/nytt-inlagg'],
		location: async () => [`/`, '/nytt-inlagg'],
		partner: async ({ id }) => [`/`, '/nytt-inlagg', ...(await getItemReferenceRoutes(id))],
		general: async () => [`/`],
		in_english: async () => [`/english`],
		upload: async ({ id }) => getUploadReferenceRoutes(id),
	},
	sitemap: async () => {
		const { allPrograms } = await apiQuery(AllProgramsDocument, { all: true });
		return [
			{
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
				lastModified: new Date(),
				changefreq: 'daily',
				priority: 1,
			},
			...allPrograms.map(({ slug, _createdAt }) => ({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/${slug}`,
				lastModified: new Date(_createdAt),
				changefreq: 'weekly',
				priority: 0.8,
			})),
		];
	},
	manifest: async () => {
		return {
			name: 'Gävleborg Art Guide',
			short_name: 'Gävleborg Art Guide',
			description: 'Gävleborg Art Guide webbplats',
			start_url: '/',
			display: 'standalone',
			background_color: '#ffffff',
			theme_color: '#ffdd00',
			icons: [
				{
					src: '/favicon.ico',
					sizes: 'any',
					type: 'image/x-icon',
				},
			],
		} satisfies MetadataRoute.Manifest;
	},
	robots: async () => {
		return {
			rules: {
				userAgent: '*',
				allow: '/',
				disallow: '/nytt-inlagg/',
			},
		};
	},
} satisfies DatoCmsConfig;
