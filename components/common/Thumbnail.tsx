'use client';

import s from './Thumbnail.module.scss';
import cn from 'classnames';
import React from 'react';
import { Image } from 'react-datocms/image';
import { truncateWords } from 'next-dato-utils/utils';
import { Markdown } from 'next-dato-utils/components';
import Link from 'next/link';
import { formatDate } from '@lib/utils';
import { differenceInCalendarDays, differenceInMilliseconds } from 'date-fns';

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
}: Props) {
	const exhibithionIsSoon = startTime
		? differenceInCalendarDays(new Date(), new Date(startTime)) >= -10 &&
		  differenceInCalendarDays(new Date(), new Date(startTime)) <= 0 &&
		  differenceInMilliseconds(new Date(), new Date(startTime)) < 0
		: false;

	const metaFields = [
		formatDate(startDate),
		new Date(startDate).toDateString() !== new Date(endDate).toDateString() && formatDate(endDate),
		city,
	].filter(Boolean);

	return (
		<Link href={`/${slug}`} className={cn(s.thumbnail, groupShow && s.group)}>
			{image && (
				<figure className={s.imageWrap}>
					<Image data={image.responsiveImage} className={s.image} pictureClassName={s.picture} />
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
						{metaFields.length > 0 && <strong className='meta'>{metaFields.join(' – ')}</strong>}
					</div>
					<Markdown content={intro} className={'small'} />
				</div>
			)}
		</Link>
	);
}
