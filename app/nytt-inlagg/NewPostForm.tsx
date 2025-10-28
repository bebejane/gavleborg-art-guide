'use client';

import s from './NewPostForm.module.scss';
import cn from 'classnames';
import '@mantine/dates/styles.css';
import 'dayjs/locale/sv';

import { Button, TextInput, Switch, FileButton, Select, Space, Progress, Collapse, Loader } from '@mantine/core';
import { DatePickerInput, DatesProvider, DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Upload } from '@datocms/cma-client/dist/types/generated/ApiTypes';
import RichTextEditor from './RichTextEditor';
import React, { useEffect, useState } from 'react';
import FileUpload from './FileUpload';
import { schema } from './schema';
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
	program_category: null,
	organizer: '',
	location: { id: null, name: '', address: '', city: '', webpage: '', map: '' },
	start_date: null,
	end_date: null,
	start_time: null,
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

	function scrollToField(field: string) {
		document.querySelector(`[data-path='${field}']`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	async function handleSubmit(e: React.FormEvent) {
		e?.preventDefault();

		try {
			let { hasErrors, errors } = form.validate();

			if (hasErrors) {
				scrollToField(Object.keys(errors).pop());
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
			else throw new Error(`Något gick fel: ${res.status} - ${res.statusText}`);
		} catch (e) {
			setError(e.message);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<>
			<DatesProvider settings={{ locale, firstDayOfWeek: 1, weekendDays: [1] }}>
				<form className={s.form} onSubmit={handleSubmit}>
					<Collapse in={!success} transitionDuration={300}>
						<TextInput withAsterisk label='Titel' {...form.getInputProps('title')} />
						<Space h='md' />
						<label className={s.label}>
							Bild <span className={s.asterisk}>*</span>
						</label>
						<div className={cn(s.image, form.errors.image && s.errorBorder)}>
							<div className={s.wrap}>
								{uploadStatus !== null && (
									<>
										<Space h='md' />
										<Progress value={uploadProgress} animated={uploadStatus === 'generating'} />
										<Space h='md' />
									</>
								)}
								{upload && <img src={`${upload.url}?w=1000`} alt={upload.filename} />}
								<FileUpload
									file={image}
									onChange={(upload) => {
										form.setFieldValue('image', upload?.id ?? '');
										setUpload(upload);
										setImage(null);
									}}
									onStatusChange={setUploadStatus}
									onProgress={setUploadProgress}
									onError={setUploadError}
								/>
								<FileButton
									{...form.getInputProps('image')}
									key={image ? 'image' : undefined}
									accept='image/png,image/jpeg'
									onChange={handleImageChange}
								>
									{(props) => (
										<Button {...props} disabled={uploadStatus !== null} size='lg' className={s.button}>
											{uploadProgress !== null ? 'Laddar upp...' : 'Välj bild'}
										</Button>
									)}
								</FileButton>
								{uploadError && <p className={s.error}>{uploadError.message ?? 'Något gick fel'}</p>}
							</div>
						</div>
						<Space h='md' />
						<RichTextEditor
							{...form.getInputProps('intro')}
							id={'intro'}
							label='Ingress'
							onChange={(val) => form.setValues({ intro: val })}
							markdown={true}
							simple={true}
							withAsterisk
						/>
						<Space h='md' />
						<RichTextEditor
							{...form.getInputProps('content')}
							id={'content'}
							label='Innehåll'
							onChange={(val) => form.setValues({ content: val })}
							withAsterisk
						/>
						<Space h='md' />
						<Select
							{...form.getInputProps('program_category')}
							label='Kategori'
							data={allProgramCategories.map(({ id: value, title: label }) => ({ value, label }))}
							withAsterisk={true}
						/>
						<Space h='md' />
						<Select
							{...form.getInputProps('location.id')}
							data={[{ value: 'new', label: 'Ny plats...' }].concat(
								allLocations.map(({ id: value, name: label }) => ({ value, label }))
							)}
							label='Plats'
							withAsterisk={true}
							clearable={true}
						/>

						<Collapse
							in={form.values.location?.id === 'new'}
							className={cn(s.newlocation, form.errors['location.id'] && s.errorBorder)}
						>
							<TextInput
								{...form.getInputProps('location.name')}
								key={form.key('location.name')}
								label='Namn'
								withAsterisk
							/>

							<Space h='md' />
							<TextInput {...form.getInputProps('location.address')} label='Adress' />
							<Space h='md' />
							<TextInput {...form.getInputProps('location.city')} label='Stad' />
							<Space h='md' />
							<TextInput {...form.getInputProps('location.webpage')} label='Webbplats' />
							<Space h='md' />
							<TextInput {...form.getInputProps('location.map')} label='Länk till karta på Google Maps' />
						</Collapse>

						<Space h='md' />
						<DatePickerInput
							{...form.getInputProps('start_date')}
							styles={{ day: { margin: 0 } }}
							label='Startdatum'
							minDate={new Date()}
							valueFormat='D MMMM, YYYY'
							className={s.date}
							withAsterisk={true}
							clearable={true}
						/>
						<Space h='md' />
						<Switch {...form.getInputProps('permanent')} label='Permanent' checked={form.values.permanent} />
						<Space h='md' />

						<DatePickerInput
							{...form.getInputProps('end_date')}
							styles={{ day: { margin: 0 } }}
							label='Slutdatum'
							className={s.date}
							valueFormat='D MMMM, YYYY'
							clearable={true}
							minDate={form.values.start_date ? new Date(form.values.start_date) : new Date()}
						/>
						<Space h='md' />
						<DateTimePicker
							{...form.getInputProps('start_time')}
							styles={{ day: { margin: 0 } }}
							label='Vernissagedatum och tid'
							valueFormat='D MMMM, YYYY - HH:mm'
							className={s.date}
							onChange={(value) => form.setValues({ start_time: new Date(value).toISOString() })}
							clearable={true}
							minDate={new Date()}
						/>
						<Space h='md' />
						<TextInput label='Organisatör' {...form.getInputProps('organizer')} />
						<Space h='md' />
						<TextInput label='Öppettider' {...form.getInputProps('time')} />
						<Space h='md' />
						<TextInput label='Extra info' {...form.getInputProps('misc')} />
						<Space h='md' />
						<TextInput label='Extern länk' {...form.getInputProps('external_link')} />
						<Space h='md' />
						<Switch {...form.getInputProps('group_show')} label='Grupputsällning' checked={form.values.group_show} />
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
							className={cn(s.submit, s.button)}
							fullWidth={true}
							radius='xl'
							variant='outline'
							color='yellow'
							loading={submitting}
							loaderProps={{ size: 'sm' }}
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
					<Button onClick={reset} className={s.button}>
						Skriv ett inlägg till
					</Button>
				</div>
			)}
		</>
	);
}
