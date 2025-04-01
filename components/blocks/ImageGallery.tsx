'use client';

import s from './ImageGallery.module.scss';
import cn from 'classnames';
import React, { useState, useRef, useEffect } from 'react';
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import type { Swiper } from 'swiper';
import { Image } from 'react-datocms';

export type ImageGalleryBlockProps = {
	id: string;
	images: ImageFileField[];
	onClick?: Function;
	editable?: boolean;
};

export default function ImageGallery({
	id,
	images,
	onClick,
	editable = false,
}: ImageGalleryBlockProps) {
	const swiperRef = useRef<Swiper | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [caption, setCaption] = useState<string | null>(images[0].title);
	const [index, setIndex] = useState(0);

	useEffect(() => {
		setCaption(images[index]?.title ?? null);
	}, [images, index]);

	return (
		<div className={s.gallery} ref={containerRef}>
			<div className={s.nav}>
				<button onClick={() => swiperRef.current?.slidePrev()}>
					<img className={cn(s.arrow, s.back)} src='/images/arrow.svg' alt='arrow' />
				</button>
				<button onClick={() => swiperRef.current?.slideNext()}>
					<img className={cn(s.arrow, s.forward)} src='/images/arrow.svg' alt='arrow' />
				</button>
			</div>
			<figcaption className={s.caption}>{caption}</figcaption>
			<SwiperReact
				id={`${id}-swiper-wrap`}
				className={s.swiper}
				loop={true}
				noSwiping={false}
				simulateTouch={true}
				slidesPerView={'auto'}
				autoHeight={true}
				initialSlide={index}
				onSlideChange={({ realIndex }) => setIndex(realIndex)}
				onSwiper={(swiper) => (swiperRef.current = swiper)}
			>
				{images.map((item, idx) => (
					<SwiperSlide
						key={idx}
						onClick={() => swiperRef.current?.slideNext()}
						className={cn(s.slide, item.height > item.width && s.portrait)}
					>
						<figure id={`${id}-${item.id}`} onClick={() => onClick?.(item.id)}>
							<Image
								data={item.responsiveImage}
								className={s.image}
								pictureClassName={s.picture}
								placeholderClassName={s.picture}
								objectFit={'cover'}
								intersectionMargin='0px 0px 200% 0px'
							/>
						</figure>
					</SwiperSlide>
				))}
			</SwiperReact>
		</div>
	);
}
