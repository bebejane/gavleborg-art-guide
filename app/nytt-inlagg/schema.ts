import { nullable, z } from 'zod/v4';

export const schema = z
	.object({
		title: z.string().min(1, { message: 'Titel är obligatoriskt' }),
		intro: z.string().min(1, { message: 'Ingress är obligatoriskt' }),
		content: z.string().min(1, { message: 'Innehåll är obligatoriskt' }),
		image: z.string().min(1, { message: 'Bild är obligatoriskt' }),
		program_category: z
			.string()
			.min(1, { message: 'Program kategori är obligatoriskt' })
			.nullable()
			.refine((data) => data !== null, { message: 'Program kategori är obligatoriskt' }),
		organizer: z.string(),
		start_date: z.coerce
			.date()
			.nullable()
			.transform((value, ctx) => {
				if (value == null)
					ctx.addIssue({
						code: 'custom',
						message: 'Startdatum är obligatoriskt',
					});
				return value ?? null;
			}),
		end_date: z.coerce.date().nullable(),
		start_time: z.coerce.date().nullable(),
		time: z.string(),
		misc: z.string(),
		group_show: z.boolean(),
		permanent: z.boolean(),
		external_link: z.url({ message: 'Ogiltig URL' }).optional().or(z.literal('')),
		location: z
			.object(
				{
					id: z.string().min(3, { message: 'Plats är obligatoriskt' }).nullable(),
					name: z.string().optional().or(z.literal('')),
					address: z.string().optional().or(z.literal('')),
					city: z.string().optional().or(z.literal('')),
					webpage: z.url({ message: 'Ogiltig URL' }).optional().or(z.literal('')),
					map: z.url({ message: 'Ogiltig URL' }).optional().or(z.literal('')),
				},
				{ message: 'Plats är obligatoriskt' }
			)
			.refine((data) => data.id !== null, { message: 'Plats är obligatoriskt', path: ['id'] })
			.refine((data) => !(data.id === 'new' && !data.name), { message: 'Namn är obligatoriskt name', path: ['name'] }),
	})
	.refine(
		(data) => {
			if (data.start_date && !data.end_date) return true;
			else if (data.start_date && data.end_date) {
				return data.end_date >= data.start_date;
			} else return true;
		},
		{
			message: 'Slutdatum kan inte vara före startdatum',
			path: ['end_date'],
		}
	)
	.refine((data) => !(data.permanent && data.end_date), {
		message: 'Slutdatum är ej tillåtet för permanenta program.',
		path: ['end_date'],
	});
