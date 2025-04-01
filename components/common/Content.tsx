import { StructuredContent } from 'next-dato-utils/components';
import s from './Content.module.scss';
import cn from 'classnames';

export type Props = {
	id?: string;
	content: any;
	styles?: any;
	className?: string;
	blocks?: any;
};

export default function Content({ content, styles, blocks, className }: Props) {
	if (!content) return null;

	return (
		<div className={s.content}>
			<StructuredContent
				blocks={{ ...blocks }}
				className={cn(className)}
				styles={{
					...styles,
				}}
				content={content}
			/>
		</div>
	);
}
