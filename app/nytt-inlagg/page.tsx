import '@mantine/core/styles.css';
import s from './page.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { AllProgramCategoriesDocument, AllLocationsDocument, AllPartnersDocument } from '@/graphql';
import NewPostForm from './NewPostForm';

export default async function AdminPage() {
	const { allProgramCategories } = await apiQuery<AllProgramCategoriesQuery, AllProgramCategoriesQueryVariables>(
		AllProgramCategoriesDocument
	);
	const { allLocations } = await apiQuery<AllLocationsQuery, AllLocationsQueryVariables>(AllLocationsDocument);
	const { allPartners } = await apiQuery<AllPartnersQuery, AllPartnersQueryVariables>(AllPartnersDocument);

	return (
		<div className={s.admin}>
			<h1>Nytt inlägg</h1>
			<NewPostForm allProgramCategories={allProgramCategories} allLocations={allLocations} allPartners={allPartners} />
		</div>
	);
}
