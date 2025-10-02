'use client';

import s from './NewLocationForm.module.scss';
import '@mantine/dates/styles.css';
import { Space, TextInput, Collapse } from '@mantine/core';
import { useForm } from '@mantine/form';

export type NewLocationFormFieldsProps = {
	show: boolean;
	onChange?: (values: any) => void;
};

export default function NewLocationFormFields({ show, onChange }: NewLocationFormFieldsProps) {
	const form = useForm({
		mode: 'controlled',
		initialValues: {
			title: '',
			address: '',
			city: '',
			webpage: '',
			map: '',
		},
		onValuesChange(values) {
			const res = form.validate();
			if (!res.hasErrors) onChange(values);
			else console.log('There are errors', res.errors);
		},
		validate: {
			title: (value) => (value.length > 0 ? null : 'Title är obligatoriskt'),
		},
	});

	return (
		<Collapse in={show} className={s.form}>
			<TextInput withAsterisk label='Titel' key={form.key('title')} {...form.getInputProps('title')} />
			<Space h='md' />
			<TextInput label='Adress' key={form.key('address')} {...form.getInputProps('address')} />
			<Space h='md' />
			<TextInput label='Stad' key={form.key('city')} {...form.getInputProps('city')} />
			<TextInput label='Webbplats' key={form.key('webpage')} {...form.getInputProps('webpage')} />
			<Space h='md' />
			<TextInput label='Karta' key={form.key('map')} {...form.getInputProps('map')} />
		</Collapse>
	);
}
