import { apiQuery } from "next-dato-utils/api";
import { AllProjectsDocument } from "@/graphql";
import ShortcutProjectSlideshow from "./ShortcutProjectSlideshow";

type Props = {
	data: ShortcutProjectRecord;
};

export default async function ShortcutProject({ data: { id } }: Props) {
	const { allProjects } = await apiQuery<AllProjectsQuery, AllProjectsQueryVariables>(
		AllProjectsDocument,
		{
			variables: {
				first: 10,
			},
		}
	);

	return <ShortcutProjectSlideshow projects={allProjects} />;
}
