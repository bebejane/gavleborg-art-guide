"use client";

import s from "./ExpandableList.module.scss";
import cn from "classnames";
import { useState } from "react";
import Content from "../common/Content";

export type ExpandableListProps = {
	data: ExpandableListRecord;
};
export default function ExpandableList({ data }: ExpandableListProps) {
	const [open, setOpen] = useState<{ [id: string]: boolean }>({});

	function toggle(id: string) {
		setOpen((state) => ({ ...state, [id]: state[id] ? false : true }));
	}

	return (
		<div
			className={s.list}
			role='list'
		>
			{data.items?.map((item) => (
				<div
					role='listitem'
					key={item.id}
					className={s.wrap}
					onClick={() => toggle(item.id)}
				>
					<div className={s.item}>
						<div className={s.title}>
							<p>
								<strong>{item.title}</strong>
							</p>
						</div>
						<div className={s.icon}>
							<p>
								<strong>+</strong>
							</p>
						</div>
					</div>

					<Content
						content={item.text}
						className={cn(s.text, open[item.id] && s.open)}
					/>
				</div>
			))}
		</div>
	);
}
