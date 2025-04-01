import s from './page.module.scss';
import cn from 'classnames';
import { apiQuery } from 'next-dato-utils/api';
import { AllProgramsDocument, ProgramDocument } from '@/graphql';
import { notFound } from '@node_modules/next/navigation';
import { DraftMode } from 'next-dato-utils/components';
import { Metadata } from 'next';
import Article from '@components/common/Article';
import MetaSection from '@components/common/MetaSection';
import { formatDate } from '@lib/utils';

export type ProgramProps = {
	params: Promise<{ program: string }>;
};

export default async function ProgramPage({ params }: ProgramProps) {
	const { program: slug } = await params;
	const { program, draftUrl } = await apiQuery<ProgramQuery, ProgramQueryVariables>(
		ProgramDocument,
		{
			variables: {
				slug,
			},
		}
	);

	if (!program) return notFound();

	const {
		id,
		image,
		title,
		intro,
		content,
		startDate,
		endDate,
		programCategory,
		address,
		location,
		time,
		misc,
		externalLink,
	} = program;

	return (
		<>
			<Article
				id={id}
				key={id}
				title={title}
				image={image as FileField}
				imageSize='small'
				intro={intro}
				content={content}
				date={startDate}
			>
				<div className={s.meta}>
					Datum: {formatDate(startDate, endDate)}
					<br />
					Kategori: {programCategory.title}
					<br />
					Adress: {address}
					<br />
					Plats: {location.map(({ title }) => title).join(', ')}
					<br />
					Tider: {time}
					<br />
					Övrigt: {misc}
					<br />
					Länk: <a href={externalLink}>{externalLink}</a>
				</div>
			</Article>
			<DraftMode url={draftUrl} path={`/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allPrograms } = await apiQuery<AllProgramsQuery, AllProgramsQueryVariables>(
		AllProgramsDocument,
		{
			all: true,
		}
	);

	return allPrograms.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
	const { program: slug } = await params;
	const { program } = await apiQuery<ProgramQuery, ProgramQueryVariables>(ProgramDocument, {
		variables: {
			slug,
		},
	});

	return {
		title: program.title,
	} as Metadata;
}
