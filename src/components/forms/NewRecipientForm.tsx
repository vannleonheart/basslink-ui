import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Alert, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { CountryCodeList } from '@/data/country-code';
import { useSession } from 'next-auth/react';
import NewRecipientDocument from './parts/NewRecipientDocument';
import apiService from '@/store/apiService';
import { ApiResponse } from '@/types/component';
import { useAppDispatch } from '@/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import useNavigate from '@fuse/hooks/useNavigate';
import { AccountTypes, RelationshipTypes, UserTypes } from '@/data/static-data';
import { Recipient, Sender } from '@/types/entity';
import { CreateRecipientDocumentFormData, CreateRecipientFormData } from '@/types/form';
import { useState } from 'react';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import SenderListDialog from '../dialogs/SenderListDialog';

const schema = z.object({
	recipient_sender_id: z.string().min(1, ''),
	recipient_type: z.enum(['individual', 'institution'], { message: 'Jenis penerima tidak valid' }),
	recipient_relationship: z.string().min(1, 'Anda harus memasukkan hubungan dengan penerima'),
	recipient_name: z.string().min(1, 'Anda harus memasukkan nama penerima'),
	recipient_country: z.string().min(1, 'Anda harus memasukkan negara penerima'),
	recipient_region: z.string().min(1, 'Anda harus memasukkan provinsi penerima'),
	recipient_city: z.string().min(1, 'Anda harus memasukkan kota penerima'),
	recipient_address: z.string().min(1, 'Anda harus memasukkan alamat penerima'),
	recipient_zip_code: z.string().min(1, 'Anda harus memasukkan kode pos penerima'),
	recipient_contact: z.string().min(1, 'Anda harus memasukkan nomor telepon/email penerima'),
	recipient_pep_status: z.optional(z.string().or(z.literal(''))),
	recipient_account_type: z.string().min(1, 'Anda harus memasukkan jenis rekening penerima'),
	recipient_bank_name: z.string().min(1, 'Anda harus memasukkan bank penerima'),
	recipient_bank_code: z.string().min(1, 'Anda harus memasukkan kode bank penerima'),
	recipient_bank_account_no: z.string().min(1, 'Anda harus memasukkan nomor rekening penerima'),
	recipient_bank_account_owner: z.string().min(1, 'Anda harus memasukkan nama pemilik rekening penerima'),
	recipient_notes: z.optional(z.string().or(z.literal(''))),
	recipient_documents: z
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

type NewRecipientFormProps = {
	recipient?: Recipient;
};

export default function NewRecipientForm({ recipient }: NewRecipientFormProps) {
	const { control, formState, handleSubmit, setValue } = useForm<CreateRecipientFormData>({
		mode: 'onChange',
		resolver: zodResolver(schema),
		defaultValues: {
			recipient_sender_id: recipient?.sender_id ?? '',
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
			recipient_account_type: recipient?.account_type ?? '',
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
	const [sender, setSender] = useState<Sender | null>(null);

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

	const selectSenderFromSenderList = () => {
		dispatch(
			openDialog({
				fullWidth: true,
				children: (
					<SenderListDialog
						onSelect={(sender: Sender) => {
							setValue('recipient_sender_id', sender.id, { shouldDirty: true, shouldValidate: true });
							setSender(sender);
						}}
					/>
				)
			})
		);
	};

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
						<h4 className="font-bold">Identitas Penerima</h4>
					</div>
					<div className="flex flex-col items-center justify-between gap-12 md:flex-row mb-12">
						<TextField
							label="Nama Pengirim"
							error={!!errors.recipient_sender_id}
							helperText={errors?.recipient_sender_id?.message}
							variant="outlined"
							value={sender?.name ?? ''}
							required
							className="w-full md:w-4/5"
						/>
						<Button
							variant="contained"
							color="primary"
							className="w-full md:w-1/5"
							onClick={selectSenderFromSenderList}
						>
							Pilih Pengirim
						</Button>
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
								>
									{Object.keys(UserTypes).map((key) => (
										<MenuItem
											key={`recipient-type-${key}`}
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
								/>
							)}
						/>
						<Controller
							name="recipient_relationship"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Hubungan"
									error={!!errors.recipient_relationship}
									helperText={errors?.recipient_relationship?.message}
									variant="outlined"
									required
									fullWidth
									select
								>
									{Object.keys(RelationshipTypes).map((key) => (
										<MenuItem
											key={`recipient-relationship-${key}`}
											value={key}
										>
											{RelationshipTypes[key as keyof typeof RelationshipTypes]}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
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
						<div className="w-full md:w-1/2 flex flex-col items-start justify-between gap-12 md:flex-row">
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
						</div>
						<div className="w-full md:w-1/2 flex flex-col items-start justify-between gap-12 md:flex-row">
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
										select
										className="w-full md:3/5"
									>
										{countryList.map((country) => (
											<MenuItem
												key={`recipient_country_${country.code}`}
												value={country.code}
											>
												{country.name}
											</MenuItem>
										))}
									</TextField>
								)}
							/>
							<Controller
								name="recipient_zip_code"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Kode Pos"
										type="tel"
										error={!!errors.recipient_zip_code}
										helperText={errors?.recipient_zip_code?.message}
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
					<Controller
						name="recipient_contact"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Nomor Telepon/Email"
								error={!!errors.recipient_contact}
								helperText={errors?.recipient_contact?.message}
								variant="outlined"
								fullWidth
								className="mb-12"
							/>
						)}
					/>
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
					<Typography
						fontWeight="medium"
						fontSize={14}
						className="mt-12 mb-8 mb-6"
					>
						Rekening Bank Penerima
					</Typography>
					<Controller
						name="recipient_account_type"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Jenis Rekening"
								error={!!errors.recipient_account_type}
								helperText={errors?.recipient_account_type?.message}
								variant="outlined"
								required
								fullWidth
								className="mb-12"
								select
							>
								{Object.keys(AccountTypes).map((key) => (
									<MenuItem
										key={`recipient-account-type-${key}`}
										value={key}
									>
										{AccountTypes[key]}
									</MenuItem>
								))}
							</TextField>
						)}
					/>
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<Controller
							name="recipient_bank_name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Nama Bank"
									error={!!errors.recipient_bank_name}
									helperText={errors?.recipient_bank_name?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
						<Controller
							name="recipient_bank_code"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Kode Bank"
									error={!!errors.recipient_bank_code}
									helperText={errors?.recipient_bank_code?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
					</div>
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<Controller
							name="recipient_bank_account_no"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Nomor Rekening Bank"
									error={!!errors.recipient_bank_account_no}
									helperText={errors?.recipient_bank_account_no?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
						<Controller
							name="recipient_bank_account_owner"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Pemilik Rekening"
									error={!!errors.recipient_bank_account_owner}
									helperText={errors?.recipient_bank_account_owner?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
					</div>
				</div>
				<Controller
					name="recipient_documents"
					control={control}
					render={({ field }) => <NewRecipientDocument {...field} />}
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
