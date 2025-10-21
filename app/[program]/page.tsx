import s from './page.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { AllProgramsDocument, ProgramDocument } from '@/graphql';
import { notFound } from 'next/navigation';
import { DraftMode } from 'next-dato-utils/components';
import { Metadata } from 'next';
import Article from '@/components/common/Article';
import { formatDate, formatDateTime } from '@/lib/utils';
import React from 'react';
import BackButton from '@/components/nav/BackButton';

// --- Smarta datum utan punkt i månadsförkortning ---
const monthNames = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

const formatDateSmart = (d?: string, isStart = false) => {
	if (!d) return '';
	const dt = new Date(d);
	if (isNaN(dt.getTime())) return '';

	const nowYear = new Date().getFullYear();
	const day = dt.getDate();
	const month = monthNames[dt.getMonth()];
	const year = dt.getFullYear();

	let showYear = false;
	if (isStart) {
		// Startdatum: visa år om det är äldre än innevarande år
		if (year < nowYear) showYear = true;
	} else {
		// Slutdatum: visa år om det skiljer sig från innevarande år
		if (year !== nowYear) showYear = true;
	}

	return [day, month, showYear ? year : null].filter(Boolean).join(' ');
};

const sameDay = (a?: string, b?: string) => {
	if (!a || !b) return false;
	const da = new Date(a),
		db = new Date(b);
	return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
};

const dateRangeSmart = (start?: string, end?: string) => {
	if (!start) return '';
	if (!end || sameDay(start, end)) return formatDateSmart(start, true);
	return `${formatDateSmart(start, true)} – ${formatDateSmart(end, false)}`;
};

export type ProgramProps = {
	params: Promise<{ program: string }>;
};

export default async function ProgramPage({ params }: ProgramProps) {
	const { program: slug } = await params;
	const { program, draftUrl } = await apiQuery<ProgramQuery, ProgramQueryVariables>(ProgramDocument, {
		// This line also uses ProgramQuery and ProgramQueryVariables
		variables: {
			slug,
		},
	});

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
		organizer,
		location,
		time,
		misc,
		externalLink,
		startTime,
		permanent,
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
				<section className={s.misc}>
					<p>
						<i>{misc}</i>
					</p>
				</section>

				<ul className={s.meta}>
					{location && (
						<>
							<li>
								<strong>Datum:</strong>{' '}
								{!permanent ? dateRangeSmart(startDate, endDate) : `Permanent ${programCategory.title?.toLowerCase()}`}
							</li>
							<li>
								<span>
									<strong>Plats:</strong>&nbsp;
									{location.map(({ name, webpage }, idx) =>
										webpage ? (
											<a key={idx} href={webpage} target='_blank' rel='noreferrer'>
												{name} ›
											</a>
										) : (
											<React.Fragment key={idx}>{name}</React.Fragment>
										)
									)}
								</span>
							</li>
							<li>
								<strong>Adress:</strong>&nbsp;
								{location.map(({ address, map }, idx) =>
									map ? (
										<a key={idx} href={map} target='_new' rel='noreferrer'>
											{address} ›
										</a>
									) : (
										<React.Fragment key={idx}>{address}</React.Fragment>
									)
								)}
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
					{organizer && (
						<li>
							<span>
								<strong>Arrangör: </strong>
								{organizer}
							</span>
						</li>
					)}
					{externalLink && (
						<li>
							<span>
								<strong>Läs mer: </strong>
								<a href={externalLink}>Besök arrangörens sida ›</a>
							</span>
						</li>
					)}
				</ul>
				<BackButton />
			</Article>
			<DraftMode url={draftUrl} path={`/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allPrograms } = await apiQuery<AllProgramsQuery, AllProgramsQueryVariables>(AllProgramsDocument, {
		all: true,
	});

	return allPrograms.map(({ slug }) => ({ slug }));
}

type GenerateMetadataParams = {
	params: Promise<{
		program: string;
	}>;
};

export async function generateMetadata({ params }: GenerateMetadataParams): Promise<Metadata> {
	const { program: slug } = await params;
	const { program } = await apiQuery<ProgramQuery, ProgramQueryVariables>(ProgramDocument, {
		variables: {
			slug,
		},
	});
	if (!program) return notFound();

	return {
		title: program.title,
	} as Metadata;
}
