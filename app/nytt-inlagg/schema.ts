import { z } from 'zod';

export const schema = z.object({
	title: z.string().min(1, { message: 'Titel är obligatoriskt' }),
	intro: z.string().min(1, { message: 'Ingress är obligatoriskt' }),
	content: z.string().min(1, { message: 'Innehåll är obligatoriskt' }),
	image: z.string().min(1, { message: 'Bild är obligatoriskt' }),
	program_category: z.string().min(1, { message: 'Program kategori är obligatoriskt' }),
	location: z.object({
		id: z.string().min(5),
		name: z.string().min(1, { message: 'Titel är obligatoriskt' }),
		address: z.string(),
		city: z.string(),
		webpage: z.url({ message: 'Ogiltig url' }),
		map: z.url({ message: 'Ogiltig url' }),
	}),
	organizer: z.string(),
	partner: z.string(),
	start_time: z.date(),
	start_date: z.date(),
	end_date: z.date(),
	permanent: z.boolean(),
	time: z.string(),
	misc: z.string(),
	external_link: z.url({ message: 'Ogiltig url' }).optional(),
});
