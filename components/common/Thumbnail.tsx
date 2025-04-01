'use client';

import s from './Thumbnail.module.scss';
import cn from 'classnames';
import React, { useState } from 'react';
import { Image } from 'react-datocms/image';
import { truncateWords } from 'next-dato-utils/utils';
import { format } from 'date-fns';
import { remark } from 'remark';
import strip from 'strip-markdown';
import Link from 'next/link';

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
	groupShow,
}: Props) {
	const strippedIntro = truncateWords(remark().use(strip).processSync(intro).value as string, 500);
	const [loaded, setLoaded] = useState(false);

	return (
		<Link href={`/${slug}`} className={cn(s.thumbnail, groupShow && s.group)}>
			{image && (
				<div className={s.imageWrap}>
					<>
						<Image
							data={image.responsiveImage}
							className={s.image}
							pictureClassName={s.picture}
							onLoad={() => setLoaded(true)}
						/>
						<div className={s.border}></div>
					</>
				</div>
			)}
			<h3 className={cn(s[`rows-${titleRows}`])}>
				<span>{titleLength ? truncateWords(title, titleLength) : title}</span>
			</h3>
			{(strippedIntro || meta) && (
				<div className='thumb-intro'>
					<p className='small'>
						{meta && <strong className='meta'>{meta.trim()}</strong>}
						{startDate && <span className={s.date}>{format(new Date(startDate), 'dd MMM')}</span>}
						{strippedIntro}
					</p>
				</div>
			)}
		</Link>
	);
}
