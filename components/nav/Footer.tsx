import s from './Footer.module.scss';
import Link from 'next/link';
import { apiQuery } from 'next-dato-utils/api';

export default async function Footer() {
	return <footer className={s.footer}></footer>;
}
