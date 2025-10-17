import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Alert, Checkbox, FormControl, FormControlLabel, Typography } from '@mui/material';
import { Currency, Recipient, Sender } from '@/types/entity';
import MenuItem from '@mui/material/MenuItem';
import { CountryCodeList } from '@/data/country-code';
import { useSession } from 'next-auth/react';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import apiService from '@/store/apiService';
import CurrencyField from './fields/CurrencyField';
import { useAppDispatch } from '@/store/hooks';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { CreateRemittanceFormData } from '@/types/form';
import RecipientListDialog from '../dialogs/RecipientListDialog';
import useNavigate from '@fuse/hooks/useNavigate';
import { ApiResponse } from '@/types/component';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import {
	FundSources,
	Gender,
	IdentityTypes,
	Occupations,
	PaymentMethods,
	RelationshipTypes,
	TransferPurposes,
	TransferTypes,
	UserTypes
} from '@/data/static-data';
import FileUploadBar from './fields/FileUploadBar';
import SenderListDialog from '../dialogs/SenderListDialog';

const schema = z.object({
	from_currency: z.string().min(1, 'Pilih mata uang pengiriman'),
	from_amount: z.string().min(1, 'Lengkapi nominal pengiriman'),
	to_currency: z.string().min(1, 'Pilih mata uang tujuan'),
	to_amount: z.string().min(1, 'Lengkapi nominal tujuan'),
	sender_id: z.optional(z.string().or(z.literal(''))),
	sender_type: z.string().min(1, 'Anda harus memasukkan jenis pengirim'),
	sender_name: z.string().min(1, 'Anda harus memasukkan nama pengirim'),
	sender_gender: z.string().min(1, 'Anda harus memasukkan jenis kelamin pengirim'),
	sender_birthdate: z.string().min(1, 'Anda harus memasukkan tanggal lahir pengirim'),
	sender_citizenship: z.string().min(1, 'Anda harus memasukkan kewarganegaraan pengirim'),
	sender_identity_type: z.string().min(1, 'Anda harus memasukkan jenis identitas pengirim'),
	sender_identity_no: z.string().min(1, 'Anda harus memasukkan nomor identitas pengirim'),
	sender_registered_country: z.string().min(1, 'Anda harus memasukkan negara pengirim sesuai identitas'),
	sender_registered_region: z.string().min(1, 'Anda harus memasukkan provinsi pengirim sesuai identitas'),
	sender_registered_city: z.string().min(1, 'Anda harus memasukkan kota pengirim sesuai identitas'),
	sender_registered_address: z.string().min(1, 'Anda harus memasukkan alamat pengirim sesuai identitas'),
	sender_registered_zip_code: z.string().min(1, 'Anda harus memasukkan kode pos pengirim sesuai identitas'),
	sender_country: z.string().min(1, 'Anda harus memasukkan negara pengirim'),
	sender_region: z.string().min(1, 'Anda harus memasukkan provinsi pengirim'),
	sender_city: z.string().min(1, 'Anda harus memasukkan kota pengirim'),
	sender_address: z.string().min(1, 'Anda harus memasukkan alamat pengirim'),
	sender_zip_code: z.string().min(1, 'Anda harus memasukkan kode pos pengirim'),
	sender_occupation: z.string().min(1, 'Anda harus memasukkan pekerjaan pengirim'),
	sender_contact: z.string().min(1, 'Anda harus memasukkan nomor telepon/email pengirim'),
	sender_pep_status: z.optional(z.string().or(z.literal(''))),
	sender_notes: z.optional(z.string().or(z.literal(''))),
	sender_update: z.boolean(),
	recipient_id: z.optional(z.string().or(z.literal(''))),
	recipient_type: z.string().min(1, 'Anda harus memasukkan jenis penerima'),
	recipient_relationship: z.string().min(1, 'Anda harus memasukkan hubungan dengan penerima'),
	recipient_name: z.string().min(1, 'Anda harus memasukkan nama penerima'),
	recipient_country: z.string().min(1, 'Anda harus memasukkan negara penerima'),
	recipient_region: z.string().min(1, 'Anda harus memasukkan provinsi penerima'),
	recipient_city: z.string().min(1, 'Anda harus memasukkan kota penerima'),
	recipient_address: z.string().min(1, 'Anda harus memasukkan alamat penerima'),
	recipient_zip_code: z.string().min(1, 'Anda harus memasukkan kode pos penerima'),
	recipient_contact: z.string().min(1, 'Anda harus memasukkan nomor telepon/email penerima'),
	recipient_pep_status: z.optional(z.string().or(z.literal(''))),
	recipient_bank_name: z.string().min(1, 'Anda harus memasukkan bank penerima'),
	recipient_bank_code: z.string().min(1, 'Anda harus memasukkan kode bank penerima'),
	recipient_bank_account_no: z.string().min(1, 'Anda harus memasukkan nomor rekening penerima'),
	recipient_bank_account_owner: z.string().min(1, 'Anda harus memasukkan nama pemilik rekening penerima'),
	recipient_notes: z.optional(z.string().or(z.literal(''))),
	recipient_update: z.boolean(),
	transfer_type: z.string().min(1, 'Anda harus memasukkan jenis transfer'),
	payment_method: z.string().min(1, 'Anda harus memasukkan metode pembayaran'),
	transfer_reference: z.string().min(1, 'Anda harus memasukkan referensi transfer'),
	rate: z.string().min(1, 'Anda harus memasukkan rate tukar'),
	fee_percent: z.string().min(1, 'Anda harus memasukkan persentase biaya'),
	fee_fixed: z.string().min(1, 'Anda harus memasukkan jumlah biaya tetap'),
	purpose: z.string().min(1, 'Anda harus memasukkan tujuan transfer'),
	fund_source: z.string().min(1, 'Anda harus memasukkan sumber dana'),
	notes: z.optional(z.string().or(z.literal(''))),
	files: z.array(z.string())
});

export default function NewRemittanceForm() {
	const { control, formState, handleSubmit, getValues, setValue, watch } = useForm<CreateRemittanceFormData>({
		mode: 'onChange',
		resolver: zodResolver(schema),
		defaultValues: {
			from_currency: '',
			from_amount: '',
			to_currency: '',
			to_amount: '',
			sender_id: '',
			sender_type: '',
			sender_name: '',
			sender_gender: '',
			sender_birthdate: '',
			sender_citizenship: '',
			sender_identity_type: '',
			sender_identity_no: '',
			sender_registered_country: '',
			sender_registered_region: '',
			sender_registered_city: '',
			sender_registered_address: '',
			sender_registered_zip_code: '',
			sender_country: '',
			sender_region: '',
			sender_city: '',
			sender_address: '',
			sender_zip_code: '',
			sender_contact: '',
			sender_occupation: '',
			sender_pep_status: '',
			sender_notes: '',
			sender_update: true,
			recipient_id: '',
			recipient_type: '',
			recipient_relationship: '',
			recipient_name: '',
			recipient_country: '',
			recipient_region: '',
			recipient_city: '',
			recipient_address: '',
			recipient_zip_code: '',
			recipient_contact: '',
			recipient_pep_status: '',
			recipient_bank_name: '',
			recipient_bank_code: '',
			recipient_bank_account_no: '',
			recipient_bank_account_owner: '',
			recipient_notes: '',
			recipient_update: true,
			transfer_type: '',
			payment_method: '',
			transfer_reference: '',
			rate: '',
			fee_percent: '',
			fee_fixed: '',
			purpose: '',
			fund_source: '',
			notes: '',
			files: []
		}
	});
	const {
		sender_registered_address,
		sender_registered_city,
		sender_registered_country,
		sender_registered_region,
		sender_registered_zip_code
	} = watch();
	const { isValid, dirtyFields, errors } = formState;
	const { data } = useSession() ?? {};
	const { accessToken } = data ?? {};
	const { data: currenciesData } = apiService.useGetCurrenciesQuery({});
	const currencies = useMemo(() => (currenciesData ?? []) as Currency[], [currenciesData]);
	const dispatch = useAppDispatch();
	const [createRemittance, { isLoading: submitting }] = apiService.useCreateRemittanceMutation();
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
		getValues,
		isSenderDomicileSameAsIdAddress,
		setValue,
		sender_registered_address,
		sender_registered_city,
		sender_registered_country,
		sender_registered_region,
		sender_registered_zip_code
	]);

	async function onSubmit(formData: CreateRemittanceFormData) {
		if (submitting) {
			return;
		}

		const { error } = await createRemittance({
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

		navigate(`/remittances/list`);
	}

	const calculateToAmount = () => {
		const fromAmount = getValues('from_amount') || '0';
		const rateValue = getValues('rate') || '0';
		const feePercentValue = getValues('fee_percent') || '0';
		const feeFixedValue = getValues('fee_fixed') || '0';
		const fAmount = parseFloat(fromAmount);
		const rValue = parseFloat(rateValue);
		const fValue = (parseFloat(feePercentValue) / 100) * fAmount + parseFloat(feeFixedValue);

		if (!isNaN(fAmount) && !isNaN(rValue) && !isNaN(fValue)) {
			return (fAmount - fValue) * rValue;
		}

		return '';
	};

	const calculateFromAmount = () => {
		const toAmount = getValues('to_amount') || '0';
		const rateValue = getValues('rate') || '0';
		const feePercentValue = getValues('fee_percent') || '0';
		const feeFixedValue = getValues('fee_fixed') || '0';
		const tAmount = parseFloat(toAmount);
		const rValue = parseFloat(rateValue);
		const fValue = (parseFloat(feePercentValue) / 100) * (tAmount / rValue) + parseFloat(feeFixedValue);

		if (!isNaN(tAmount) && !isNaN(rValue) && !isNaN(fValue)) {
			return tAmount / rValue + fValue;
		}

		return '';
	};

	const onRateChange = (e: ChangeEvent<HTMLInputElement>) => {
		const rate = e.target.value;
		setValue('rate', rate);

		const toAmount = getValues('to_amount') || '0';
		const fromAmount = getValues('from_amount') || '0';
		const fAmount = parseFloat(fromAmount);
		const tAmount = parseFloat(toAmount);

		if (!isNaN(fAmount) && !isNaN(tAmount)) {
			if (fAmount > 0) {
				const tAmount = calculateToAmount();
				setValue('to_amount', tAmount.toString());
			} else if (tAmount > 0) {
				const fAmount = calculateFromAmount();
				setValue('from_amount', fAmount.toString());
			}
		}
	};

	const onFeeChange = (e: ChangeEvent<HTMLInputElement>) => {
		const fee = e.target.value;
		setValue(e.target.name as keyof CreateRemittanceFormData, fee);

		const toAmount = getValues('to_amount') || '0';
		const fromAmount = getValues('from_amount') || '0';
		const fAmount = parseFloat(fromAmount);
		const tAmount = parseFloat(toAmount);

		if (!isNaN(fAmount) && !isNaN(tAmount)) {
			if (fAmount > 0) {
				const tAmount = calculateToAmount();
				setValue('to_amount', tAmount.toString());
			} else if (tAmount > 0) {
				const fAmount = calculateFromAmount();
				setValue('from_amount', fAmount.toString());
			}
		}
	};

	const selectSenderFromSenderList = () => {
		dispatch(
			openDialog({
				fullWidth: true,
				children: (
					<SenderListDialog
						onSelect={(sender: Sender) => {
							console.log('selected sender', sender);
							setValue('sender_id', sender.id);
							setValue('sender_type', sender.sender_type);
							setValue('sender_name', sender.name);
							setValue('sender_gender', sender?.gender ?? '');
							setValue('sender_birthdate', sender?.birthdate ?? '');
							setValue('sender_citizenship', sender?.citizenship ?? '');
							setValue('sender_identity_type', sender?.identity_type ?? '');
							setValue('sender_identity_no', sender?.identity_no ?? '');
							setValue('sender_occupation', sender?.occupation ?? '');
							setValue('sender_registered_country', sender?.registered_country ?? '');
							setValue('sender_registered_region', sender?.registered_region ?? '');
							setValue('sender_registered_city', sender?.registered_city ?? '');
							setValue('sender_registered_address', sender?.registered_address ?? '');
							setValue('sender_registered_zip_code', sender?.registered_zip_code ?? '');
							setValue('sender_country', sender?.country ?? '');
							setValue('sender_region', sender?.region ?? '');
							setValue('sender_city', sender?.city ?? '');
							setValue('sender_address', sender?.address ?? '');
							setValue('sender_zip_code', sender?.zip_code ?? '');
							setValue('sender_contact', sender?.contact ?? '');
							setValue('sender_pep_status', sender?.pep_status ?? '');
							setValue('sender_notes', sender?.notes ?? '');
						}}
					/>
				)
			})
		);
	};

	const selectBeneficiaryFromContact = () => {
		dispatch(
			openDialog({
				fullWidth: true,
				children: (
					<RecipientListDialog
						onSelect={(recipient: Recipient) => {
							setValue('recipient_id', recipient.id);
							setValue('recipient_type', recipient.recipient_type);
							setValue('recipient_relationship', recipient.relationship);
							setValue('recipient_name', recipient.name);
							setValue('recipient_country', recipient.country);
							setValue('recipient_region', recipient.region);
							setValue('recipient_city', recipient.city);
							setValue('recipient_address', recipient.address);
							setValue('recipient_zip_code', recipient.zip_code);
							setValue('recipient_contact', recipient.contact);
							setValue('recipient_pep_status', recipient.pep_status);
							setValue('recipient_bank_name', recipient.bank_name);
							setValue('recipient_bank_code', recipient.bank_code);
							setValue('recipient_bank_account_no', recipient.bank_account_no);
							setValue('recipient_bank_account_owner', recipient.bank_account_owner);
							setValue('recipient_notes', recipient.notes);
						}}
					/>
				)
			})
		);
	};

	const countryList = CountryCodeList.sort((a, b) => a.name.localeCompare(b.name));

	return (
		<form
			name="remittanceForm"
			noValidate
			className="mt-32 flex w-full flex-col justify-center"
			onSubmit={handleSubmit(onSubmit)}
		>
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
						<div>
							<Button
								variant="text"
								size="small"
								color="primary"
								onClick={(e) => {
									e.preventDefault();
									selectSenderFromSenderList();
								}}
							>
								Pilih dari daftar pengirim
							</Button>
						</div>
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
					<Controller
						name="sender_update"
						control={control}
						render={({ field }) => (
							<FormControl>
								<FormControlLabel
									label="Simpan/perbarui detail pengirim untuk transaksi mendatang"
									control={
										<Checkbox
											size="small"
											{...field}
										/>
									}
								/>
							</FormControl>
						)}
					/>
				</div>
				<div className="w-full p-24 bg-white shadow-2 rounded">
					<div className="mb-24 flex flex-col items-start justify-start gap-12 md:flex-row md:items-center md:justify-between">
						<h4 className="font-bold">Identitas Penerima</h4>
						<div>
							<Button
								variant="text"
								size="small"
								color="primary"
								onClick={(e) => {
									e.preventDefault();
									selectBeneficiaryFromContact();
								}}
							>
								Pilih dari daftar penerima
							</Button>
						</div>
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
					<Controller
						name="recipient_update"
						control={control}
						render={({ field }) => (
							<FormControl>
								<FormControlLabel
									label="Simpan/perbarui detail penerima untuk transaksi mendatang"
									control={
										<Checkbox
											size="small"
											{...field}
										/>
									}
								/>
							</FormControl>
						)}
					/>
				</div>
				<div className="w-full p-24 bg-white shadow-2 rounded">
					<h4 className="mb-24 font-bold">Nominal Pengiriman</h4>
					<div className="flex flex-col gap-12">
						<div className="flex flex-col items-start justify-between gap-12 md:flex-row">
							<Controller
								name="rate"
								control={control}
								render={({ field }) => {
									return (
										<CurrencyField
											{...field}
											label="Rate Tukar"
											error={!!errors.rate}
											helperText={errors?.rate?.message}
											variant="outlined"
											required
											fullWidth
											onChange={onRateChange}
											className="w-full md:w-1/2"
										/>
									);
								}}
							/>
							<div className="w-full md:w-1/2 flex flex-col items-start justify-between gap-12 md:flex-row">
								<Controller
									name="fee_percent"
									control={control}
									render={({ field }) => {
										return (
											<CurrencyField
												{...field}
												label="Biaya Persentase"
												error={!!errors.fee_percent}
												helperText={errors?.fee_percent?.message}
												variant="outlined"
												required
												fullWidth
												onChange={onFeeChange}
											/>
										);
									}}
								/>
								<Controller
									name="fee_fixed"
									control={control}
									render={({ field }) => {
										return (
											<CurrencyField
												{...field}
												label="Biaya Tetap"
												error={!!errors.fee_fixed}
												helperText={errors?.fee_fixed?.message}
												variant="outlined"
												required
												fullWidth
												onChange={onFeeChange}
											/>
										);
									}}
								/>
							</div>
						</div>
						<div className="flex flex-col items-start justify-between gap-12 md:flex-row">
							<Controller
								name="from_currency"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Mata Uang Pengirim"
										error={!!errors.from_currency}
										helperText={errors?.from_currency?.message}
										variant="outlined"
										required
										fullWidth
										select
									>
										{currencies.map((currency) => (
											<MenuItem
												key={`from_currency_${currency.id}`}
												value={currency.id}
											>
												{currency.name} ({currency.symbol})
											</MenuItem>
										))}
									</TextField>
								)}
							/>
							<Controller
								name="from_amount"
								control={control}
								render={({ field: { onChange, ...rest } }) => {
									return (
										<CurrencyField
											{...rest}
											label="Nominal Pengiriman"
											error={!!errors.from_amount}
											helperText={errors?.from_amount?.message}
											variant="outlined"
											required
											fullWidth
											onChange={(e) => {
												onChange(e);
												const toAmount = calculateToAmount();
												setValue('to_amount', toAmount.toString());
											}}
										/>
									);
								}}
							/>
							<Controller
								name="to_currency"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Mata Uang Tujuan"
										error={!!errors.to_currency}
										helperText={errors?.to_currency?.message}
										variant="outlined"
										required
										fullWidth
										select
									>
										{currencies.map((currency) => (
											<MenuItem
												key={`to_currency_${currency.id}`}
												value={currency.id}
											>
												{currency.name} ({currency.symbol})
											</MenuItem>
										))}
									</TextField>
								)}
							/>
							<Controller
								name="to_amount"
								control={control}
								render={({ field: { onChange, ...rest } }) => {
									return (
										<CurrencyField
											{...rest}
											label="Nominal Diterima"
											error={!!errors.to_amount}
											helperText={errors?.to_amount?.message}
											variant="outlined"
											required
											fullWidth
											onChange={(e) => {
												onChange(e);
												const fromAmount = calculateFromAmount();
												setValue('from_amount', fromAmount.toString());
											}}
										/>
									);
								}}
							/>
						</div>
						<Controller
							name="payment_method"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Metode Pembayaran"
									error={!!errors.payment_method}
									helperText={errors?.payment_method?.message}
									variant="outlined"
									required
									fullWidth
									select
								>
									{Object.keys(PaymentMethods).map((key) => (
										<MenuItem
											key={`payment_method_${key}`}
											value={key}
										>
											{PaymentMethods[key as keyof typeof PaymentMethods]}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
					</div>
				</div>
				<div className="w-full p-24 bg-white shadow-2 rounded">
					<h4 className="mb-24 font-bold">Informasi Pengiriman</h4>
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<Controller
							name="transfer_type"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Jenis Pengiriman"
									error={!!errors.transfer_type}
									helperText={errors?.transfer_type?.message}
									variant="outlined"
									required
									fullWidth
									select
								>
									{Object.keys(TransferTypes).map((key) => (
										<MenuItem
											key={`transfer-type-${key}`}
											value={key}
										>
											{TransferTypes[key as keyof typeof TransferTypes]}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
						<Controller
							name="transfer_reference"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Nomor Referensi"
									error={!!errors.transfer_reference}
									helperText={errors?.transfer_reference?.message}
									variant="outlined"
									fullWidth
								/>
							)}
						/>
					</div>
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<Controller
							name="purpose"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Tujuan Pengiriman"
									error={!!errors.purpose}
									helperText={errors?.purpose?.message}
									variant="outlined"
									fullWidth
									select
								>
									{Object.keys(TransferPurposes).map((key) => (
										<MenuItem
											key={`purpose-${key}`}
											value={key}
										>
											{TransferPurposes[key as keyof typeof TransferPurposes]}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
						<Controller
							name="fund_source"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Sumber Dana"
									error={!!errors.fund_source}
									helperText={errors?.fund_source?.message}
									variant="outlined"
									fullWidth
									select
								>
									{Object.keys(FundSources).map((key) => (
										<MenuItem
											key={`fund-source-${key}`}
											value={key}
										>
											{FundSources[key as keyof typeof FundSources]}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
					</div>
					<Controller
						name="notes"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Catatan (opsional)"
								error={!!errors.notes}
								helperText={errors?.notes?.message}
								variant="outlined"
								fullWidth
								multiline
								minRows={3}
								maxRows={6}
								className="mb-12"
							/>
						)}
					/>
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<Controller
							name="files"
							control={control}
							render={({ field }) => (
								<FileUploadBar
									value={field.value}
									onChange={(files) => setValue('files', files)}
								/>
							)}
						/>
					</div>
				</div>
			</div>
			<Button
				variant="contained"
				color="primary"
				className="mt-24 w-full shadow-2"
				aria-label="Submit"
				disabled={_.isEmpty(dirtyFields) || !isValid || submitting}
				type="submit"
				size="large"
			>
				{submitting ? 'Menyimpan...' : 'Simpan'}
			</Button>
		</form>
	);
}
