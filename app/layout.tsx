import '@/styles/index.scss';
import '@mantine/core/styles.css';
import s from './layout.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { GlobalDocument } from '@/graphql';
import { Metadata } from 'next';
import { Icon } from 'next/dist/lib/metadata/types/metadata-types';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Suspense } from 'react';
import Footer from '@/components/nav/Footer';
import { sv } from 'date-fns/locale';
import { setDefaultOptions } from 'date-fns/setDefaultOptions';
import { MantineColorsTuple, ColorSchemeScript, MantineProvider, mantineHtmlProps, createTheme } from '@mantine/core';

setDefaultOptions({ locale: sv });

export type LayoutProps = {
	children: React.ReactNode;
};

const yellow: MantineColorsTuple = [
	'#fffde1',
	'#fff9cb',
	'#fff29a',
	'#ffea64',
	'#ffe438',
	'#ffe01d',
	'#ffdd00',
	'#e3c500',
	'#caaf00',
	'#ae9600',
];

const theme = createTheme({
	white: '#fff',
	black: '#000',
	//primaryColor: 'var(--yellow)',
	primaryColor: 'yellow',
	defaultRadius: 3,
	colors: {
		yellow,
	},
});

export default async function RootLayout({ children }: LayoutProps) {
	return (
		<>
			<html lang='sv-SE' {...mantineHtmlProps}>
				<head>
					<ColorSchemeScript />
				</head>
				<body id='root'>
					<main className={s.main}>
						<Suspense>
							<MantineProvider theme={theme}>
								<NuqsAdapter>{children}</NuqsAdapter>
							</MantineProvider>
						</Suspense>
					</main>
					<Footer />
				</body>
			</html>
		</>
	);
}

export async function generateMetadata(): Promise<Metadata> {
	const {
		site: { globalSeo, faviconMetaTags },
	} = await apiQuery<GlobalQuery, GlobalQueryVariables>(GlobalDocument, {
		variables: {},
		revalidate: 60 * 60,
	});

	return {
		metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
		title: {
			template: `${globalSeo?.siteName} — %s`,
			default: globalSeo?.siteName,
		},
		description: globalSeo?.fallbackSeo?.description,
		image: globalSeo?.fallbackSeo?.image?.url,
		icons: faviconMetaTags.map(({ attributes: { rel, sizes, type, href: url } }) => ({
			rel,
			url,
			sizes,
			type,
		})) as Icon[],
		openGraph: {
			title: globalSeo?.siteName,
			description: globalSeo?.fallbackSeo?.description,
			url: process.env.NEXT_PUBLIC_SITE_URL,
			siteName: globalSeo?.siteName,
			images: [
				{
					url: `${globalSeo?.fallbackSeo?.image?.url}?w=1200&h=630&fit=fill&q=80`,
					width: 800,
					height: 600,
					alt: globalSeo?.siteName,
				},
				{
					url: `${globalSeo?.fallbackSeo?.image?.url}?w=1600&h=800&fit=fill&q=80`,
					width: 1600,
					height: 800,
					alt: globalSeo?.siteName,
				},
				{
					url: `${globalSeo?.fallbackSeo?.image?.url}?w=790&h=627&fit=crop&q=80`,
					width: 790,
					height: 627,
					alt: globalSeo?.siteName,
				},
			],
			locale: 'en_US',
			type: 'website',
		},
	} as Metadata;
}
