'use client';
import s from './Article.module.scss';
import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import Content from '@/components/common/Content';
import { Image } from 'react-datocms';
import format from 'date-fns/format';
import { Markdown } from 'next-dato-utils/components';
import useIsDesktop from '@/lib/useIsDesktop';

export type ArticleProps = {
	id: string;
	children?: React.ReactNode | React.ReactNode[] | undefined;
	title?: string;
	subtitle?: string;
	intro?: string;
	image?: FileField;
	imageSize?: 'small' | 'medium' | 'large';
	content?: any;
	onClick?: (id: string) => void;
	record?: any;
	date?: string;
	partner?: PartnerRecord[];
};

export default function Article({
	id,
	children,
	title,
	content,
	image,
	imageSize,
	intro,
	partner,
	date,
	onClick,
	record,
}: ArticleProps) {
	//const [setImageId, setImages] = useStore((state) => [state.setImageId, state.setImages]);
	const captionRef = useRef<HTMLElement | null>(null);
	const figureRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const images = [image];
		content?.blocks.forEach((el) => {
			el.__typename === 'ImageRecord' && images.push(el.image);
			el.__typename === 'ImageGalleryRecord' && images.push.apply(images, el.images);
		});
		//setImages(images.filter((el) => el));
	}, []);

	return (
		<>
			<div className={cn(s.article, 'article')}>
				<h1>{title}</h1>
				{image && (
					<figure
						className={cn(
							s.mainImage,
							imageSize && s[imageSize],
							image.height > image.width && s.portrait
						)}
						//onClick={() => setImageId(image?.id)}
						ref={figureRef}
					>
						<Image data={image.responsiveImage} pictureClassName={s.picture} />
						<figcaption ref={captionRef}>{image.title}</figcaption>
					</figure>
				)}
				<div className={s.content}>
					<section className='intro'>
						{date && (
							<div className={s.date}>
								<span className='small'>{format(new Date(date), 'MMM').replace('.', '')}</span>
								<span>{format(new Date(date), 'dd').replace('.', '')}</span>
							</div>
						)}
						<Markdown className={s.intro} content={intro} />
					</section>
					{content && (
						<>
							<div className='structured'>
								<Content id={id} content={content} />
							</div>
						</>
					)}
					{children}
				</div>
			</div>
		</>
	);
}
