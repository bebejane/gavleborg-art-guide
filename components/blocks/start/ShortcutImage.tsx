import s from "./ShortcutImage.module.scss";
import { Image } from "react-datocms";
import Content from "@/components/common/Content";
import DatoLink from "@/components/nav/DatoLink";

type Props = {
	data: ShortcutImageRecord;
};

export default async function ShortcutImage({ data: { id, images } }: Props) {
	return (
		<section
			id={id}
			className={s.container}
		>
			{images.map(({ id, image, link, title, text }, i) => (
				<DatoLink
					key={i}
					link={link}
				>
					<figure>
						{image.responsiveImage && (
							<Image
								data={image.responsiveImage}
								className={s.image}
								imgClassName={s.picture}
								intersectionMargin={`0px 0px 100% 0px`}
							/>
						)}
						<div className={s.figcaption}>
							<h2>{title}</h2>
							<Content
								content={text}
								className='small sans'
							/>
						</div>
					</figure>
				</DatoLink>
			))}
		</section>
	);
}
