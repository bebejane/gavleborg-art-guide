'use client';

import s from './NewPostForm.module.scss';
import cn from 'classnames';
import '@mantine/dates/styles.css';
import 'dayjs/locale/sv';

import { Button, TextInput, Switch, FileButton, Select, Space, Progress, Collapse } from '@mantine/core';
import { DatePickerInput, DatesProvider, DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Upload } from '@datocms/cma-client/dist/types/generated/ApiTypes';
import RichTextEditor from './RichTextEditor';
import React, { useEffect, useState } from 'react';
import FileUpload from './FileUpload';
import { schema } from '../schema';
import { zod4Resolver } from 'mantine-form-zod-resolver';

type FormValues = {
	title: string;
	intro: string;
	content: string;
	image: string;
	program_category: string;
	group_show: boolean;
	organizer: string;
	location: {
		id: string;
		name?: string;
		address?: string;
		city?: string;
		webpage?: string;
		map?: string;
	};
	start_time: string;
	start_date: string;
	end_date: string;
	permanent: boolean;
	time: string;
	misc: string;
	external_link: string;
};

const initialValues = {
	title: '',
	intro: '',
	content: '',
	image: null,
	program_category: '',
	organizer: '',
	location: { id: '' },
	start_time: null,
	start_date: null,
	end_date: null,
	group_show: false,
	permanent: false,
	time: '',
	misc: '',
	external_link: '',
};

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
	const [uploadError, setUploadError] = useState<Error | null>(null);

	const form = useForm<FormValues>({
		mode: 'controlled',
		initialValues,
		validate: zod4Resolver(schema),
	});

	function reset() {
		setError(null);
		setSuccess(false);
		setImage(null);
		setUpload(null);
		setUploadStatus(null);
		setUploadProgress(null);
		setUploadError(null);
		form.reset();
		form.setValues(initialValues);
	}

	function handleImageChange(file: File) {
		setImage(file ?? null);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		try {
			const { hasErrors, errors } = form.validate();

			if (hasErrors) {
				document
					.querySelector(`[data-path='${Object.keys(errors)[0]}']`)
					?.scrollIntoView({ behavior: 'smooth', block: 'center' });
				return;
			}
		} catch (e) {
			console.log(e);
			return;
		}
		setSubmitting(true);
		setError(null);
		setSuccess(false);

		try {
			const res = await fetch('/nytt-inlagg/api/save', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(form.values),
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
			<DatesProvider settings={{ locale, firstDayOfWeek: 0, weekendDays: [0] }}>
				<form className={s.form} onSubmit={handleSubmit}>
					<Collapse in={!success} transitionDuration={300}>
						<TextInput withAsterisk label='Titel' key={form.key('title')} {...form.getInputProps('title')} />
						<Space h='md' />
						<label className={s.label}>
							Bild <span className={s.asterisk}>*</span>
						</label>
						<div className={cn(s.image, form.errors.image && s.error)}>
							<div className={s.wrap}>
								<FileButton
									{...form.getInputProps('image')}
									key={form.key('image')}
									accept='image/png,image/jpeg'
									onChange={handleImageChange}
								>
									{(props) => (
										<Button {...props} disabled={uploadStatus !== null}>
											{uploadProgress !== null ? 'Laddar upp...' : 'Välj bild'}
										</Button>
									)}
								</FileButton>
								{uploadError && <p className={s.error}>{uploadError.message ?? 'Något gick fel'}</p>}
								{uploadStatus !== null && (
									<>
										<Space h='md' />
										<Progress value={uploadProgress} animated={uploadStatus === 'generating'} />
										<Space h='md' />
									</>
								)}
								{upload && (
									<>
										<Space h='md' />
										<img src={upload.url} alt={upload.filename} />
									</>
								)}
								<FileUpload
									file={image}
									onChange={(upload) => {
										form.setFieldValue('image', upload?.id ?? '');
										setUpload(upload);
									}}
									onStatusChange={setUploadStatus}
									onProgress={setUploadProgress}
									onError={setUploadError}
								/>
							</div>
						</div>
						<Space h='md' />
						<RichTextEditor
							{...form.getInputProps('intro')}
							id={'intro'}
							label='Ingress'
							key={form.key('intro')}
							onChange={(val) => form.setValues({ intro: val })}
							value={form.values.intro}
							markdown={true}
							simple={true}
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
							{...form.getInputProps('program_category')}
							label='Program kategori'
							key={form.key('program_category')}
							value={form.values.program_category}
							data={allProgramCategories.map(({ id: value, title: label }) => ({ value, label }))}
							withAsterisk={true}
						/>
						<Space h='md' />
						<Select
							{...form.getInputProps('location')}
							label='Plats'
							value={form.values.location?.id ?? null}
							key={form.key('location')}
							onChange={(id) => id && form.setValues({ location: { id } })}
							data={[{ value: 'new', label: 'Ny plats...' }].concat(
								allLocations.map(({ id: value, name: label }) => ({ value, label }))
							)}
							withAsterisk={true}
						/>
						<Collapse in={form.values.location?.id === 'new'} className={s.newlocation}>
							<TextInput
								{...form.getInputProps('location.name')}
								withAsterisk
								label='Namn'
								key={form.key('location.name')}
								value={form.values.location?.name ?? ''}
							/>
							<Space h='md' />
							<TextInput
								{...form.getInputProps('location.address')}
								label='Adress'
								key={form.key('location.address')}
								value={form.values.location?.address ?? ''}
							/>
							<Space h='md' />
							<TextInput
								{...form.getInputProps('location.city')}
								value={form.values.location?.city ?? ''}
								label='Stad'
								key={form.key('location.city')}
							/>
							<Space h='md' />
							<TextInput
								{...form.getInputProps('location.webpage')}
								label='Webbplats'
								key={form.key('location.webpage')}
								value={form.values.location?.webpage ?? ''}
							/>
							<Space h='md' />
							<TextInput
								{...form.getInputProps('location.map')}
								label='Karta'
								key={form.key('location.map')}
								value={form.values.location?.map}
							/>
						</Collapse>

						<Space h='md' />
						<TextInput label='Organisatör' key={form.key('organizer')} {...form.getInputProps('organizer')} />
						<Space h='md' />

						<DatePickerInput
							styles={{ day: { margin: 0 } }}
							label='Startdatum'
							key={form.key('start_date')}
							{...form.getInputProps('start_date')}
							withAsterisk={true}
						/>
						<Space h='md' />
						<DatePickerInput
							{...form.getInputProps('end_date')}
							styles={{ day: { margin: 0 } }}
							label='Slutdatum'
							key={form.key('end_date')}
						/>
						<Space h='md' />
						<DateTimePicker
							{...form.getInputProps('start_time')}
							styles={{ day: { margin: 0 } }}
							label='Starttid'
							valueFormat=''
							key={form.key('start_time')}
							onChange={(value) => form.setValues({ start_time: new Date(value).toISOString() })}
						/>
						<Space h='md' />
						<TextInput label='Tider' key={form.key('time')} {...form.getInputProps('time')} />
						<Space h='md' />
						<TextInput label='Extra info' key={form.key('misc')} {...form.getInputProps('misc')} />
						<Space h='md' />
						<TextInput label='Extern länk' key={form.key('external_link')} {...form.getInputProps('external_link')} />
						<Space h='md' />
						<Switch
							{...form.getInputProps('group_show')}
							label='Grupputsällning'
							key={form.key('group_show')}
							checked={form.values.group_show}
						/>
						<Space h='md' />
						<Switch
							{...form.getInputProps('permanent')}
							label='Permanent'
							key={form.key('permanent')}
							checked={form.values.permanent}
						/>
						<Space h='md' />
						{error && (
							<>
								<div className={s.error}>{error}</div>
								<Space h='md' />
							</>
						)}
						<Button
							type='submit'
							size='lg'
							disabled={submitting || uploadStatus !== null}
							className={s.submit}
							fullWidth={true}
							radius='xl'
							variant='outline'
							color='yellow'
						>
							{submitting ? 'Skickar...' : 'Skicka in'}
						</Button>
					</Collapse>
				</form>
			</DatesProvider>
			{success && (
				<div className={s.success}>
					<h3>Tack!</h3>
					<p>Inlägget har skickats in till oss och vi kommer att granska det inom kort för publicering.</p>
					<Button onClick={reset}>Skriv ett inlägg till</Button>
				</div>
			)}
		</>
	);
}
