'use client';

import s from './NavbarMobile.module.scss';
import cn from 'classnames';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, getSelectedMenuItem } from '@/lib/menu';
import Hamburger from './Hamburger';

export type NavbarMobileProps = {
	menu: Menu;
};

export default function NavbarMobile({ menu }: NavbarMobileProps) {
	const path = usePathname();
	const qs = useSearchParams().toString();
	const pathname = `${path}${qs.length > 0 ? `?${qs}` : ''}`;
	const [selected, setSelected] = useState<string | null>(
		getSelectedMenuItem(menu, path, qs)?.id ?? null
	);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		setOpen(false);
		setSelected(getSelectedMenuItem(menu, path, qs)?.id ?? null);
	}, [path, qs]);

	return (
		<>
			<div className={cn(s.topbar, open && s.open)}>
				<figure className={s.logo}>
					<Link href={'/'}>
						<img src={open ? '/images/logo-white.svg' : '/images/logo.svg'} alt='Logo' />
					</Link>
				</figure>
				<div className={s.hamburger}>
					<Hamburger
						toggled={open}
						color={open ? 'white' : 'black'}
						size={36}
						onToggle={(state) => setOpen(state)}
					/>
				</div>
			</div>
			<nav className={cn(s.navbarMobile, open && s.open)}>
				<ul className={s.menu}>
					{menu.map(({ id, title, href, slug, sub, hideSub }) => (
						<li
							key={id}
							className={cn(sub && s.dropdown, pathname.startsWith(slug) && s.active)}
							onClick={() => setSelected(selected === id ? null : id)}
						>
							{sub && (
								<>
									{!hideSub ? <span>{title}</span> : <Link href={slug ?? href}>{title}</Link>}
									{selected === id && !hideSub && (
										<ul onClick={(e) => e.stopPropagation()}>
											{sub.map(({ id, title, href, slug }) => (
												<li key={id} className={cn(pathname === slug && s.active)}>
													<Link href={slug ?? href}>{title}</Link>
												</li>
											))}
										</ul>
									)}
								</>
							)}
						</li>
					))}
					<li className={cn(pathname === '/english' && s.active)}>
						<Link href={'/english'}>EN</Link>
					</li>
				</ul>
			</nav>
		</>
	);
}
