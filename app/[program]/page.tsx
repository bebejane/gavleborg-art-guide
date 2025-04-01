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
import Link from 'next/link';

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
		startTime,
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
					{programCategory && (
						<>
							<span>Kategori: {programCategory.title}</span>
							<br />
						</>
					)}
					{address && (
						<>
							<span>Adress: {address}</span>
							<br />
						</>
					)}
					{location && (
						<>
							<span>
								Plats: {location.map(({ title, address }) => `${title}, ${address}`).join(', ')}
							</span>
							<br />
						</>
					)}
					{startTime && (
						<>
							<span>Vernissage: formatDate(startTime)</span>
							<br />
						</>
					)}
					{time && (
						<>
							<span>Tid: {time}</span>
							<br />
						</>
					)}
					{misc && (
						<>
							<span>Övrigt: {misc}</span>
							<br />
						</>
					)}
					{externalLink && (
						<>
							<span>
								Länk: <a href={externalLink}>Läs mer</a>
							</span>
							<br />
						</>
					)}
				</div>
				<Link href={`/`}>
					<button>Tillbaka</button>
				</Link>
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
