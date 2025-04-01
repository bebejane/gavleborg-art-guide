import FilterBar from '@components/common/FilterBar';
import s from './page.module.scss';
import { AllProgramsDocument } from '@/graphql';
import Thumbnail from '@components/common/Thumbnail';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode, VideoPlayer } from 'next-dato-utils/components';

export default async function Home() {
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

	return (
		<>
			<article className={s.page}>
				<FilterBar
					href={'/'}
					options={allProgramCategories.map(({ id, title }) => ({ id, label: title }))}
					value={'all'}
				/>
				<section>
					<h2>April</h2>
					<ul className={s.container}>
						{allPrograms.map(({ id, title, image, intro, programCategory, slug }) => (
							<li key={id} className={s.card}>
								<Thumbnail
									slug={slug}
									title={title}
									image={image as FileField}
									intro={intro}
									meta={programCategory.title}
								/>
							</li>
						))}
					</ul>
				</section>
				<section>
					<h2>Maj</h2>
					<ul className={s.container}>
						{allPrograms.map(({ id, title, image, intro, programCategory, slug }) => (
							<li key={id} className={s.card}>
								<Thumbnail
									slug={slug}
									title={title}
									image={image as FileField}
									intro={intro}
									meta={programCategory.title}
								/>
							</li>
						))}
					</ul>
				</section>
			</article>
			<DraftMode url={draftUrl} path='/' />
		</>
	);
}
