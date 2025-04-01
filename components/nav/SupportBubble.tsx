"use client";

import { useState } from "react";
import s from "./SupportBubble.module.scss";
import Link from "next/link";
import Modal from "../common/Modal";
import Content from "../common/Content";

export type SupportBubbleProps = {
	support: SupportQuery["support"];
};

export default function SupportBubble({ support }: SupportBubbleProps) {
	const [showPopup, setShowPopup] = useState(false);
	if (!support) return null;
	return (
		<>
			<div className={s.bubble}>
				<div
					className={s.wrap}
					onClick={() => setShowPopup(true)}
				>
					<div className={s.text}>
						<span className={s.title}>Stöd oss<br />—<br />och dig!</span>
						<span className="very-small">Läs mer</span>
					</div>
					<img
						src='/images/bubble.svg'
						alt='bubble'
					/>
				</div>
			</div >
			{showPopup && (
				<Modal>
					<div className={s.popup}>
						<div className={s.box}>
							<Content content={support.text} />
							<button onClick={() => setShowPopup(false)}>×</button>
						</div>
					</div>
				</Modal>
			)
			}
		</>
	);
}
