'use client';

import s from './NewPostForm.module.scss';
import '@mantine/dates/styles.css';
import { Button, Checkbox, Group, TextInput, Switch, FileInput, Select, Space } from '@mantine/core';
import { DatePickerInput, DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import RichTextEditor from './RichTextEditor';
import NewLocationForm from './NewLocationForm';
import React, { useState } from 'react';
import { assertNonNullType } from 'graphql';

export type NewPostFormProps = {
	allProgramCategories: AllProgramCategoriesQuery['allProgramCategories'];
	allLocations: AllLocationsQuery['allLocations'];
	allPartners: AllPartnersQuery['allPartners'];
};

export default function NewPostForm({ allProgramCategories, allLocations, allPartners }: NewPostFormProps) {
	const form = useForm({
		mode: 'controlled',
		initialValues: {
			title: 'Title',
			intro: null,
			image: '',
			group_show: false,
			content: null,
			program_category: '',
			organizer: '',
			location: '',
			new_location: {},
			partner: '',
			start_time: new Date(),
			start_date: new Date(),
			end_date: new Date(),
			permanent: false,
			time: '',
			misc: '',
			external_link: '',
		},
		validate: {
			title: (value) => (value.length > 0 ? null : 'Title är obligatoriskt'),
			//intro: (value) => (value.length > 0 ? null : 'Intro är obligatoriskt'),
			//image: (value) => (value.length > 0 ? null : 'Image is required'),
			//program_category: (value) => (value.length > 0 ? null : 'Program category is required'),
			//start_time: (value) => (value ? null : 'Start time is required'),
			//start_date: (value) => (value ? null : 'Start date is required'),
			//end_date: (value) => (value ? null : 'End date is required'),
			//time: (value) => (value.length > 0 ? null : 'Time is required'),
			//misc: (value) => (value.length > 0 ? null : 'Misc is required'),
			//external_link: (value) => (value.length > 0 ? null : 'External link is required'),
		},
	});

	const locale = 'sv';

	const [submitting, setSubmitting] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);

	function reset() {
		form.reset();
		setError(null);
		setSuccess(false);
	}

	async function handleSubmit(values: any) {
		console.log(values);
		setSubmitting(true);
		setError(null);
		setSuccess(false);

		try {
			const res = await fetch('/admin/new', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(values),
			});
			if (res.status === 200) setSuccess(true);
			else if (res.status === 500) throw new Error(res.statusText);
			else throw new Error('Något gick fel');
		} catch (e) {
			setError(e.message);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<>
			<form className={s.form} onSubmit={form.onSubmit(handleSubmit)}>
				<TextInput withAsterisk label='Titel' key={form.key('title')} {...form.getInputProps('title')} />
				<Space h='md' />
				<FileInput withAsterisk label='Bild' key={form.key('image')} {...form.getInputProps('image')} />
				<Space h='md' />
				<RichTextEditor
					id={form.key('intro')}
					label='Ingress'
					key={form.key('intro')}
					{...form.getInputProps('intro')}
					onChange={(val) => form.setValues({ intro: val })}
					value={form.values.intro}
					withAsterisk
				/>
				<Space h='md' />

				<RichTextEditor
					id={form.key('content')}
					label='Innehåll'
					key={form.key('content')}
					{...form.getInputProps('content')}
					onChange={(val) => form.setValues({ content: val })}
					value={form.values.content}
					withAsterisk
				/>
				<Space h='md' />
				<Select
					label='Program kategori'
					key={form.key('program_category')}
					{...form.getInputProps('program_category')}
					data={allProgramCategories.map(({ id: value, title: label }) => ({ value, label }))}
				/>
				<Space h='md' />
				<Select
					label='Plats'
					key={form.key('location')}
					{...form.getInputProps('location')}
					data={[{ value: 'new', label: 'Ny plats' }].concat(
						allLocations.map(({ id: value, title: label }) => ({ value, label }))
					)}
				/>
				{form.values.location === 'new' && (
					<React.Fragment>
						<Space h='md' />
						<NewLocationForm
							onChange={(values) => {
								form.setValues({ new_location: values });
							}}
						/>
					</React.Fragment>
				)}
				<Space h='md' />
				<TextInput label='Organisatör' key={form.key('organizer')} {...form.getInputProps('organizer')} />
				<Space h='md' />

				<Select
					label='Partner'
					key={form.key('partner')}
					{...form.getInputProps('partner')}
					data={allPartners.map(({ id: value, title: label }) => ({ value, label }))}
				/>
				<Space h='md' />
				<DateTimePicker
					styles={{ day: { margin: 0 } }}
					label='Starttid'
					locale={locale}
					key={form.key('start_time')}
					{...form.getInputProps('start_time')}
				/>
				<Space h='md' />
				<DatePickerInput
					styles={{ day: { margin: 0 } }}
					label='Startdatum'
					locale={locale}
					key={form.key('start_date')}
					{...form.getInputProps('start_date')}
				/>
				<Space h='md' />
				<DatePickerInput
					styles={{ day: { margin: 0 } }}
					label='Slutdatum'
					locale={locale}
					key={form.key('end_date')}
					{...form.getInputProps('end_date')}
				/>
				<Space h='md' />
				<TextInput label='Tider' key={form.key('time')} {...form.getInputProps('time')} />
				<Space h='md' />
				<TextInput label='Extra' key={form.key('misc')} {...form.getInputProps('misc')} />
				<Space h='md' />
				<TextInput label='Extern länk' key={form.key('external_link')} {...form.getInputProps('external_link')} />
				<Space h='md' />
				<Switch label='Permanent' key={form.key('permanent')} {...form.getInputProps('permanent')} />
				<Space h='md' />
				<Switch label='Grupp utsällning' key={form.key('group_show')} {...form.getInputProps('group_show')} />
				<Space h='md' />
				{error && (
					<>
						<div className={s.error}>{error}</div>
						<Space h='md' />
					</>
				)}
				<Button type='submit' disabled={submitting}>
					Skicka
				</Button>
				{success && (
					<div className={s.success}>
						<div className={s.box}>
							Inlägget har skickats
							<div className={s.close} onClick={reset}>
								Stäng
							</div>
						</div>
					</div>
				)}
			</form>
		</>
	);
}
