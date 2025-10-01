import { CreateContactAccountFormData } from '@/types/form';
import { Button, MenuItem, TextField } from '@mui/material';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

type NewContactBankAccountProps = {
	value: CreateContactAccountFormData[];
	onChange: (value: CreateContactAccountFormData[]) => void;
	className?: string;
	countryList: { code: string; name: string; dial_code: string }[];
};

export default function NewContactBankAccount({ value, onChange, countryList }: NewContactBankAccountProps) {
	const handleAdd = () => {
		onChange([
			...value,
			{
				bank_name: '',
				bank_account_no: '',
				bank_account_name: '',
				bank_country: '',
				bank_code: '',
				bank_swift_code: '',
				bank_address: '',
				bank_email: '',
				bank_phone_code: '',
				bank_phone_no: '',
				bank_website: '',
				bank_notes: ''
			}
		]);
	};

	const handleRemove = (index: number) => {
		if (value.length === 1) {
			// Prevent removing the last document entry
			return;
		}

		const newValue = [...value].filter((_, i) => i !== index);

		onChange(newValue);
	};

	const handleChange = (index: number, newValue: CreateContactAccountFormData) => {
		const newValues = [...value].map((item, i) => (i === index ? newValue : item));

		onChange(newValues);
	};

	return (
		<React.Fragment>
			{value.map((data, index) => (
				<ContactBankAccount
					key={index}
					value={data}
					countryList={countryList}
					onAdd={handleAdd}
					onRemove={() => handleRemove(index)}
					onChange={(val) => handleChange(index, val)}
				/>
			))}
		</React.Fragment>
	);
}

type ContactBankAccountProps = {
	value?: CreateContactAccountFormData;
	onChange?: (value: CreateContactAccountFormData) => void;
	onRemove?: () => void;
	onAdd?: () => void;
	className?: string;
	countryList: { code: string; name: string; dial_code: string }[];
};

function ContactBankAccount({ value, onChange, onRemove, onAdd, countryList }: ContactBankAccountProps) {
	const { control, formState, handleSubmit } = useForm<CreateContactAccountFormData>({
		mode: 'all',
		defaultValues: {
			bank_name: value?.bank_name || '',
			bank_account_no: value?.bank_account_no || '',
			bank_account_name: value?.bank_account_name || '',
			bank_country: value?.bank_country || '',
			bank_code: value?.bank_code || '',
			bank_swift_code: value?.bank_swift_code || '',
			bank_address: value?.bank_address || '',
			bank_email: value?.bank_email || '',
			bank_phone_code: value?.bank_phone_code || '',
			bank_phone_no: value?.bank_phone_no || '',
			bank_website: value?.bank_website || '',
			bank_notes: value?.bank_notes || ''
		}
	});
	const { errors } = formState;

	const onSubmit = (data: CreateContactAccountFormData) => {
		onChange?.(data);
	};

	return (
		<form
			onChange={handleSubmit(onSubmit)}
			className="w-full"
		>
			<div className="w-full p-24 bg-white shadow-2 rounded">
				<div className="mb-24 flex flex-col items-start justify-start gap-12 md:flex-row md:items-center md:justify-between">
					<h4 className="font-bold">Informasi Rekening</h4>
					<div>
						<Button
							onClick={onAdd}
							color="primary"
						>
							Tambah Rekening
						</Button>
						<Button
							onClick={onRemove}
							color="error"
						>
							Hapus
						</Button>
					</div>
				</div>
				<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
					<Controller
						name="bank_name"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Nama Bank"
								autoFocus
								type="text"
								error={!!errors.bank_name}
								helperText={errors?.bank_name?.message}
								variant="outlined"
								required
								fullWidth
							/>
						)}
					/>
					<Controller
						name="bank_account_no"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Nomor Rekening"
								autoFocus
								type="text"
								error={!!errors.bank_account_no}
								helperText={errors?.bank_account_no?.message}
								variant="outlined"
								required
								fullWidth
							/>
						)}
					/>
					<Controller
						name="bank_account_name"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Nama Pemilik"
								autoFocus
								type="text"
								error={!!errors.bank_account_name}
								helperText={errors?.bank_account_name?.message}
								variant="outlined"
								required
								fullWidth
							/>
						)}
					/>
				</div>
				<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
					<Controller
						name="bank_country"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Negara"
								autoFocus
								error={!!errors.bank_country}
								helperText={errors?.bank_country?.message}
								variant="outlined"
								required
								fullWidth
								select
							>
								{countryList.map((country) => (
									<MenuItem
										key={`receiver_bank_country_${country.code}`}
										value={country.code}
									>
										{country.name}
									</MenuItem>
								))}
							</TextField>
						)}
					/>
					<Controller
						name="bank_code"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Kode Bank Lokal"
								autoFocus
								type="text"
								error={!!errors.bank_code}
								helperText={errors?.bank_code?.message}
								variant="outlined"
								required
								fullWidth
							/>
						)}
					/>
					<Controller
						name="bank_swift_code"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Kode SWIFT Bank"
								autoFocus
								type="text"
								error={!!errors.bank_swift_code}
								helperText={errors?.bank_swift_code?.message}
								variant="outlined"
								required
								fullWidth
							/>
						)}
					/>
				</div>
				<Controller
					name="bank_address"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label="Alamat Bank"
							error={!!errors.bank_address}
							helperText={errors?.bank_address?.message}
							variant="outlined"
							fullWidth
							multiline
							minRows={3}
							maxRows={5}
							className="mb-12"
						/>
					)}
				/>
				<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
					<Controller
						name="bank_email"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Email"
								type="email"
								error={!!errors.bank_email}
								helperText={errors?.bank_email?.message}
								variant="outlined"
								fullWidth
							/>
						)}
					/>
					<Controller
						name="bank_website"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Website"
								type="url"
								error={!!errors.bank_website}
								helperText={errors?.bank_website?.message}
								variant="outlined"
								fullWidth
							/>
						)}
					/>
					<Controller
						name="bank_phone_code"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Kode Telepon"
								type="tel"
								error={!!errors.bank_phone_code}
								helperText={errors?.bank_phone_code?.message}
								variant="outlined"
								fullWidth
								select
							>
								{countryList.map((country) => (
									<MenuItem
										key={`contact_phone_code${country.code}`}
										value={country.dial_code}
									>
										{country.name} ({country.dial_code})
									</MenuItem>
								))}
							</TextField>
						)}
					/>
					<Controller
						name="bank_phone_no"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Nomor Telepon"
								type="tel"
								error={!!errors.bank_phone_no}
								helperText={errors?.bank_phone_no?.message}
								variant="outlined"
								fullWidth
							/>
						)}
					/>
				</div>
				<Controller
					name="bank_notes"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							label="Catatan"
							error={!!errors.bank_notes}
							helperText={errors?.bank_notes?.message}
							variant="outlined"
							fullWidth
							multiline
							minRows={3}
							maxRows={5}
							className="mb-12"
						/>
					)}
				/>
			</div>
		</form>
	);
}
