'use client';
import s from './Image.module.scss';
import React from 'react';
import { Image as DatoImage } from 'react-datocms';
import ImageGallery from './ImageGallery';

export type ImageBlockProps = {
	id: string;
	data: ImageRecord;
	onClick: Function;
	editable?: any;
};

export default function Image({ id, data: { image: images } }: ImageBlockProps) {
	if (!images || !images.length) return null;
	const isSingle = images.length === 1;

	return isSingle ? (
		<figure className={s.image}>
			<DatoImage data={images[0].responsiveImage} intersectionMargin='0px 0px 200% 0px' />
			{images[0].title && <figcaption>{images[0].title}</figcaption>}
		</figure>
	) : (
		<ImageGallery id={id} images={images} />
	);
}
