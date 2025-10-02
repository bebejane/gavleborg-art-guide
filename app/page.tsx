import s from './page.module.scss';
import cn from 'classnames';
import { AllProgramsDocument } from '@/graphql';
import Thumbnail from '@/components/common/Thumbnail';
import FilterBar from '@/components/common/FilterBar';
import { apiQuery } from 'next-dato-utils/api';
import { DraftMode } from 'next-dato-utils/components';
import { parseAsString } from 'nuqs/server';
import { format } from 'date-fns';
import { capitalize } from 'next-dato-utils/utils';

const filterParser = parseAsString.withDefault('all');

export default async function Home({ searchParams }) {
	const filter = filterParser.parseServerSide((await searchParams).filter);
	const { allPrograms, allProgramCategories, draftUrl } = await apiQuery<AllProgramsQuery, AllProgramsQueryVariables>(
		AllProgramsDocument,
		{
			all: true,
			tags: ['program', 'program_category'],
			variables: {
				first: 100,
				skip: 0,
			},
		}
	);

	function filterPrograms(programs: any[]) {
		if (filter === 'all') return programs;
		return programs.filter(({ programCategory: { slug } }) => slug === filter);
	}

	//const programs = programsByMonth(filterPrograms(allPrograms));
	const programs = programsByYear(filterPrograms(allPrograms));

	return (
		<>
			<article className={s.page}>
				<h1>Gävleborg Art Guide</h1>
				<FilterBar
					href={'/'}
					options={allProgramCategories.map(({ slug, plural }) => ({
						id: slug,
						label: plural,
					}))}
					value={filter}
				/>
				{programs.map(({ year, months }, idx) =>
					months.map(({ month, programs }, idx2) => (
						<section key={idx2}>
							<h2>{capitalize(month)}</h2>
							<ul className={cn(s.container, 'grid')}>
								{programs.map(
									(
										{ title, image, intro, programCategory, slug, startDate, endDate, startTime, groupShow, location },
										idx: number
									) => (
										<li key={`${idx}-${idx2}`} className={s.card}>
											<Thumbnail
												slug={slug}
												title={title}
												image={image as FileField}
												intro={intro}
												startDate={startDate}
												endDate={endDate}
												startTime={startTime}
												groupShow={groupShow}
												city={location
													?.map(({ city }) => city)
													.filter(Boolean)
													.join(', ')}
												meta={programCategory.title}
											/>
										</li>
									)
								)}
							</ul>
						</section>
					))
				)}
			</article>
			<DraftMode url={draftUrl} path='/' />
		</>
	);
}

function programsByMonth(programs: AllProgramsQuery['allPrograms']) {
	const months = [
		'januari',
		'februari',
		'mars',
		'april',
		'maj',
		'juni',
		'juli',
		'augusti',
		'september',
		'oktober',
		'november',
		'december',
	];
	// Filter out inactive programs
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const filteredPrograms = programs.filter((program) => {
		const startDate = new Date(program.startDate);
		const endDate = program.endDate ? new Date(program.endDate) : null;
		let active = false;
		if (endDate) {
			// If program has end date, check if it's still active
			endDate.setHours(0, 0, 0, 0);
			active = endDate >= today;
		} else {
			// If no end date, check if it's in the current month
			active = startDate.getMonth() === today.getMonth() && startDate.getFullYear() === today.getFullYear();
		}
		return active;
	});

	const programsByMonth = filteredPrograms.reduce((acc, program) => {
		const startDate = new Date(program.startDate);
		const endDate = program.endDate ? new Date(program.endDate) : null;

		// Get start and end months
		const startMonth = format(startDate, 'MMMM');
		const endMonth = endDate ? format(endDate, 'MMMM') : startMonth;

		// Initialize the month in accumulator if it doesn't exist
		if (!acc[startMonth]) acc[startMonth] = [];
		acc[startMonth].push(program);

		// If there's an end date, add the program to all months between start and end
		if (endDate) {
			const startIdx = months.indexOf(startMonth.toLowerCase());
			const endIdx = months.indexOf(endMonth.toLowerCase());

			// Handle case where end date is in the next year
			const monthsToAdd =
				endIdx >= startIdx
					? months.slice(startIdx + 1, endIdx + 1)
					: [...months.slice(startIdx + 1), ...months.slice(0, endIdx + 1)];

			monthsToAdd.forEach((month) => {
				const formattedMonth = format(new Date(`${startDate.getFullYear()}-${months.indexOf(month) + 1}-01`), 'MMMM');
				if (!acc[formattedMonth]) acc[formattedMonth] = [];
				acc[formattedMonth].push(program);
			});
		}

		return acc;
	}, {});

	const currentMonthIdx = today.getMonth();

	return (
		Object.keys(programsByMonth)
			// Filter out months before current month
			.filter((month) => {
				const monthIdx = months.indexOf(month.toLowerCase());
				return monthIdx >= currentMonthIdx;
			})
			// Sort remaining months
			.sort((a, b) => {
				const aIdx = months.indexOf(a.toLowerCase());
				const bIdx = months.indexOf(b.toLowerCase());
				return aIdx - bIdx;
			})
			.map((month) => {
				// Sort programs within the month
				const monthPrograms = programsByMonth[month].sort((a, b) => {
					const aStartMonth = format(new Date(a.startDate), 'MMMM');
					const bStartMonth = format(new Date(b.startDate), 'MMMM');

					// If program starts in this month, it should come first
					if (aStartMonth === month && bStartMonth !== month) return -1;
					if (bStartMonth === month && aStartMonth !== month) return 1;

					// If both programs are continuing or both starting, sort by start date
					return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
				});

				return {
					month,
					programs: monthPrograms,
				};
			})
	);
}

function programsByYear(programs: AllProgramsQuery['allPrograms']) {
	const months = [
		'januari',
		'februari',
		'mars',
		'april',
		'maj',
		'juni',
		'juli',
		'augusti',
		'september',
		'oktober',
		'november',
		'december',
	];
	// Filter out inactive programs
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const filteredPrograms = programs.filter((program) => {
		const startDate = new Date(program.startDate);
		const endDate = program.endDate ? new Date(program.endDate) : null;
		let active = false;
		if (endDate) {
			// If program has end date, check if it's still active
			endDate.setHours(0, 0, 0, 0);
			active = endDate >= today;
		} else {
			// If no end date, check if it's in the current month
			active = startDate.getMonth() === today.getMonth() && startDate.getFullYear() === today.getFullYear();
		}
		return active;
	});

	// Group programs by year first
	const programsByYear = filteredPrograms.reduce((acc, program) => {
		const startDate = new Date(program.startDate);
		const year = startDate.getFullYear();

		// Initialize the year in accumulator if it doesn't exist
		if (!acc[year]) acc[year] = [];
		acc[year].push(program);

		// If there's an end date, add the program to all years between start and end
		const endDate = program.endDate ? new Date(program.endDate) : null;
		if (endDate) {
			const endYear = endDate.getFullYear();
			for (let y = year + 1; y <= endYear; y++) {
				if (!acc[y]) acc[y] = [];
				acc[y].push(program);
			}
		}

		return acc;
	}, {});

	const currentYear = today.getFullYear();

	return (
		Object.keys(programsByYear)
			// Filter out years before current year
			.filter((year) => parseInt(year) >= currentYear)
			// Sort years
			.sort((a, b) => parseInt(a) - parseInt(b))
			.map((year) => {
				const yearPrograms = programsByYear[year];

				// Apply the same month grouping logic for programs within this year
				const programsByMonth = yearPrograms.reduce((acc, program) => {
					const startDate = new Date(program.startDate);
					const endDate = program.endDate ? new Date(program.endDate) : null;

					// Get start and end months
					const startMonth = format(startDate, 'MMMM');
					const endMonth = endDate ? format(endDate, 'MMMM') : startMonth;

					// Initialize the month in accumulator if it doesn't exist
					if (!acc[startMonth]) acc[startMonth] = [];
					acc[startMonth].push(program);

					// If there's an end date, add the program to all months between start and end
					if (endDate) {
						const startIdx = months.indexOf(startMonth.toLowerCase());
						const endIdx = months.indexOf(endMonth.toLowerCase());

						// Handle case where end date is in the next year
						const monthsToAdd =
							endIdx >= startIdx
								? months.slice(startIdx + 1, endIdx + 1)
								: [...months.slice(startIdx + 1), ...months.slice(0, endIdx + 1)];

						monthsToAdd.forEach((month) => {
							const formattedMonth = format(
								new Date(`${startDate.getFullYear()}-${months.indexOf(month) + 1}-01`),
								'MMMM'
							);
							if (!acc[formattedMonth]) acc[formattedMonth] = [];
							acc[formattedMonth].push(program);
						});
					}

					return acc;
				}, {});

				// For current year, filter out months before current month
				const currentMonthIdx = today.getMonth();
				const isCurrentYear = parseInt(year) === currentYear;

				const monthsData = Object.keys(programsByMonth)
					.filter((month) => {
						if (!isCurrentYear) return true;
						const monthIdx = months.indexOf(month.toLowerCase());
						return monthIdx >= currentMonthIdx;
					})
					.sort((a, b) => {
						const aIdx = months.indexOf(a.toLowerCase());
						const bIdx = months.indexOf(b.toLowerCase());
						return aIdx - bIdx;
					})
					.map((month) => {
						// Sort programs within the month
						const monthPrograms = programsByMonth[month].sort((a, b) => {
							const aStartMonth = format(new Date(a.startDate), 'MMMM');
							const bStartMonth = format(new Date(b.startDate), 'MMMM');

							// If program starts in this month, it should come first
							if (aStartMonth === month && bStartMonth !== month) return -1;
							if (bStartMonth === month && aStartMonth !== month) return 1;

							// If both programs are continuing or both starting, sort by start date
							return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
						});

						return {
							month,
							programs: monthPrograms,
						};
					});

				return {
					year: parseInt(year),
					months: monthsData,
				};
			})
	);
}
