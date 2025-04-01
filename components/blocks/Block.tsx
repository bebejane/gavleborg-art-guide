import { Block } from "next-dato-utils/components";
import * as Components from "./";

type BlockProps = { data: any; components?: any; onClick?: (ids: string) => void };

export default function StructuredBlock({ data, onClick, components }: BlockProps) {
	return (
		<Block
			data={data}
			onClick={onClick}
			components={components ?? Components}
		/>
	);
}
