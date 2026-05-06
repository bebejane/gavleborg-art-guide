import '@mantine/core/styles.css';
import s from './page.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { AllProgramCategoriesDocument, AllLocationsDocument, AllPartnersDocument } from '@/graphql';
import NewPostForm from './NewPostForm';

export default async function AdminPage() {
	const { allProgramCategories } = await apiQuery(AllProgramCategoriesDocument, { all: true });
	const { allLocations } = await apiQuery(AllLocationsDocument, { all: true });
	const { allPartners } = await apiQuery(AllPartnersDocument, { all: true });

	return (
		<div className={s.admin}>
			<h1>Nytt inlägg</h1>
			<NewPostForm allProgramCategories={allProgramCategories} allLocations={allLocations} allPartners={allPartners} />
		</div>
	);
}
