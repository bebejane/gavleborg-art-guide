'use client';

import s from './VideoInternal.module.scss';
import { VideoPlayer } from 'next-dato-utils/components';

export type VideoInternalProps = {
	data: VideoInternalRecord;
};
export default function VideoInternal({ data }: VideoInternalProps) {
	if (!data || !data.file) return null;
	return (
		<div className={s.wrap}>
			<VideoPlayer data={data.file} className={s.video} />
			<figcaption>{data.caption}</figcaption>
		</div>
	);
}
