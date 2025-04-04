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
}: Props) {
	const exhibithionIsSoon = startTime
		? differenceInCalendarDays(new Date(), new Date(startTime)) >= -3 &&
		  differenceInCalendarDays(new Date(), new Date(startTime)) <= 0 &&
		  differenceInMilliseconds(new Date(), new Date(startTime)) < 0
		: false;

	return (
		<Link href={`/${slug}`} className={cn(s.thumbnail, groupShow && s.group)}>
			{image && (
				<figure className={s.imageWrap}>
					<Image data={image.responsiveImage} className={s.image} pictureClassName={s.picture} />
					<div className={s.border} />
					{groupShow && <div className={s.circle} />}
					{exhibithionIsSoon && <span className={s.soon}>Snart vernissage</span>}
				</figure>
			)}
			<h3 className={cn(s[`rows-${titleRows}`])}>
				<span>{titleLength ? truncateWords(title, titleLength) : title}</span>
			</h3>
			{(intro || meta) && (
				<div className='thumb-intro'>
					<div className={s.meta}>
						{meta && <strong className='meta'>{meta.trim()}</strong>} <span>•</span>{' '}
						{startDate && (
							<strong className='meta'>
								{formatDate(startDate)} – {formatDate(endDate)}
							</strong>
						)}
					</div>
					<Markdown content={intro} className={'small'} />
				</div>
			)}
		</Link>
	);
}
