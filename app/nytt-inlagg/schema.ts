import { z } from 'zod/v4';

export const schema = z.object({
	title: z.string().min(1, { message: 'Titel är obligatoriskt' }),
	intro: z.string().min(1, { message: 'Ingress är obligatoriskt' }),
	content: z.string().min(1, { message: 'Innehåll är obligatoriskt' }),
	image: z.string().min(1, { message: 'Bild är obligatoriskt' }),
	program_category: z.string().min(1, { message: 'Program kategori är obligatoriskt' }),
	location: z
		.object({
			id: z.literal('new'),
			name: z.string().min(1, { message: 'Namn är obligatoriskt' }),
			address: z.string().optional(),
			city: z.string().optional(),
			webpage: z.url({ message: 'Ogiltig URL' }).optional().or(z.literal('')),
			map: z.url({ message: 'Ogiltig URL' }).optional().or(z.literal('')),
		})
		.or(z.object({ id: z.string().min(5) })),
	organizer: z.string(),
	start_time: z.coerce.date(),
	start_date: z.coerce.date().min(1),
	end_date: z.coerce.date(),
	time: z.string(),
	misc: z.string(),
	external_link: z.url({ message: 'Ogiltig url' }).optional().or(z.literal('')),
});
