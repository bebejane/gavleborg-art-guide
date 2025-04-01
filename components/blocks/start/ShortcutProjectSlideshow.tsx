'use client';

import s from './ShortcutProjectSlideshow.module.scss';
import cn from 'classnames';
import { useRef, useState } from 'react';
import { Image } from 'react-datocms';
import { apiQuery } from 'next-dato-utils/api';
import { AllProjectsDocument } from '@/graphql';
import Link from 'next/link';
import { Swiper as SwiperReact, SwiperSlide } from 'swiper/react';
import type { Swiper } from 'swiper';

type Props = {
	projects: AllProjectsQuery['allProjects'];
};

export default function ShortcutProjectSlideshow({ projects }: Props) {
	const swiperRef = useRef<Swiper | null>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [index, setIndex] = useState(0);

	return (
		<section className={s.container}>
			<header>
				<h2>Projekt</h2>
				<div className={s.nav}>
					<Link href='/projekt' className='shortcut'>
						Visa alla
					</Link>
					<button onClick={() => swiperRef.current?.slidePrev()}>
						<img className={cn(s.arrow, s.back)} src='/images/arrow.svg' alt='arrow' />
					</button>
					<button onClick={() => swiperRef.current?.slideNext()}>
						<img className={cn(s.arrow, s.forward)} src='/images/arrow.svg' alt='arrow' />
					</button>
				</div>
			</header>
			<SwiperReact
				className={s.swiper}
				loop={true}
				noSwiping={false}
				simulateTouch={true}
				slidesPerView={'auto'}
				initialSlide={index}
				onSlideChange={({ realIndex }) => setIndex(realIndex)}
				onSwiper={(swiper) => (swiperRef.current = swiper)}
			>
				{projects.map(({ id, title, image, slug }) => (
					<SwiperSlide key={id} className={cn(s.slide)}>
						<Link key={id} href={`/projekt/${slug}`}>
							<figure>
								<Image
									data={image.responsiveImage}
									className={s.image}
									imgClassName={s.picture}
									intersectionMargin={`0px 0px 100% 0px`}
								/>
								<figcaption>
									<p>
										<strong>{title}</strong>
									</p>
								</figcaption>
							</figure>
						</Link>
					</SwiperSlide>
				))}
			</SwiperReact>
		</section>
	);
}
