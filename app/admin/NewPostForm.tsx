'use client';

import s from './NewPostForm.module.scss';
import '@mantine/dates/styles.css';
import { Button, TextInput, Switch, FileButton, Select, Space, Progress } from '@mantine/core';
import { DatePickerInput, DatesProvider, DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import RichTextEditor from './RichTextEditor';
import NewLocationForm from './NewLocationForm';
import React, { useEffect, useState } from 'react';
import 'dayjs/locale/sv';
import FileUpload from '@/app/admin/FileUpload';
import { Upload } from '@datocms/cma-client/dist/types/generated/ApiTypes';

export type NewPostFormProps = {
	allProgramCategories: AllProgramCategoriesQuery['allProgramCategories'];
	allLocations: AllLocationsQuery['allLocations'];
	allPartners: AllPartnersQuery['allPartners'];
};

export default function NewPostForm({ allProgramCategories, allLocations, allPartners }: NewPostFormProps) {
	const locale = 'sv';
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const [image, setImage] = useState<File | null>(null);
	const [upload, setUpload] = useState<Upload | null>(null);
	const [uploadStatus, setUploadStatus] = useState<'uploading' | 'generating' | null>(null);
	const [uploadProgress, setUploadProgress] = useState<number | null>(null);

	const form = useForm({
		mode: 'controlled',
		initialValues: {
			title: '',
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
			title: (value) => (value?.length > 0 ? null : 'Title är obligatoriskt'),
			intro: (value) => (value?.length > 0 ? null : 'Ingress är obligatoriskt'),
			content: (value) => (value?.length > 0 ? null : 'Innehåll är obligatoriskt'),
			//image: (value) => (value.length > 0 ? null : 'Image is required'),
			program_category: (value) => (value?.length > 0 ? null : 'Program kategori är obligatoriskt'),
			location: (value) => (value?.length > 0 ? null : 'Plats är obligatoriskt'),
			//start_time: (value) => (value ? null : 'Start time is required'),
			//start_date: (value) => (value ? null : 'Start date is required'),
			//end_date: (value) => (value ? null : 'End date is required'),
			//time: (value) => (value.length > 0 ? null : 'Time is required'),
			//misc: (value) => (value.length > 0 ? null : 'Misc is required'),
			//external_link: (value) => (value.length > 0 ? null : 'External link is required'),
		},
	});

	function reset() {
		form.reset();
		setError(null);
		setSuccess(false);
		setImage(null);
		setUpload(null);
		setUploadStatus(null);
		setUploadProgress(null);
	}

	function handleImageChange(file: File) {
		setImage(file ?? null);
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

	useEffect(() => {
		if (!form.errors || Object.keys(form.errors).length === 0) return;
		const errorField = Object.keys(form.errors)[0];
		const el = document.querySelector(`[data-path='${errorField}']`);
		el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}, [form.errors]);
	console.log(upload);
	return (
		<>
			<DatesProvider settings={{ locale, firstDayOfWeek: 0, weekendDays: [0] }}>
				<form className={s.form} onSubmit={form.onSubmit(handleSubmit)}>
					<TextInput withAsterisk label='Titel' key={form.key('title')} {...form.getInputProps('title')} />
					<Space h='md' />
					<div className={s.image}>
						<div className={s.wrap}>
							<FileButton
								key={form.key('image')}
								{...form.getInputProps('image')}
								accept='image/png,image/jpeg'
								onChange={handleImageChange}
							>
								{(props) => (
									<Button {...props} disabled={uploadStatus !== null}>
										{uploadProgress !== null ? 'Laddar upp...' : 'Välj bild'}
									</Button>
								)}
							</FileButton>
							<Space h='md' />
							{uploadStatus !== null && (
								<>
									<Progress value={uploadProgress} animated={uploadStatus === 'generating'} />
									<Space h='md' />
								</>
							)}
							{upload && <img src={upload.url} alt={upload.filename} />}
							<FileUpload
								file={image}
								onChange={(upload) => {
									form.setFieldValue('image', upload?.id ?? '');
									setUpload(upload);
								}}
								onStatusChange={setUploadStatus}
								onProgress={setUploadProgress}
							/>
						</div>
					</div>
					<RichTextEditor
						{...form.getInputProps('intro')}
						id={'intro'}
						label='Ingress'
						key={form.key('intro')}
						onChange={(val) => form.setValues({ intro: val })}
						value={form.values.intro}
						withAsterisk
					/>
					<Space h='md' />
					<RichTextEditor
						{...form.getInputProps('content')}
						id={'content'}
						label='Innehåll'
						key={form.key('content')}
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
						data={[{ value: 'new', label: 'Ny plats...' }].concat(
							allLocations.map(({ id: value, title: label }) => ({ value, label }))
						)}
					/>
					<NewLocationForm
						show={form.values.location === 'new'}
						onChange={(values) => {
							form.setValues({ new_location: values });
						}}
					/>
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
						key={form.key('start_time')}
						{...form.getInputProps('start_time')}
					/>
					<Space h='md' />
					<DatePickerInput
						styles={{ day: { margin: 0 } }}
						label='Startdatum'
						key={form.key('start_date')}
						{...form.getInputProps('start_date')}
					/>
					<Space h='md' />
					<DatePickerInput
						styles={{ day: { margin: 0 } }}
						label='Slutdatum'
						key={form.key('end_date')}
						{...form.getInputProps('end_date')}
					/>
					<Space h='md' />
					<TextInput label='Tider' key={form.key('time')} {...form.getInputProps('time')} />
					<Space h='md' />
					<TextInput label='Extra info' key={form.key('misc')} {...form.getInputProps('misc')} />
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
					<Button type='submit' disabled={submitting} className={s.submit} fullWidth={true}>
						Spara
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
			</DatesProvider>
		</>
	);
}
