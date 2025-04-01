import s from "./ShortcutText.module.scss";
import cn from "classnames";
import Content from "@/components/common/Content";
import DatoLink from "@/components/nav/DatoLink";

type Props = {
	data: ShortcutTextRecord;
};

export default async function ShortcutText({ data: { id, text, link } }: Props) {
	return (
		<section
			id={id}
			className={s.container}
		>
			<Content
				content={text}
				className='intro'
			/>
			<DatoLink link={link}>
				<span className="shortcut">• {link.title}</span>
			</DatoLink>
		</section>
	);
}
