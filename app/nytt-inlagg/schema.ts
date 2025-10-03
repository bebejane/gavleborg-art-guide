import { z } from 'zod/v4';

export const schema = z
	.object({
		title: z.string().min(1, { message: 'Titel är obligatoriskt' }),
		intro: z.string().min(1, { message: 'Ingress är obligatoriskt' }),
		content: z.string().min(1, { message: 'Innehåll är obligatoriskt' }),
		image: z.string().min(1, { message: 'Bild är obligatoriskt' }),
		program_category: z.string().min(1, { message: 'Program kategori är obligatoriskt' }),
		organizer: z.string(),
		start_date: z.coerce.date().min(1, { message: 'Startdatum är obligatoriskt' }),
		end_date: z.coerce.date(),
		start_time: z.coerce.date(),
		time: z.string(),
		misc: z.string(),
		group_show: z.boolean(),
		permanent: z.boolean(),
		external_link: z.url({ message: 'Ogiltig URL' }).optional().or(z.literal('')),
		location: z
			.object(
				{
					id: z.literal('new'),
					name: z.string().min(1, { message: 'Namn är obligatoriskt' }),
					address: z.string().optional(),
					city: z.string().optional(),
					webpage: z.url({ message: 'Ogiltig URL' }).optional().or(z.literal('')),
					map: z.url({ message: 'Ogiltig URL' }).optional().or(z.literal('')),
				},
				{ message: 'Plats är obligatoriskt' }
			)
			.or(z.object({ id: z.string().min(5, { message: 'Plats är obligatoriskt' }) })),
	})
	.refine(
		(data) => {
			if (data.end_date && data.start_date) {
				return data.end_date >= data.start_date;
			}
			return true;
		},
		{
			message: 'Slutdatum kan inte vara före startdatum',
			path: ['end_date'],
		}
	);
