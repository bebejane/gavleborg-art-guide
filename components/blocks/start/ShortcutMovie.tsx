import s from "./ShortcutMovie.module.scss";
import cn from "classnames";
import { Image, isSeoLinkTag } from "react-datocms";
import { VideoPlayer } from "next-dato-utils/components";
import Content from "@/components/common/Content";
import Link from "next/link";
import DatoLink from "../../nav/DatoLink";

type Props = {
	data: ShortcutMovieRecord;
};

export default async function ShortcutMovie({ data: { id, text, movie, link } }: Props) {
	return (
		<section
			id={id}
			className={s.container}
		>
			<DatoLink link={link}>
				<VideoPlayer
					data={movie}
					className={s.video}
				/>
				<div className={s.content}>
					<Content
						content={text}
						className={cn(s.text, "intro")}
					/>
					<span className="shortcut">• {link.title}</span>
				</div>
			</DatoLink>
		</section>
	);
}
