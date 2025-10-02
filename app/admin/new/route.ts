import { parse5ToStructuredText } from 'datocms-html-to-structured-text';
import { parse } from 'parse5';
import slugify from 'slugify';
import { buildClient, ApiError } from '@datocms/cma-client';
import { Program, Location } from '@/@types/datocms-cma';

const environment = 'dev'; //process.env.DATOCMS_ENVIRONMENT;
const client = buildClient({
	apiToken: process.env.DATOCMS_API_TOKEN,
	environment,
});

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const itemTypes = await client.itemTypes.list();
		const programTypeId = itemTypes.find(({ api_key }) => api_key === 'program')?.id;
		const locationTypeId = itemTypes.find(({ api_key }) => api_key === 'location')?.id;

		// validate
		Object.keys(body).forEach((key) => {
			if (body[key] === undefined || body[key] === '') {
				delete body[key];
			}
		});

		const data = {
			...body,
			location: [body.location],
			slug: await generateSlug(body.title, programTypeId),
			content: body.content ? await parse5ToStructuredText(parse(body.content)) : null,
			image: body.image ? { upload_id: body.image } : null,
		};

		// New location
		const new_location = data.new_location;

		if (data.location?.includes('new') && typeof new_location === 'object' && Object.keys(new_location).length > 0) {
			try {
				const l = {
					...body.new_location,
					slug: await generateSlug(body.new_location.title, locationTypeId),
				};
				console.log(l);
				const location = await client.items.create<Location>({
					item_type: { type: 'item_type', id: locationTypeId },
					...l,
				});
				console.log(location);
				data.location = [location.id];
			} catch (e) {
				console.log(e);
				throw new Error('Något gick fel');
			}
		}

		delete data.new_location;

		console.log(data);

		const item = await client.items.create<Program>({
			item_type: { type: 'item_type', id: programTypeId },
			...data,
		});

		if (item)
			console.log(
				`https://gavleborg-art-guide.admin.datocms.com/environments/${environment}/editor/item_types/${programTypeId}/items/${item.id}`
			);

		return new Response('ok');
	} catch (e) {
		const statusText = e.request ? JSON.stringify((e as ApiError).errors) : `Något gick fel : ${e.message}`;

		console.log(e.errors);
		console.log(statusText);

		return new Response('error', { status: 500, statusText });
	}
}

async function generateSlug(str: string, api_key: string) {
	let slug = slugify(str, { lower: true, locale: 'en' });
	let suffix = null;

	const items = await client.items.list<Program>({
		item_type: { type: 'item_type', id: api_key },
		filter: { slug: { eq: slug } },
		//filter: { slug: { matches: { pattern: `^${slug}-` } } },
		limit: 500,
	});

	//console.log(items);

	if (items.length > 0) {
		const lastNo = items
			.filter((item) => item.slug.startsWith(slug))
			.reduce((acc, item) => {
				const n = parseInt(item.slug.split('-').pop());
				if (!isNaN(n) && n > acc) return n;
				return acc;
			}, 0);
		suffix = lastNo ? `-${lastNo + 1}` : '';
		slug = `${slug}${suffix}`;
	}

	return slug;
}
