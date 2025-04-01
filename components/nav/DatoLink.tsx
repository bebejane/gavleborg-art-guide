import Link from "next/link";
import { recordToRoute } from "@/lib/routes";

export type Props = {
	link: ExternalLinkRecord | InternalLinkRecord | any;
	className?: string;
	children?: React.ReactNode;
};

export default function DatoLink({ link, className, children }: Props) {
	if (!link) return <a className={className}>{children}</a>;

	const slug = link.__typename === "ExternalLinkRecord" ? link.url : recordToRoute(link.link);
	const title = link.__typename === "ExternalLinkRecord" ? link.title : link.link.title;

	return link.__typename === "ExternalLinkRecord" ? (
		<a
			href={slug}
			className={className}
		>
			{children ?? title}
		</a>
	) : (
		<Link
			href={slug}
			className={className}
		>
			{children ?? title}
		</Link>
	);
}
