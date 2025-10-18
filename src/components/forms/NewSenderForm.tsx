import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Alert, Checkbox, FormControl, FormControlLabel, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { CountryCodeList } from '@/data/country-code';
import { useSession } from 'next-auth/react';
import { CreateSenderDocumentFormData, CreateSenderFormData } from '@/types/form';
import apiService from '@/store/apiService';
import { useAppDispatch } from '@/store/hooks';
import useNavigate from '@fuse/hooks/useNavigate';
import { ApiResponse } from '@/types/component';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { Gender, IdentityTypes, Occupations, UserTypes } from '@/data/static-data';
import { Sender } from '@/types/entity';
import NewSenderDocument from './parts/NewSenderDocument';
import { useEffect, useState } from 'react';

const schema = z.object({
	sender_type: z.enum(['individual', 'institution'], { message: 'Jenis pengirim tidak valid' }),
	sender_name: z
		.string()
		.min(3, 'Nama harus terdiri dari minimal 3 karakter')
		.max(100, 'Nama harus terdiri dari maksimal 100 karakter'),
	sender_gender: z.enum(['male', 'female'], { message: 'Jenis kelamin tidak valid' }),
	sender_birthdate: z.string().min(1, 'Tanggal lahir harus diisi'),
	sender_citizenship: z.string().min(1, 'Kewarganegaraan harus diisi'),
	sender_identity_type: z.string().min(1, 'Jenis identitas harus diisi'),
	sender_identity_no: z.string().min(1, 'Nomor identitas harus diisi'),
	sender_occupation: z.string().min(1, 'Pekerjaan harus diisi'),
	sender_registered_country: z.string().min(1, 'Negara terdaftar harus diisi'),
	sender_registered_region: z.string().min(1, 'Provinsi terdaftar harus diisi'),
	sender_registered_city: z.string().min(1, 'Kota terdaftar harus diisi'),
	sender_registered_address: z.string().min(1, 'Alamat terdaftar harus diisi'),
	sender_registered_zip_code: z.string().min(1, 'Kode pos terdaftar harus diisi'),
	sender_country: z.string().min(1, 'Negara harus diisi'),
	sender_region: z.string().min(1, 'Provinsi harus diisi'),
	sender_city: z.string().min(1, 'Kota harus diisi'),
	sender_address: z.string().min(1, 'Alamat harus diisi'),
	sender_zip_code: z.string().min(1, 'Kode pos harus diisi'),
	sender_contact: z.string().min(1, 'Kontak harus diisi'),
	sender_notes: z.optional(z.string().or(z.literal(''))),
	sender_documents: z
		.array(
			z
				.object({
					id: z.optional(z.string().or(z.literal(''))),
					document_data: z.optional(z.string().or(z.literal(''))),
					document_type: z.optional(z.string().or(z.literal(''))),
					notes: z.optional(z.string().or(z.literal(''))),
					is_verified: z.optional(z.boolean())
				})
				.refine(
					(data) => {
						if (data.document_data && data.document_data.length > 0) {
							return data.document_type && data.document_type.length > 0;
						}

						return true;
					},
					{
						message: 'Anda harus memilih jenis dokumen jika mengunggah dokumen'
					}
				)
		)
		.optional()
});

type NewSenderFormProps = {
	sender?: Sender;
};

export default function NewSenderForm({ sender }: NewSenderFormProps) {
	const { control, formState, handleSubmit, watch, setValue } = useForm<CreateSenderFormData>({
		mode: 'onChange',
		resolver: zodResolver(schema),
		defaultValues: {
			sender_type: sender?.sender_type ?? '',
			sender_name: sender?.name ?? '',
			sender_gender: sender?.gender ?? '',
			sender_birthdate: sender?.birthdate ?? '',
			sender_citizenship: sender?.citizenship ?? '',
			sender_identity_type: sender?.identity_type ?? '',
			sender_identity_no: sender?.identity_no ?? '',
			sender_registered_country: sender?.registered_country ?? '',
			sender_registered_region: sender?.registered_region ?? '',
			sender_registered_city: sender?.registered_city ?? '',
			sender_registered_address: sender?.registered_address ?? '',
			sender_registered_zip_code: sender?.registered_zip_code ?? '',
			sender_country: sender?.country ?? '',
			sender_region: sender?.region ?? '',
			sender_city: sender?.city ?? '',
			sender_address: sender?.address ?? '',
			sender_zip_code: sender?.zip_code ?? '',
			sender_contact: sender?.contact ?? '',
			sender_occupation: sender?.occupation ?? '',
			sender_pep_status: sender?.pep_status ?? '',
			sender_notes: sender?.notes ?? '',
			sender_documents:
				sender?.documents && sender.documents.length > 0
					? sender.documents
					: ([
							{
								id: '',
								document_data: '',
								document_type: '',
								notes: '',
								is_verified: false
							}
						] as CreateSenderDocumentFormData[])
		}
	});
	const { isValid, dirtyFields, errors } = formState;
	const {
		sender_registered_address,
		sender_registered_city,
		sender_registered_country,
		sender_registered_region,
		sender_registered_zip_code
	} = watch();
	const { data } = useSession() ?? {};
	const { accessToken, side } = data ?? {};
	const [createSender, { isLoading: submitting }] = apiService.useCreateSenderMutation();
	const [updateSender, { isLoading: updating }] = apiService.useUpdateSenderMutation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [isSenderDomicileSameAsIdAddress, setIsSenderDomicileSameAsIdAddress] = useState(false);

	useEffect(() => {
		if (isSenderDomicileSameAsIdAddress) {
			setValue('sender_country', sender_registered_country);
			setValue('sender_region', sender_registered_region);
			setValue('sender_city', sender_registered_city);
			setValue('sender_address', sender_registered_address);
			setValue('sender_zip_code', sender_registered_zip_code);
		}
	}, [
		isSenderDomicileSameAsIdAddress,
		setValue,
		sender_registered_address,
		sender_registered_city,
		sender_registered_country,
		sender_registered_region,
		sender_registered_zip_code
	]);

	async function onSubmit(formData: CreateSenderFormData) {
		if (submitting || updating) {
			return;
		}

		if (!sender) {
			const { error } = await createSender({
				accessToken,
				data: formData,
				side
			});

			if (error) {
				const errorData = error as { data: ApiResponse };
				dispatch(
					showMessage({
						variant: 'error',
						message: errorData?.data?.message
					})
				);
				return false;
			}
		} else {
			const { error } = await updateSender({
				id: sender.id,
				accessToken,
				data: formData,
				side
			});

			if (error) {
				const errorData = error as { data: ApiResponse };
				dispatch(
					showMessage({
						variant: 'error',
						message: errorData?.data?.message
					})
				);
				return false;
			}
		}

		navigate(`/senders/list`);
	}

	const countryList = CountryCodeList.sort((a, b) => a.name.localeCompare(b.name));

	return (
		<div className="my-20 flex w-full flex-col justify-center">
			{errors?.root?.message && (
				<Alert
					className="mb-32"
					severity="error"
					sx={(theme) => ({
						backgroundColor: theme.palette.error.light,
						color: theme.palette.error.dark
					})}
				>
					{errors?.root?.message}
				</Alert>
			)}
			<div className="flex flex-col items-center justify-center gap-20">
				<div className="w-full p-24 bg-white shadow-2 rounded">
					<div className="mb-24 flex flex-col items-start justify-start gap-12 md:flex-row md:items-center md:justify-between">
						<h4 className="font-bold">Identitas Pengirim</h4>
					</div>
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<Controller
							name="sender_type"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									autoFocus
									label="Jenis Pengirim"
									error={!!errors.sender_type}
									helperText={errors?.sender_type?.message}
									variant="outlined"
									required
									fullWidth
									select
									className="w-full md:w-1/3"
								>
									{Object.keys(UserTypes).map((key) => (
										<MenuItem
											key={`sender-type-${key}`}
											value={key}
										>
											{UserTypes[key as keyof typeof UserTypes]}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
						<Controller
							name="sender_name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Nama pengirim sesuai dengan identitas"
									error={!!errors.sender_name}
									helperText={errors?.sender_name?.message}
									variant="outlined"
									required
									fullWidth
									className="w-full md:w-2/3"
								/>
							)}
						/>
					</div>
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<Controller
							name="sender_gender"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Jenis Kelamin"
									error={!!errors.sender_gender}
									helperText={errors?.sender_gender?.message}
									variant="outlined"
									required
									fullWidth
									select
									className="w-full md:w-1/3"
								>
									{Object.entries(Gender).map(([key, value]) => (
										<MenuItem
											key={`sender-gender-${key}`}
											value={key}
										>
											{value}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
						<div className="w-full md:w-2/3 flex flex-col items-start justify-between gap-12 md:flex-row">
							<Controller
								name="sender_birthdate"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Tanggal Lahir"
										type="date"
										error={!!errors.sender_birthdate}
										helperText={errors?.sender_birthdate?.message}
										variant="outlined"
										required
										fullWidth
									/>
								)}
							/>
							<Controller
								name="sender_citizenship"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Kewarganegaraan"
										error={!!errors.sender_citizenship}
										helperText={errors?.sender_citizenship?.message}
										variant="outlined"
										required
										fullWidth
										select
									>
										{countryList.map((country) => (
											<MenuItem
												key={`sender_citizenship_${country.code}`}
												value={country.code}
											>
												{country.name}
											</MenuItem>
										))}
									</TextField>
								)}
							/>
						</div>
					</div>
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<Controller
							name="sender_identity_type"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Jenis Identitas"
									error={!!errors.sender_identity_type}
									helperText={errors?.sender_identity_type?.message}
									variant="outlined"
									required
									fullWidth
									select
									className="w-full md:w-1/3"
								>
									{Object.entries(IdentityTypes).map(([key, value]) => (
										<MenuItem
											key={`customer-identity-type-${key}`}
											value={key}
										>
											{value}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
						<div className="w-full md:w-2/3 flex flex-col items-start justify-between gap-12 md:flex-row">
							<Controller
								name="sender_identity_no"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Nomor Identitas"
										error={!!errors.sender_identity_no}
										helperText={errors?.sender_identity_no?.message}
										variant="outlined"
										required
										fullWidth
									/>
								)}
							/>
							<Controller
								name="sender_occupation"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Pekerjaan"
										error={!!errors.sender_occupation}
										helperText={errors?.sender_occupation?.message}
										variant="outlined"
										fullWidth
										select
									>
										{Object.entries(Occupations).map(([key, value]) => (
											<MenuItem
												key={`sender-occupation-${key}`}
												value={key}
											>
												{value}
											</MenuItem>
										))}
									</TextField>
								)}
							/>
						</div>
					</div>
					<Typography
						fontWeight="medium"
						fontSize={14}
						className="mt-20 mb-6"
					>
						Alamat sesuai identitas
					</Typography>
					<Controller
						name="sender_registered_address"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Alamat"
								error={!!errors.sender_registered_address}
								helperText={errors?.sender_registered_address?.message}
								variant="outlined"
								required
								fullWidth
								multiline
								minRows={3}
								maxRows={5}
								className="mb-12"
							/>
						)}
					/>
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<div className="w-full md:w-1/2 flex flex-col items-start justify-between gap-12 md:flex-row">
							<Controller
								name="sender_registered_city"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Kota"
										error={!!errors.sender_registered_city}
										helperText={errors?.sender_registered_city?.message}
										variant="outlined"
										fullWidth
									/>
								)}
							/>
							<Controller
								name="sender_registered_region"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Provinsi"
										error={!!errors.sender_registered_region}
										helperText={errors?.sender_registered_region?.message}
										variant="outlined"
										fullWidth
									/>
								)}
							/>
						</div>
						<div className="w-full md:w-1/2 flex flex-col items-start justify-between gap-12 md:flex-row">
							<Controller
								name="sender_registered_country"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Negara"
										error={!!errors.sender_registered_country}
										helperText={errors?.sender_registered_country?.message}
										variant="outlined"
										required
										select
										className="w-full md:3/5"
									>
										{countryList.map((country) => (
											<MenuItem
												key={`sender_registered_country_${country.code}`}
												value={country.code}
											>
												{country.name}
											</MenuItem>
										))}
									</TextField>
								)}
							/>
							<Controller
								name="sender_registered_zip_code"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Kode Pos"
										type="tel"
										error={!!errors.sender_registered_zip_code}
										helperText={errors?.sender_registered_zip_code?.message}
										variant="outlined"
										className="w-full md:w-2/5"
										slotProps={{
											htmlInput: {
												maxLength: 5
											}
										}}
									/>
								)}
							/>
						</div>
					</div>
					<div className="mt-20 mb-6 flex flex-col items-start justify-start gap-12 md:flex-row md:items-center md:justify-between">
						<Typography
							fontWeight="medium"
							fontSize={14}
						>
							Alamat domisili
						</Typography>
						<FormControl>
							<FormControlLabel
								label="Check jika alamat domisili sama dengan alamat sesuai identitas"
								control={
									<Checkbox
										size="small"
										checked={isSenderDomicileSameAsIdAddress}
										onChange={(e) => setIsSenderDomicileSameAsIdAddress(e.target.checked)}
									/>
								}
							/>
						</FormControl>
					</div>
					<Controller
						name="sender_address"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Alamat"
								error={!!errors.sender_address}
								helperText={errors?.sender_address?.message}
								variant="outlined"
								required
								fullWidth
								multiline
								minRows={3}
								maxRows={5}
								className="mb-12"
								disabled={isSenderDomicileSameAsIdAddress}
							/>
						)}
					/>
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<div className="w-full md:w-1/2 flex flex-col items-start justify-between gap-12 md:flex-row">
							<Controller
								name="sender_city"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Kota"
										error={!!errors.sender_city}
										helperText={errors?.sender_city?.message}
										variant="outlined"
										fullWidth
										disabled={isSenderDomicileSameAsIdAddress}
									/>
								)}
							/>
							<Controller
								name="sender_region"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Provinsi"
										error={!!errors.sender_region}
										helperText={errors?.sender_region?.message}
										variant="outlined"
										fullWidth
										disabled={isSenderDomicileSameAsIdAddress}
									/>
								)}
							/>
						</div>
						<div className="w-full md:w-1/2 flex flex-col items-start justify-between gap-12 md:flex-row">
							<Controller
								name="sender_country"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Negara"
										error={!!errors.sender_country}
										helperText={errors?.sender_country?.message}
										variant="outlined"
										required
										select
										className="w-full md:3/5"
										disabled={isSenderDomicileSameAsIdAddress}
									>
										{countryList.map((country) => (
											<MenuItem
												key={`sender_country_${country.code}`}
												value={country.code}
											>
												{country.name}
											</MenuItem>
										))}
									</TextField>
								)}
							/>
							<Controller
								name="sender_zip_code"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Kode Pos"
										type="tel"
										error={!!errors.sender_zip_code}
										helperText={errors?.sender_zip_code?.message}
										variant="outlined"
										className="w-full md:w-2/5"
										slotProps={{
											htmlInput: {
												maxLength: 5
											}
										}}
										disabled={isSenderDomicileSameAsIdAddress}
									/>
								)}
							/>
						</div>
					</div>
					<Controller
						name="sender_contact"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Nomor Telepon/Email"
								error={!!errors.sender_contact}
								helperText={errors?.sender_contact?.message}
								variant="outlined"
								fullWidth
								className="mb-12"
							/>
						)}
					/>
					<Controller
						name="sender_notes"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Catatan"
								error={!!errors.sender_notes}
								helperText={errors?.sender_notes?.message}
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

				<Controller
					name="sender_documents"
					control={control}
					render={({ field }) => <NewSenderDocument {...field} />}
				/>
			</div>
			<Button
				variant="contained"
				color="primary"
				className="mt-24 w-full shadow-2"
				aria-label="Submit"
				disabled={_.isEmpty(dirtyFields) || !isValid || submitting}
				type="submit"
				size="large"
				onClick={handleSubmit(onSubmit)}
			>
				{submitting ? 'Menyimpan...' : 'Simpan'}
			</Button>
		</div>
	);
}
