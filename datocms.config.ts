import { DatoCmsConfig } from 'next-dato-utils/config';
import { apiQuery } from 'next-dato-utils/api';
import { AllProgramsDocument } from '@/graphql';

const routes: DatoCmsConfig['routes'] = {
  "program": async ({ slug }) => [`/${slug}`],
  "program_category": async ({ slug }) => [`/`],
  "location": async ({ slug }) => [`/`],
  "partner": async ({ slug }) => [`/`],
  "general": async ({ slug }) => [`/`],
  "in_english": async ({ slug }) => [`/english`],
}

export default {
  description: 'Under sommaren 2023 arrangerade Smålands konstinstitutioner, konstaktörer och mindre föreningar Smålandstriennalen tillsammans, och lanserade även det nybildade distriktet Konstfrämjandet Småland.',
  name: 'Gävleborg Art Guide',
  url: {
    dev: 'http://localhost:3000',
    public: 'https://www.gavleborg-art-guide.se',
  },
  theme: {
    background: '#efefef',
    color: '#cd3a00',
  },
  routes,
  sitemap: async () => {
    const { allPrograms } = await apiQuery<
      AllProgramsQuery,
      AllProgramsQueryVariables
    >(AllProgramsDocument, {
      all: true,
      tags: ['program', 'program_category'],
      variables: {
        first: 500,
        skip: 0,
      }
    });
    return [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
        lastmod: new Date(),
        changefreq: 'daily',
        priority: 1,
      },
      ...allPrograms.map(({ slug, _createdAt }) => ({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/${slug}`,
        lastmod: new Date(_createdAt),
        changefreq: 'weekly',
        priority: 0.8,
      }))
    ]
  }

} satisfies DatoCmsConfig