import s from "./ShortcutNews.module.scss";
import cn from "classnames";
import { apiQuery } from "next-dato-utils/api";
import { AllNewsDocument } from "@/graphql";
import Link from "next/link";
import Content from "@/components/common/Content";
import { format } from "date-fns";

type Props = {
	data: ShortcutNewsRecord;
};

export default async function ShortcutNews({ data: { id } }: Props) {
	const { allNews } = await apiQuery<AllNewsQuery, AllNewsQueryVariables>(AllNewsDocument, {
		variables: {
			first: 3,
		},
	});

	return (
		<section
			id={id}
			className={s.container}
		>
			<div className={s.header}>
				<h2>Nyheter</h2>
				<Link
					href='/nyheter/aktuellt'
					className='shortcut'
				>
					Visa alla
				</Link>
			</div>
			<ul className={s.news}>
				{allNews.map(({ id, title, slug, intro, _firstPublishedAt }) => (
					<Link
						key={id}
						href={`/nyheter/aktuellt/${slug}`}
					>
						<h3>{title}</h3>
						<span className={cn("meta", s.date)}>
							{format(new Date(_firstPublishedAt), "MM/dd yyyy")} ·{" "}
						</span>
						<Content
							content={intro}
							className={cn("small", s.content)}
						/>
					</Link>
				))}
			</ul>
		</section>
	);
}
