import slugify from 'slugify';

const slug = slugify('Katia Eder - Det skålar vi för! -festliga fat i hälsingeanda', {
	lower: true,
	locale: 'en',
	strict: true,
});
console.log(slug);
