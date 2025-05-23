'use client';
import s from './BackButton.module.scss';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BackButton() {
	const router = useRouter();
	const [haveBack, setHaveBack] = useState(true);

	useEffect(() => {
		setHaveBack(window.history.length > 2);
	}, [router]);

	return (
		<button className={s.back} onClick={() => (haveBack ? router.back() : router.push('/'))}>
			Tillbaka
		</button>
	);
}
