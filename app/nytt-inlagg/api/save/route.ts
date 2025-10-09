import { parse5ToStructuredText } from 'datocms-html-to-structured-text';
import { parse } from 'parse5';
import slugify from 'slugify';
import { buildClient, ApiError } from '@datocms/cma-client';
import { Program, Location } from '@/@types/datocms-cma';
import { schema } from '../../schema';
import { revalidatePath } from 'next/cache';
import { sendPostmarkEmail } from 'next-dato-utils/utils';
import { z } from 'zod';

const environment = process.env.DATOCMS_ENVIRONMENT;
const client = buildClient({
	apiToken: process.env.DATOCMS_API_TOKEN,
	environment,
});

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as z.infer<typeof schema>;
		console.log('save', body);

		try {
			schema.parse(body);
		} catch (error) {
			if (error instanceof z.ZodError) throw new Error(JSON.stringify(error.issues));
			else throw error;
		}

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
			slug: await generateSlug(body.title, 'program'),
			content: body.content ? await parse5ToStructuredText(parse(body.content)) : null,
			image: body.image ? { upload_id: body.image } : null,
		};

		const location: string[] = [];

		// New location
		if (data.location.id === 'new' && 'name' in data.location) {
			try {
				const l = {
					...data.location,
					id: null,
					slug: await generateSlug(data.location.name, 'location'),
				};
				console.log('creating location', l);
				const loc = await client.items.create<Location>({
					//@ts-ignore
					item_type: { type: 'item_type', id: locationTypeId },
					...l,
				});

				location.push(loc.id);
			} catch (e) {
				console.log('error creating location', e);

				throw e;
			}
		} else location.push(data.location.id);

		console.log('creating program', { item_type: { type: 'item_type', id: programTypeId }, ...data, location });
		const item = await client.items.create<Program>({
			//@ts-ignore
			item_type: { type: 'item_type', id: programTypeId },
			...data,
			location,
		});

		const itemUrl = `https://gavleborg-art-guide.admin.datocms.com/environments/${environment}/editor/item_types/${programTypeId}/items/${item?.id}`;

		await sendPostmarkEmail({
			to: process.env.POSTMARK_FROM_EMAIL,
			subject: 'Nytt inlägg',
			text: `Det har inkommit ett nytt inlägg för Gavleborg Art Guide. Klicka på länken för att godkänna det.\n\n${itemUrl}`,
			html: `
					<p>Det har inkommit ett nytt inlägg för Gavleborg Art Guide. Klicka på länken för att godkänna det.</p>
					<p><a href="${itemUrl}">Gå till inlägg</a></p>
			`,
		});

		revalidatePath('/nytt-inlagg');

		return new Response('ok');
	} catch (e) {
		console.error(e);
		const statusText = e.request ? JSON.stringify((e as ApiError).errors) : `Något gick fel: ${e.message}`;
		return new Response('error', { status: 500, statusText });
	}
}

async function generateSlug(str: string, api_key: string) {
	let slug = slugify(str, { lower: true, locale: 'en' });

	try {
		const items = (
			await client.items.list<Program>({
				filter: { type: api_key, query: `^${slug}` },
				limit: 500,
			})
		).filter((item) => item.slug.startsWith(slug));

		if (items.length > 0) {
			const lastNo = items.reduce<number>((acc, item) => {
				const n = parseInt(item.slug.split('-').pop());
				if (!isNaN(n) && n > acc) return n;

				return acc;
			}, 0);

			slug = `${slug}-${lastNo + 1}`;
		}
	} catch (e) {
		console.log(e);
	}

	return slug;
}
