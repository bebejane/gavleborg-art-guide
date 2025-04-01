import useIsDesktop from '@lib/useIsDesktop';
import s from './FilterBar.module.scss';
import cn from 'classnames';
import { useEffect, useState } from 'react';

export type FilterOption = {
	id: string;
	label: string;
	description: string;
};

export type Props = {
	options: FilterOption[];
	multi?: boolean;
	onChange: (value: string[] | string) => void;
};

export default function FilterBar({ options = [], onChange, multi = false }: Props) {
	const [selected, setSelected] = useState<FilterOption[]>([]);
	const [open, setOpen] = useState(true);
	const isDesktop = useIsDesktop();

	useEffect(() => {
		onChange(multi ? selected.map(({ id }) => id) : selected[0]?.id);
	}, [selected]);

	return (
		<nav className={cn(s.filter, open && !isDesktop && s.open)}>
			<ul onClick={() => setOpen(!open)}>
				<li onClick={() => setSelected([])} className={cn(!selected?.length && s.selected)}>
					Alla
					<span className={s.arrow}>›</span>
				</li>
				{options.map((opt, idx) => (
					<li
						key={idx}
						onClick={() =>
							((!open && !isDesktop) || isDesktop) &&
							setSelected(
								selected.find(({ id }) => id === opt.id)
									? selected.filter(({ id }) => id !== opt.id)
									: multi
									? [...selected, opt]
									: [opt]
							)
						}
						className={cn(selected?.find(({ id }) => id === opt.id) && s.selected)}
					>
						{opt.label}
						<span className={s.arrow}>›</span>
					</li>
				))}
			</ul>
			{!multi && selected && <div className={s.description}>{selected[0]?.description}</div>}
		</nav>
	);
}
