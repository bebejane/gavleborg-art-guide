'use client';

import s from './Hamburger.module.scss';
import cn from 'classnames';
import React, { useState, useEffect, useRef } from 'react';

export type HamburgerProps = {
	toggled: boolean;
	color: string;
	size: number;
	onToggle: (state: boolean) => void;
};
export default function Hamburger({ toggled, onToggle, size }: HamburgerProps) {
	const [key, setKey] = useState(Math.random());
	const [init, setInit] = useState(false);
	const handleClick = (e) => {
		setInit(true);
		onToggle(!toggled);
		setKey(Math.random());
		e.stopPropagation();
	};

	return (
		<div className={cn(s.hamburger, toggled && s.toggled)} onClick={handleClick}>
			<div className={s.wrap}>
				{new Array(3).fill(0).map((_, i) => (
					<div
						id={`l${i + 1}`}
						key={`${key}-${i + 1}`}
						className={cn(init && s.init, !toggled ? s.opened : s.closed)}
					></div>
				))}
			</div>
		</div>
	);
}
