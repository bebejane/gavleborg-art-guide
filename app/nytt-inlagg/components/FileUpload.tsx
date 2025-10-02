import { useEffect, useState, useCallback, RefObject, RefCallback, useRef } from 'react';
import { OnProgressInfo } from '@datocms/cma-client-browser';
import { buildClient } from '@datocms/cma-client-browser';
import { Upload } from '@datocms/cma-client/dist/types/generated/ApiTypes';

const client = buildClient({
	apiToken: process.env.NEXT_PUBLIC_UPLOADS_API_TOKEN,
	environment: 'dev', //process.env.NEXT_PUBLIC_DATOCMS_ENVIRONMENT,
});

export type ImageData = {
	width: number;
	height: number;
	src: string;
};

export type Props = {
	customData?: any;
	value?: string | null | undefined;
	sizeLimit?: number;
	tags?: string[];
	file?: File;
	onChange: (upload: Upload | null) => void;
	onStatusChange?: (status: 'uploading' | 'generating' | null) => void;
	onUploading?: (uploading: boolean) => void;
	onProgress?: (percentage: number) => void;
	onError?: (err: Error | unknown) => void;
	ref?: RefObject<HTMLInputElement> | RefCallback<HTMLInputElement> | null;
};

export default function FileUpload({
	customData = {},
	tags,
	sizeLimit,
	file,
	onChange,
	onStatusChange,
	onUploading,
	onProgress,
	onError,
	ref: forwardedRef,
}: Props) {
	const [error, setError] = useState<Error | unknown | undefined>();
	const [allTags, setAllTags] = useState<string[]>(['upload']);
	const [upload, setUpload] = useState<Upload | undefined>();
	const [progress, setProgress] = useState<number | null>(null);
	const internalInputRef = useRef<HTMLInputElement>(null);

	const resetInput = useCallback(() => {
		setProgress(null);
		setUpload(undefined);
		onUploading?.(false);
		setError(undefined);
		onStatusChange?.(null);
		onChange(null);
	}, [setUpload, setError, onUploading]);

	const createUpload = useCallback(
		async (file: File): Promise<Upload> => {
			if (!file) return Promise.reject(new Error('Ingen fil vald'));

			resetInput();
			onUploading?.(true);
			onStatusChange?.('uploading');

			return new Promise<Upload | PromiseLike<Upload>>((resolve, reject) => {
				client.uploads
					.createFromFileOrBlob({
						fileOrBlob: file,
						filename: file.name,
						tags: allTags,
						default_field_metadata: {
							sv: {
								alt: '',
								title: '',
								custom_data: customData ?? {},
							},
						},
						onProgress: (info: OnProgressInfo) => {
							console.log(info);
							if (info.type === 'UPLOADING_FILE' && info.payload && 'progress' in info.payload) {
								setProgress(info.payload.progress);
								onStatusChange?.('uploading');
							}
							//@ts-ignore
							if (info.type === 'CREATING_UPLOAD_OBJECT') {
								onStatusChange?.('generating');
							}
						},
					})
					.then((upload) => {
						//@ts-ignore
						resolve(upload);
					})
					.catch(reject)
					.finally(() => {
						onUploading?.(false);
						setProgress(null);
						onStatusChange?.(null);
					});
			});
		},
		[customData, onUploading, onProgress, resetInput, allTags] // Corrected dependency array
	);

	useEffect(() => {
		async function handleUpload() {
			try {
				const fileMb = file.size / 1024 ** 2;

				if (sizeLimit && fileMb > sizeLimit) throw new Error(`Storleken på filen får ej vara större än ${sizeLimit}mb`);

				if (file.type.includes('image')) {
					let image: ImageData;
					try {
						image = await parseImageFile(file);
					} catch (err) {
						console.log('error getting image dimensions');
					}
				}

				const upload = await createUpload(file); // Removed extra allTags argument
				onChange(upload);
			} catch (err) {
				console.error('File upload error:', err);
				setError(err); // Pass unknown error type
			} finally {
				onUploading?.(false);
			}
		}
		if (file) handleUpload();
	}, [file]);

	useEffect(() => {
		if (!upload) return;
		onChange(upload);
	}, [upload, onChange]); // Add onChange to dependencies

	useEffect(() => {
		if (error) {
			onError?.(error); // Use optional chaining
			if (internalInputRef.current) {
				internalInputRef.current.value = ''; // Use internal ref
			}
		}
	}, [error, onError]); // Add onError to dependencies

	useEffect(() => {
		setAllTags((s) => (tags ? [...tags, 'upload'] : ['upload']));
	}, [tags]);

	useEffect(() => {
		onProgress?.(progress);
	}, [progress]);

	return null;
}

const parseImageFile = async (file: File): Promise<ImageData> => {
	if (!file) return Promise.reject('Invalid file');

	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = (err) => reject(err);
		reader.onload = (e) => {
			const image = new Image();
			if (e.target.result === 'data:') return reject('invalid');
			image.src = e.target.result as string;
			image.onload = function () {
				resolve({ width: image.width, height: image.height, src: image.src });
			};
		};
		reader.readAsDataURL(file);
	});
};
