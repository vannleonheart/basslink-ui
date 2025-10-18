import { Controller, useForm } from 'react-hook-form';
import FileUploadInput from '../fields/FileUploadInput';
import { CreateRecipientDocumentFormData } from '@/types/form';
import { Button, MenuItem, TextField } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { DocumentTypes } from '@/data/static-data';

type NewRecipientDocumentProps = {
	value: CreateRecipientDocumentFormData[];
	onChange: (value: CreateRecipientDocumentFormData[]) => void;
};

export default function NewRecipientDocument({ value, onChange }: NewRecipientDocumentProps) {
	const handleAddDocument = () => {
		onChange([...value, { document_data: null, document_type: '', notes: '', is_verified: false }]);
	};

	const handleRemoveDocument = (index: number) => {
		if (value.length === 1) {
			// Prevent removing the last document entry
			return;
		}

		const newValue = [...value].filter((_, i) => i !== index);

		onChange(newValue);
	};

	const handleDocumentChange = (index: number, newValue: CreateRecipientDocumentFormData) => {
		const newValues = [...value].map((item, i) => (i === index ? newValue : item));

		onChange(newValues);
	};

	return (
		<div className={`w-full p-24 bg-white shadow-2 rounded`}>
			<div className="mb-24 flex flex-col items-start justify-start gap-12 md:flex-row md:items-center md:justify-between">
				<h4 className="font-bold">Dokumen</h4>
				<Button onClick={handleAddDocument}>Tambah Dokumen</Button>
			</div>
			{value.map((item, index) => (
				<RecipientDocument
					key={index}
					value={item}
					onRemove={() => handleRemoveDocument(index)}
					onChange={(newValue) => handleDocumentChange(index, newValue)}
				/>
			))}
		</div>
	);
}

type RecipientDocumentProps = {
	value?: CreateRecipientDocumentFormData;
	onChange?: (value: CreateRecipientDocumentFormData) => void;
	onRemove?: () => void;
};

function RecipientDocument({ value, onChange, onRemove }: RecipientDocumentProps) {
	const { control, formState, handleSubmit } = useForm<CreateRecipientDocumentFormData>({
		mode: 'all',
		defaultValues: {
			id: value?.id ?? '',
			document_data: value?.document_data ?? '',
			document_type: value?.document_type ?? '',
			notes: value?.notes ?? '',
			is_verified: value?.is_verified ?? false
		}
	});
	const { errors } = formState;

	const onSubmit = (data: CreateRecipientDocumentFormData) => {
		onChange?.(data);
	};

	return (
		<form onChange={handleSubmit(onSubmit)}>
			<div className={`flex flex-col items-start justify-between gap-12 md:flex-row mb-12`}>
				<Controller
					name="document_type"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label="Jenis Dokumen"
							error={!!errors.document_type}
							helperText={errors?.document_type?.message}
							variant="outlined"
							required
							fullWidth
							select
						>
							{Object.keys(DocumentTypes).map((key) => (
								<MenuItem
									key={key}
									value={key}
								>
									{DocumentTypes[key]}
								</MenuItem>
							))}
						</TextField>
					)}
				/>
				<Controller
					name="document_data"
					control={control}
					render={({ field }) => (
						<FileUploadInput
							{...field}
							label="Unggah Dokumen"
							error={!!errors.document_data}
							helperText={errors?.document_data?.message}
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Controller
					name="notes"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label="Catatan"
							error={!!errors.notes}
							helperText={errors?.notes?.message}
							variant="outlined"
							fullWidth
						/>
					)}
				/>
				<Button
					variant="contained"
					color="error"
					onClick={onRemove}
				>
					<FuseSvgIcon size={20}>heroicons-solid:trash</FuseSvgIcon>
				</Button>
			</div>
		</form>
	);
}
