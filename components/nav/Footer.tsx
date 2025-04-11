import s from './Footer.module.scss';
import Link from 'next/link';
import { apiQuery } from 'next-dato-utils/api';

export default async function Footer() {
	return <footer className={s.footer}>

		<div>Gävleborg Art Guide drivs av&nbsp;<a href="https://gavleborg.konstframjandet.se/">Konstfrämjandet Gävleborg</a>, och har startat upp med stöd av Region Gävleborg och&nbsp;<a href="https://www.konstframjandet.se/">Folkrörelsernas Konstfrämjande</a>. Vill du att ditt evenemang ska synas här? <a href="mailto:gavleborg@konstframjandet.se">Kontakta oss</a>! </div>
		<div className={s.contact}><a href="https://www.facebook.com/konstframjandetgavleborg">Facebook</a> <a href="https://www.instagram.com/konstframjandetgavleborg/">Instagram</a> <a href="mailto:gavleborg@konstframjandet.se">Kontakt</a></div>
	</footer>;
}
