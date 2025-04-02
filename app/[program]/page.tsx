import s from './page.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { AllProgramsDocument, ProgramDocument } from '@/graphql';
import { notFound } from '@node_modules/next/navigation';
import { DraftMode } from 'next-dato-utils/components';
import { Metadata } from 'next';
import Article from '@components/common/Article';
import { formatDate, formatDateTime } from '@lib/utils';
import Link from 'next/link';
import React from 'react';

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
						<strong>Datum:</strong> {formatDate(startDate, endDate)}
					</li>
					{location && (
						<>
							<li>
								<span>
									<strong>Plats:</strong>&nbsp;
									{location.map(({ title, webpage }, idx) =>
										webpage ? (
											<a key={idx} href={webpage} target='_blank' rel='noreferrer'>
												{title} →
											</a>
										) : (
											<React.Fragment key={idx}>{title}</React.Fragment>
										)
									)}
								</span>
							</li>
							<li>
								<span>
									<strong>Adress: </strong>
									{location.map(({ address, city, map }, idx) =>
										map ? (
											<a key={idx} href={map} target='_blank' rel='noreferrer'>
												{address}, {city} →
											</a>
										) : (
											<React.Fragment key={idx}>
												{address}, {city} →
											</React.Fragment>
										)
									)}
								</span>
							</li>
						</>
					)}
					{startTime && (
						<li>
							<span>
								<strong>Vernissage: </strong>
								{formatDateTime(startTime)}
							</span>
						</li>
					)}
					{time && (
						<li>
							<span>
								<strong>Öppettider: </strong> {time}
							</span>
						</li>
					)}
					{misc && (
						<li>
							<span>
								<strong>Övrigt: </strong>
								{misc}
							</span>
						</li>
					)}
					{externalLink && (
						<li>
							<span>
								<strong>Extern länk: </strong>
								<a href={externalLink}>Läs mer →</a>
							</span>
						</li>
					)}
				</ul>
				<Link href={`/`}>
					<button className={s.back}>Tillbaka</button>
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
