'use client';

import s from './Thumbnail.module.scss';
import cn from 'classnames';
import React from 'react';
import { Image } from 'react-datocms/image';
import { truncateWords } from 'next-dato-utils/utils';
import { Markdown } from 'next-dato-utils/components';
import Link from 'next/link';
import { differenceInCalendarDays, differenceInMilliseconds } from 'date-fns';

const formatDateSmart = (d?: string, isStart = false) => {
	if (!d) return '';
	const dt = new Date(d);
	if (isNaN(dt.getTime())) return '';

	const nowYear = new Date().getFullYear();
	const monthNames = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

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

export type Props = {
	image?: FileField;
	slug: string;
	title: string;
	titleLength?: number;
	titleRows?: number;
	intro?: string;
	meta?: string;
	startDate?: string;
	endDate?: string;
	startTime?: string;
	groupShow?: boolean;
	city?: string;
	permanent?: boolean;
};

export default function Thumbnail({
	image,
	slug,
	intro,
	title,
	titleLength,
	titleRows = 3,
	meta,
	startDate,
	endDate,
	startTime,
	groupShow,
	city,
	permanent,
}: Props) {
	const exhibithionIsSoon = startTime
		? differenceInCalendarDays(new Date(), new Date(startTime)) >= -10 &&
			differenceInCalendarDays(new Date(), new Date(startTime)) <= 0 &&
			differenceInMilliseconds(new Date(), new Date(startTime)) < 0
		: false;

	const metaFields = permanent
		? ['Permanent']
		: [
				formatDateSmart(startDate, true),
				startDate && endDate && new Date(startDate).toDateString() !== new Date(endDate).toDateString()
					? formatDateSmart(endDate, false)
					: '',
			].filter(Boolean);

	return (
		<Link href={`/${slug}`} className={cn(s.thumbnail, groupShow && s.group)}>
			{image && (
				<figure className={s.imageWrap}>
					<Image
						data={image.responsiveImage}
						className={s.image}
						pictureClassName={s.picture}
						intersectionMargin={`0px 0px 2000px 0px`}
					/>
					<div className={s.border} />
					{groupShow && <div className={s.circle} />}
				</figure>
			)}
			{exhibithionIsSoon && <div className={cn('meta', s.soon)}>snart Vernissage</div>}
			<h3 className={cn(s[`rows-${titleRows}`])}>
				<span>{titleLength ? truncateWords(title, titleLength) : title}</span>
			</h3>
			{(intro || meta) && (
				<div className='thumb-intro'>
					<div className={s.meta}>
						{meta && <strong className='meta'>{meta.trim()}</strong>} <span>•</span>{' '}
						{metaFields.length > 0 && <strong className='meta'>{metaFields.join(' – ')}</strong>} <span>•</span>{' '}
						<strong className='meta'>{city}</strong>
					</div>
					<Markdown content={intro} className={'small'} />
				</div>
			)}
		</Link>
	);
}
