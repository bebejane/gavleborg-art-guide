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
				<ul className={s.meta}>

					<li>
						Datum: {formatDate(startDate, endDate)}</li>

					{programCategory && (
						<>
							<li>
								<span>Kategori: {programCategory.title}</span>
							</li>
						</>
					)}
					{address && (
						<>
							<li>
								<span>Adress: {address}</span>
							</li>
						</>
					)}
					{location && (
						<>
							<li>
								<span>
									Plats: {location.map(({ title, address }) => `${title}, ${address}`).join(', ')}
								</span>
							</li>
						</>
					)}
					{startTime && (
						<>
							<li>
								<span>Vernissage: {formatDate(startTime)}</span>
							</li>
						</>
					)}
					{time && (
						<>
							<li>
								<span>Tid: {time}</span>
							</li>
						</>
					)}
					{misc && (
						<>
							<li>
								<span>Övrigt: {misc}</span>
							</li>
						</>
					)}
					{externalLink && (
						<>
							<li>
								<span>
									Länk: <a href={externalLink}>Läs mer</a>
								</span>
							</li>
						</>
					)}
				</ul>
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
