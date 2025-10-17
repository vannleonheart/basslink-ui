import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Alert } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { CountryCodeList } from '@/data/country-code';
import { useSession } from 'next-auth/react';
import NewContactDocument from './parts/NewContactDocument';
import apiService from '@/store/apiService';
import { ApiResponse } from '@/types/component';
import { useAppDispatch } from '@/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import useNavigate from '@fuse/hooks/useNavigate';
import { UserTypes } from '@/data/static-data';
import { Recipient } from '@/types/entity';
import { CreateRecipientDocumentFormData, CreateRecipientFormData } from '@/types/form';

const schema = z.object({
	sender_id: z.string().min(1, ''),
	recipient_type: z.enum(['individual', 'institution'], { message: 'Jenis penerima tidak valid' }),
	recipient_name: z
		.string()
		.min(3, 'Nama terdiri dari minimal 3 karakter')
		.max(100, 'Nama harus terdiri dari maksimal 100 karakter'),
	recipient_country: z.optional(z.string().or(z.literal(''))),
	recipient_region: z.optional(z.string().or(z.literal(''))),
	recipient_city: z.optional(z.string().or(z.literal(''))),
	recipient_address: z.optional(z.string().or(z.literal(''))),
	recipient_notes: z.optional(z.string().or(z.literal(''))),
	recipient_documents: z.array(
		z.object({
			id: z.optional(z.string().or(z.literal(''))),
			document_data: z.string().min(2, 'Data dokumen harus diisi'),
			document_type: z.string().min(2, 'Jenis dokumen harus diisi'),
			notes: z.optional(z.string().or(z.literal(''))),
			is_verified: z.optional(z.boolean())
		})
	),
	recipient_accounts: z.array(
		z.object({
			id: z.optional(z.string().or(z.literal(''))),
			bank_name: z.string().min(2, 'Nama Bank harus diisi'),
			bank_account_no: z.string().min(2, 'Nomor rekening harus diisi'),
			bank_account_name: z.string().min(2, 'Nama pemilik rekening harus diisi'),
			bank_country: z.string().min(2, 'Negara bank harus diisi'),
			bank_code: z.optional(z.string().or(z.literal(''))),
			bank_swift_code: z.optional(z.string().or(z.literal(''))),
			bank_address: z.optional(z.string().or(z.literal(''))),
			bank_email: z.optional(z.string().email('Email tidak valid').or(z.literal(''))),
			bank_phone_code: z.optional(z.string().or(z.literal(''))),
			bank_phone_no: z.optional(z.string().or(z.literal(''))),
			bank_website: z.optional(z.string().url('URL tidak valid').or(z.literal(''))),
			bank_notes: z.optional(z.string().or(z.literal('')))
		})
	)
});

type NewRecipientFormProps = {
	recipient?: Recipient;
};

export default function NewRecipientForm({ recipient }: NewRecipientFormProps) {
	const { control, formState, handleSubmit } = useForm<CreateRecipientFormData>({
		mode: 'onChange',
		resolver: zodResolver(schema),
		defaultValues: {
			sender_id: recipient?.sender_id ?? '',
			recipient_type: recipient?.recipient_type ?? 'individual',
			recipient_relationship: recipient?.relationship ?? '',
			recipient_name: recipient?.name ?? '',
			recipient_country: recipient?.country ?? '',
			recipient_region: recipient?.region ?? '',
			recipient_city: recipient?.city ?? '',
			recipient_address: recipient?.address ?? '',
			recipient_zip_code: recipient?.zip_code ?? '',
			recipient_contact: recipient?.contact ?? '',
			recipient_pep_status: recipient?.pep_status ?? '',
			recipient_bank_name: recipient?.bank_name ?? '',
			recipient_bank_code: recipient?.bank_code ?? '',
			recipient_bank_account_no: recipient?.bank_account_no ?? '',
			recipient_bank_account_owner: recipient?.bank_account_owner ?? '',
			recipient_notes: recipient?.notes ?? '',
			recipient_documents:
				recipient?.documents && recipient?.documents?.length > 0
					? recipient?.documents
					: ([
							{
								id: '',
								document_data: '',
								document_type: '',
								notes: '',
								is_verified: false
							}
						] as CreateRecipientDocumentFormData[])
		}
	});
	const { isValid, dirtyFields, errors } = formState;
	const { data } = useSession() ?? {};
	const { accessToken } = data ?? {};
	const [createRecipient, { isLoading: submitting }] = apiService.useCreateRecipientMutation();
	const [updateRecipient, { isLoading: updating }] = apiService.useUpdateRecipientMutation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	async function onSubmit(formData: CreateRecipientFormData) {
		if (submitting || updating) {
			return;
		}

		if (!recipient) {
			const { error } = await createRecipient({
				accessToken,
				data: formData
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
			const { error } = await updateRecipient({
				accessToken,
				id: recipient.id,
				data: formData
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

		navigate(`/recipients/list`);
	}

	const countryList = CountryCodeList.sort((a, b) => a.name.localeCompare(b.name));

	return (
		<div className="mt-32 flex w-full flex-col justify-center">
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
						<h4 className="font-bold">Informasi Penerima</h4>
					</div>
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<Controller
							name="recipient_type"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Jenis Penerima"
									error={!!errors.recipient_type}
									helperText={errors?.recipient_type?.message}
									variant="outlined"
									required
									fullWidth
									select
									className="w-full md:w-1/3"
								>
									{Object.keys(UserTypes).map((key) => (
										<MenuItem
											key={`contact-type-${key}`}
											value={key}
										>
											{UserTypes[key as keyof typeof UserTypes]}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
						<Controller
							name="recipient_name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Nama Penerima"
									error={!!errors.recipient_name}
									helperText={errors?.recipient_name?.message}
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
							name="recipient_country"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Negara"
									error={!!errors.recipient_country}
									helperText={errors?.recipient_country?.message}
									variant="outlined"
									required
									fullWidth
									select
									className="w-full md:w-1/3"
								>
									{countryList.map((country) => (
										<MenuItem
											key={`receiver_country_${country.code}`}
											value={country.code}
										>
											{country.name}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
						<div className="w-full md:w-2/3 flex flex-col items-start justify-between gap-12 md:flex-row">
							<Controller
								name="recipient_region"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Provinsi"
										error={!!errors.recipient_region}
										helperText={errors?.recipient_region?.message}
										variant="outlined"
										fullWidth
									/>
								)}
							/>
							<Controller
								name="recipient_city"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Kota"
										error={!!errors.recipient_city}
										helperText={errors?.recipient_city?.message}
										variant="outlined"
										fullWidth
									/>
								)}
							/>
						</div>
					</div>
					<Controller
						name="recipient_address"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Alamat"
								error={!!errors.recipient_address}
								helperText={errors?.recipient_address?.message}
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
						<Controller
							name="recipient_contact"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Email"
									type="email"
									error={!!errors.recipient_contact}
									helperText={errors?.recipient_contact?.message}
									variant="outlined"
									fullWidth
									className="w-full md:w-1/3"
								/>
							)}
						/>
					</div>
					<Controller
						name="recipient_notes"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Catatan"
								error={!!errors.recipient_notes}
								helperText={errors?.recipient_notes?.message}
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
					name="recipient_documents"
					control={control}
					render={({ field }) => <NewContactDocument {...field} />}
				/>
			</div>
			<Button
				variant="contained"
				color="primary"
				className="mt-24 w-full shadow-2"
				aria-label="Submit"
				disabled={_.isEmpty(dirtyFields) || !isValid || submitting || updating}
				type="submit"
				size="large"
				onClick={handleSubmit(onSubmit)}
			>
				{submitting || updating ? 'Menyimpan...' : 'Simpan'}
			</Button>
		</div>
	);
}
