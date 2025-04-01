import FilterBar from '@components/common/FilterBar';
import s from './page.module.scss';
import { AllProgramsDocument } from '@/graphql';
import Thumbnail from '@components/common/Thumbnail';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode, VideoPlayer } from 'next-dato-utils/components';
import cn from '@node_modules/classnames';
import { parseAsString } from 'nuqs/server';

const filterParser = parseAsString.withDefault('all');

export default async function Home({ searchParams }) {
	const filter = filterParser.parseServerSide((await searchParams).filter);
	const { allPrograms, allProgramCategories, draftUrl } = await apiQuery<
		AllProgramsQuery,
		AllProgramsQueryVariables
	>(AllProgramsDocument, {
		variables: {
			first: 100,
			skip: 0,
		},
		all: true,
		tags: ['program'],
	});

	function filterPrograms(programs: any[], filter: string) {
		if (filter === 'all') return programs;
		return programs.filter(({ programCategory: { slug } }) => slug === filter);
	}

	return (
		<>
			<article className={s.page}>
				<h1>Gävleborg Art Guide</h1>
				<FilterBar
					href={'/'}
					options={allProgramCategories.map(({ slug, title }) => ({ id: slug, label: title }))}
					value={'all'}
				/>
				<section>
					<h2>April</h2>
					<ul className={cn(s.container, 'grid')}>
						{filterPrograms(allPrograms, filter).map(
							({ id, title, image, intro, programCategory, slug }) => (
								<li key={id} className={s.card}>
									<Thumbnail
										slug={slug}
										title={title}
										image={image as FileField}
										intro={intro}
										meta={programCategory.title}
									/>
								</li>
							)
						)}
					</ul>
				</section>
				<section>
					<h2>Maj</h2>
					<ul className={cn(s.container, 'grid')}>
						{filterPrograms(allPrograms, filter).map(
							({ id, title, image, intro, programCategory, slug }) => (
								<li key={id} className={s.card}>
									<Thumbnail
										slug={slug}
										title={title}
										image={image as FileField}
										intro={intro}
										meta={programCategory.title}
									/>
								</li>
							)
						)}
					</ul>
				</section>
			</article>
			<DraftMode url={draftUrl} path='/' />
		</>
	);
}
