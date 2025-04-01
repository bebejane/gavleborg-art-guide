'use client';

import s from './FilterBar.module.scss';
import cn from 'classnames';
import Link from 'next/link';
import { useQueryState } from 'nuqs';

type Props = {
	value: string;
	href: string;
	options: {
		id: string;
		label: string;
	}[];
};

export default function FilterBar({ options, href = '/', value }: Props) {
	return (
		<nav className={cn(s.filter)}>
			<div className={s.wrap}>
				Visa:
				<ul>
					<li>
						<Link href={`${href}`} shallow={true} prefetch={true}>
							<button aria-selected={value === 'all' || !value}>Alla</button>
						</Link>
					</li>
					{options.map(({ id, label }, idx) => (
						<li key={idx}>
							<Link href={`${href}?filter=${id}`} shallow={true} prefetch={true}>
								<button aria-selected={value === id}>{label}</button>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
}
