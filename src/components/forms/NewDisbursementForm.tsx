import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Alert, Checkbox, FormControl, FormControlLabel } from '@mui/material';
import { Contact, ContactAccount, Currency, User } from '@/types/entity';
import MenuItem from '@mui/material/MenuItem';
import { CountryCodeList } from '@/data/country-code';
import { useSession } from 'next-auth/react';
import { ChangeEvent, useMemo } from 'react';
import apiService from '@/store/apiService';
import CurrencyField from './fields/CurrencyField';
import { useAppDispatch } from '@/store/hooks';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { CreateDisbursementFormData } from '@/types/form';
import ContactListDialog from '../dialogs/ContactListDialog';
import useNavigate from '@fuse/hooks/useNavigate';
import { ApiResponse } from '@/types/component';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import {
	FundSources,
	Gender,
	IdentityTypes,
	Occupations,
	RelationshipTypes,
	TransferPurposes,
	TransferTypes,
	UserTypes
} from '@/data/static-data';
import UserListDialog from '../dialogs/UserListDialog';
import ContactBankAccountListDialog from '../dialogs/ContactBankAccountListDialog';
import FileUploadBar from './fields/FileUploadBar';

const schema = z.object({
	from_currency: z.string().min(1, 'Pilih mata uang pengiriman'),
	from_amount: z.string().min(1, 'Lengkapi nominal pengiriman'),
	to_currency: z.string().min(1, 'Pilih mata uang tujuan'),
	to_amount: z.string().min(1, 'Lengkapi nominal tujuan'),
	from_customer: z.optional(z.string().or(z.literal(''))),
	customer_type: z.string().min(1, 'Anda harus memasukkan jenis pengirim'),
	customer_name: z.string().min(1, 'Anda harus memasukkan nama pengirim'),
	customer_gender: z.optional(z.string().or(z.literal(''))),
	customer_birthdate: z.optional(z.string().or(z.literal(''))),
	customer_citizenship: z.string().min(1, 'Anda harus memasukkan kewarganegaraan pengirim'),
	customer_identity_type: z.string().min(1, 'Anda harus memasukkan jenis identitas pengirim'),
	customer_identity_no: z.string().min(1, 'Anda harus memasukkan nomor identitas pengirim'),
	customer_occupation: z.optional(z.string().or(z.literal(''))),
	customer_country: z.string().min(1, 'Anda harus memasukkan negara pengirim'),
	customer_region: z.optional(z.string().or(z.literal(''))),
	customer_city: z.optional(z.string().or(z.literal(''))),
	customer_address: z.string().min(1, 'Anda harus memasukkan alamat pengirim'),
	customer_email: z.optional(z.string().email('Email pengirim tidak valid').or(z.literal(''))),
	customer_phone_code: z.optional(z.string().or(z.literal(''))),
	customer_phone_no: z.optional(z.string().or(z.literal(''))),
	customer_notes: z.optional(z.string().or(z.literal(''))),
	to_contact: z.optional(z.string().or(z.literal(''))),
	beneficiary_type: z.string().min(1, 'Anda harus memasukkan jenis penerima'),
	beneficiary_name: z.string().min(1, 'Anda harus memasukkan nama penerima'),
	beneficiary_gender: z.optional(z.string().or(z.literal(''))),
	beneficiary_birthdate: z.optional(z.string().or(z.literal(''))),
	beneficiary_citizenship: z.string().min(1, 'Anda harus memasukkan kewarganegaraan penerima'),
	beneficiary_identity_type: z.string().min(1, 'Anda harus memasukkan jenis identitas penerima'),
	beneficiary_identity_no: z.string().min(1, 'Anda harus memasukkan nomor identitas penerima'),
	beneficiary_occupation: z.optional(z.string().or(z.literal(''))),
	beneficiary_country: z.string().min(1, 'Anda harus memasukkan negara penerima'),
	beneficiary_region: z.optional(z.string().or(z.literal(''))),
	beneficiary_city: z.optional(z.string().or(z.literal(''))),
	beneficiary_address: z.string().min(1, 'Anda harus memasukkan alamat penerima'),
	beneficiary_email: z.optional(z.string().email('Email penerima tidak valid').or(z.literal(''))),
	beneficiary_phone_code: z.optional(z.string().or(z.literal(''))),
	beneficiary_phone_no: z.optional(z.string().or(z.literal(''))),
	beneficiary_notes: z.optional(z.string().or(z.literal(''))),
	beneficiary_relationship: z.optional(z.string().or(z.literal(''))),
	to_account: z.optional(z.string().or(z.literal(''))),
	bank_name: z.string().min(1, 'Anda harus memasukkan nama bank'),
	bank_account_no: z.string().min(1, 'Anda harus memasukkan nomor rekening'),
	bank_account_name: z.string().min(1, 'Anda harus memasukkan nama pemilik rekening'),
	bank_country: z.string().min(1, 'Anda harus memasukkan negara bank'),
	bank_swift_code: z.optional(z.string().or(z.literal(''))),
	bank_code: z.optional(z.string().or(z.literal(''))),
	bank_address: z.optional(z.string().or(z.literal(''))),
	bank_email: z.optional(z.string().email('Email bank tidak valid').or(z.literal(''))),
	bank_phone_code: z.optional(z.string().or(z.literal(''))),
	bank_phone_no: z.optional(z.string().or(z.literal(''))),
	bank_website: z.optional(z.string().or(z.literal(''))),
	bank_notes: z.optional(z.string().or(z.literal(''))),
	transfer_type: z.optional(z.string().or(z.literal(''))),
	transfer_date: z.optional(z.string().or(z.literal(''))),
	transfer_reference: z.optional(z.string().or(z.literal(''))),
	rate: z.string().min(1, 'Anda harus memasukkan rate tukar'),
	fee_percent: z.string().min(1, 'Anda harus memasukkan persentase biaya'),
	fee_fixed: z.string().min(1, 'Anda harus memasukkan jumlah biaya tetap'),
	fund_source: z.optional(z.string().or(z.literal(''))),
	purpose: z.optional(z.string().or(z.literal(''))),
	notes: z.optional(z.string().or(z.literal(''))),
	files: z.array(z.string())
});

export default function NewDisbursementForm() {
	const { control, formState, handleSubmit, getValues, setValue } = useForm<CreateDisbursementFormData>({
		mode: 'onChange',
		resolver: zodResolver(schema),
		defaultValues: {
			from_currency: '',
			from_amount: '',
			to_currency: '',
			to_amount: '',
			from_customer: '',
			customer_type: '',
			customer_name: '',
			customer_gender: '',
			customer_birthdate: '',
			customer_citizenship: '',
			customer_identity_type: '',
			customer_identity_no: '',
			customer_occupation: '',
			customer_country: '',
			customer_region: '',
			customer_city: '',
			customer_address: '',
			customer_email: '',
			customer_phone_code: '',
			customer_phone_no: '',
			customer_notes: '',
			to_contact: '',
			beneficiary_type: '',
			beneficiary_name: '',
			beneficiary_gender: '',
			beneficiary_birthdate: '',
			beneficiary_citizenship: '',
			beneficiary_identity_type: '',
			beneficiary_identity_no: '',
			beneficiary_occupation: '',
			beneficiary_country: '',
			beneficiary_region: '',
			beneficiary_city: '',
			beneficiary_address: '',
			beneficiary_email: '',
			beneficiary_phone_code: '',
			beneficiary_phone_no: '',
			beneficiary_notes: '',
			beneficiary_relationship: '',
			to_account: '',
			bank_name: '',
			bank_account_no: '',
			bank_account_name: '',
			bank_country: '',
			bank_swift_code: '',
			bank_code: '',
			bank_address: '',
			bank_email: '',
			bank_phone_code: '',
			bank_phone_no: '',
			bank_website: '',
			bank_notes: '',
			bank_update: false,
			transfer_type: '',
			transfer_date: '',
			transfer_reference: '',
			rate: '',
			fee_percent: '',
			fee_fixed: '',
			fund_source: '',
			notes: '',
			purpose: '',
			files: [] as string[],
			beneficiary_update: false
		}
	});
	const { isValid, dirtyFields, errors } = formState;
	const { data } = useSession() ?? {};
	const { accessToken } = data ?? {};
	const { data: currenciesData } = apiService.useGetCurrenciesQuery({});
	const currencies = useMemo(() => (currenciesData ?? []) as Currency[], [currenciesData]);
	const dispatch = useAppDispatch();
	const [createDisbursement, { isLoading: submitting }] = apiService.useCreateDisbursementMutation();
	const navigate = useNavigate();

	async function onSubmit(formData: CreateDisbursementFormData) {
		if (submitting) {
			return;
		}

		const { error } = await createDisbursement({
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

		navigate(`/disbursements/list`);
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
		setValue(e.target.name as keyof CreateDisbursementFormData, fee);

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

	const selectCustomerFromUserList = () => {
		dispatch(
			openDialog({
				fullWidth: true,
				children: (
					<UserListDialog
						onSelect={(user: User) => {
							setValue('from_customer', user.id);
							setValue('customer_type', user.user_type);
							setValue('customer_name', user.name);
							setValue('customer_gender', user?.gender ?? '');
							setValue('customer_birthdate', user?.birthdate ?? '');
							setValue('customer_citizenship', user?.citizenship ?? '');
							setValue('customer_identity_type', user?.identity_type ?? '');
							setValue('customer_identity_no', user?.identity_no ?? '');
							setValue('customer_occupation', user?.occupation ?? '');
							setValue('customer_country', user?.country ?? '');
							setValue('customer_region', user?.region ?? '');
							setValue('customer_city', user?.city ?? '');
							setValue('customer_address', user?.address ?? '');
							setValue('customer_email', user?.email ?? '');
							setValue('customer_phone_code', user?.phone_code ? `+${user.phone_code}` : '');
							setValue('customer_phone_no', user?.phone_no ?? '');
							setValue('customer_notes', user?.notes ?? '');
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
					<ContactListDialog
						onSelect={(contact: Contact) => {
							setValue('to_contact', contact.id);
							setValue('beneficiary_type', contact.contact_type);
							setValue('beneficiary_name', contact.name);
							setValue('beneficiary_gender', contact.gender);
							setValue('beneficiary_birthdate', contact.birthdate);
							setValue('beneficiary_citizenship', contact.citizenship);
							setValue('beneficiary_identity_type', contact.identity_type);
							setValue('beneficiary_identity_no', contact.identity_no);
							setValue('beneficiary_occupation', contact.occupation);
							setValue('beneficiary_country', contact.country);
							setValue('beneficiary_region', contact.region);
							setValue('beneficiary_city', contact.city);
							setValue('beneficiary_address', contact.address);
							setValue('beneficiary_email', contact.email);
							setValue('beneficiary_phone_code', contact.phone_code ? `+${contact.phone_code}` : '');
							setValue('beneficiary_phone_no', contact.phone_no);
							setValue('beneficiary_notes', contact.notes);
						}}
					/>
				)
			})
		);
	};

	const selectAccountFromContactAccounts = (id: string) => {
		dispatch(
			openDialog({
				fullWidth: true,
				children: (
					<ContactBankAccountListDialog
						id={id}
						onSelect={(account: ContactAccount) => {
							setValue('to_account', account.id);
							setValue('bank_name', account.bank_name);
							setValue('bank_account_no', account.no);
							setValue('bank_account_name', account.owner_name);
							setValue('bank_country', account.country);
							setValue('bank_swift_code', account.bank_swift);
							setValue('bank_code', account.bank_code);
							setValue('bank_address', account.address);
							setValue('bank_email', account.email);
							setValue('bank_phone_code', account.phone_code ? `+${account.phone_code}` : '');
							setValue('bank_phone_no', account.phone_no);
							setValue('bank_website', account.website);
							setValue('bank_notes', account.notes);
						}}
					/>
				)
			})
		);
	};

	const countryList = CountryCodeList.sort((a, b) => a.name.localeCompare(b.name));

	return (
		<form
			name="disbursementForm"
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
									selectCustomerFromUserList();
								}}
							>
								Pilih dari daftar pengirim
							</Button>
						</div>
					</div>
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<Controller
							name="customer_type"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									autoFocus
									label="Jenis Pengirim"
									error={!!errors.customer_type}
									helperText={errors?.customer_type?.message}
									variant="outlined"
									required
									fullWidth
									select
									className="w-full md:w-1/3"
								>
									{Object.keys(UserTypes).map((key) => (
										<MenuItem
											key={`customer-type-${key}`}
											value={key}
										>
											{UserTypes[key as keyof typeof UserTypes]}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
						<Controller
							name="customer_name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Nama Pengirim"
									error={!!errors.customer_name}
									helperText={errors?.customer_name?.message}
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
							name="customer_gender"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Jenis Kelamin"
									error={!!errors.customer_gender}
									helperText={errors?.customer_gender?.message}
									variant="outlined"
									required
									fullWidth
									select
									className="w-full md:w-1/3"
								>
									{Object.entries(Gender).map(([key, value]) => (
										<MenuItem
											key={`customer-gender-${key}`}
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
								name="customer_birthdate"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Tanggal Lahir"
										type="date"
										error={!!errors.customer_birthdate}
										helperText={errors?.customer_birthdate?.message}
										variant="outlined"
										required
										fullWidth
									/>
								)}
							/>
							<Controller
								name="customer_citizenship"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Kewarganegaraan"
										error={!!errors.customer_citizenship}
										helperText={errors?.customer_citizenship?.message}
										variant="outlined"
										required
										fullWidth
										select
									>
										{countryList.map((country) => (
											<MenuItem
												key={`customer_citizenship_${country.code}`}
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
							name="customer_identity_type"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Jenis Identitas"
									error={!!errors.customer_identity_type}
									helperText={errors?.customer_identity_type?.message}
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
								name="customer_identity_no"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Nomor Identitas"
										error={!!errors.customer_identity_no}
										helperText={errors?.customer_identity_no?.message}
										variant="outlined"
										required
										fullWidth
									/>
								)}
							/>
							<Controller
								name="customer_occupation"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Pekerjaan"
										error={!!errors.customer_occupation}
										helperText={errors?.customer_occupation?.message}
										variant="outlined"
										fullWidth
										select
									>
										{Object.entries(Occupations).map(([key, value]) => (
											<MenuItem
												key={`occupation-${key}`}
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
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<Controller
							name="customer_country"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Negara"
									error={!!errors.customer_country}
									helperText={errors?.customer_country?.message}
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
								name="customer_region"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Provinsi"
										error={!!errors.customer_region}
										helperText={errors?.customer_region?.message}
										variant="outlined"
										fullWidth
									/>
								)}
							/>
							<Controller
								name="customer_city"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Kota"
										error={!!errors.customer_city}
										helperText={errors?.customer_city?.message}
										variant="outlined"
										fullWidth
									/>
								)}
							/>
						</div>
					</div>
					<Controller
						name="customer_address"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Alamat"
								error={!!errors.customer_address}
								helperText={errors?.customer_address?.message}
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
							name="customer_email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Email"
									type="email"
									error={!!errors.customer_email}
									helperText={errors?.customer_email?.message}
									variant="outlined"
									fullWidth
									className="w-full md:w-1/3"
								/>
							)}
						/>
						<div className="w-full md:w-2/3 flex flex-col items-start justify-between gap-12 md:flex-row">
							<Controller
								name="customer_phone_code"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Kode Telepon"
										type="tel"
										error={!!errors.customer_phone_code}
										helperText={errors?.customer_phone_code?.message}
										variant="outlined"
										fullWidth
										select
									>
										{countryList.map((country) => (
											<MenuItem
												key={`customer_phone_code_${country.code}`}
												value={country.dial_code}
											>
												{country.name} ({country.dial_code})
											</MenuItem>
										))}
									</TextField>
								)}
							/>
							<Controller
								name="customer_phone_no"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Nomor Telepon"
										type="tel"
										error={!!errors.customer_phone_no}
										helperText={errors?.customer_phone_no?.message}
										variant="outlined"
										fullWidth
									/>
								)}
							/>
						</div>
					</div>
					<Controller
						name="customer_notes"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Catatan"
								error={!!errors.customer_notes}
								helperText={errors?.customer_notes?.message}
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
						name="customer_update"
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
					</div>
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
							name="beneficiary_type"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Jenis Penerima"
									error={!!errors.beneficiary_type}
									helperText={errors?.beneficiary_type?.message}
									variant="outlined"
									required
									fullWidth
									select
								>
									{Object.keys(UserTypes).map((key) => (
										<MenuItem
											key={`beneficiary-type-${key}`}
											value={key}
										>
											{UserTypes[key as keyof typeof UserTypes]}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
						<Controller
							name="beneficiary_name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Nama Penerima"
									error={!!errors.beneficiary_name}
									helperText={errors?.beneficiary_name?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
						<Controller
							name="beneficiary_relationship"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Hubungan"
									error={!!errors.beneficiary_relationship}
									helperText={errors?.beneficiary_relationship?.message}
									variant="outlined"
									required
									fullWidth
									select
								>
									{Object.keys(RelationshipTypes).map((key) => (
										<MenuItem
											key={`beneficiary-relationship-${key}`}
											value={key}
										>
											{RelationshipTypes[key as keyof typeof RelationshipTypes]}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
					</div>
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<Controller
							name="beneficiary_gender"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Jenis Kelamin"
									error={!!errors.beneficiary_gender}
									helperText={errors?.beneficiary_gender?.message}
									variant="outlined"
									required
									fullWidth
									select
								>
									{Object.entries(Gender).map(([key, value]) => (
										<MenuItem
											key={`beneficiary-gender-${key}`}
											value={key}
										>
											{value}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
						<Controller
							name="beneficiary_birthdate"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Tanggal Lahir"
									type="date"
									error={!!errors.beneficiary_birthdate}
									helperText={errors?.beneficiary_birthdate?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
						<Controller
							name="beneficiary_citizenship"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Kewarganegaraan"
									error={!!errors.beneficiary_citizenship}
									helperText={errors?.beneficiary_citizenship?.message}
									variant="outlined"
									required
									fullWidth
									select
								>
									{countryList.map((country) => (
										<MenuItem
											key={`beneficiary_citizenship_${country.code}`}
											value={country.code}
										>
											{country.name}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
					</div>
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<Controller
							name="beneficiary_identity_type"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Jenis Identitas"
									error={!!errors.beneficiary_identity_type}
									helperText={errors?.beneficiary_identity_type?.message}
									variant="outlined"
									required
									fullWidth
									select
								>
									{Object.entries(IdentityTypes).map(([key, value]) => (
										<MenuItem
											key={`beneficiary-identity-type-${key}`}
											value={key}
										>
											{value}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
						<Controller
							name="beneficiary_identity_no"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Nomor Identitas"
									error={!!errors.beneficiary_identity_no}
									helperText={errors?.beneficiary_identity_no?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
						<Controller
							name="beneficiary_occupation"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Pekerjaan"
									error={!!errors.beneficiary_occupation}
									helperText={errors?.beneficiary_occupation?.message}
									variant="outlined"
									fullWidth
									select
								>
									{Object.entries(Occupations).map(([key, value]) => (
										<MenuItem
											key={`beneficiary-occupation-${key}`}
											value={key}
										>
											{value}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
					</div>
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<Controller
							name="beneficiary_country"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Negara"
									error={!!errors.beneficiary_country}
									helperText={errors?.beneficiary_country?.message}
									variant="outlined"
									required
									fullWidth
									select
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
						<Controller
							name="beneficiary_region"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Provinsi"
									error={!!errors.beneficiary_region}
									helperText={errors?.beneficiary_region?.message}
									variant="outlined"
									fullWidth
								/>
							)}
						/>
						<Controller
							name="beneficiary_city"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Kota"
									error={!!errors.beneficiary_city}
									helperText={errors?.beneficiary_city?.message}
									variant="outlined"
									fullWidth
								/>
							)}
						/>
					</div>
					<Controller
						name="beneficiary_address"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Alamat"
								error={!!errors.beneficiary_address}
								helperText={errors?.beneficiary_address?.message}
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
							name="beneficiary_email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Email"
									type="email"
									error={!!errors.beneficiary_email}
									helperText={errors?.beneficiary_email?.message}
									variant="outlined"
									fullWidth
								/>
							)}
						/>
						<Controller
							name="beneficiary_phone_code"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Kode Telepon"
									type="tel"
									error={!!errors.beneficiary_phone_code}
									helperText={errors?.beneficiary_phone_code?.message}
									variant="outlined"
									fullWidth
									select
								>
									{countryList.map((country) => (
										<MenuItem
											key={`beneficiary_phone_code${country.code}`}
											value={country.dial_code}
										>
											{country.name} ({country.dial_code})
										</MenuItem>
									))}
								</TextField>
							)}
						/>
						<Controller
							name="beneficiary_phone_no"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Nomor Telepon"
									type="tel"
									error={!!errors.beneficiary_phone_no}
									helperText={errors?.beneficiary_phone_no?.message}
									variant="outlined"
									fullWidth
								/>
							)}
						/>
					</div>
					<Controller
						name="beneficiary_notes"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Catatan"
								error={!!errors.beneficiary_notes}
								helperText={errors?.beneficiary_notes?.message}
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
						name="beneficiary_update"
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
					<div className="mb-24 flex flex-col items-start justify-start gap-12 md:flex-row md:items-center md:justify-between">
						<h4 className="font-bold">Rekening Tujuan</h4>
						<div>
							<Button
								variant="text"
								size="small"
								color="primary"
								onClick={(e) => {
									e.preventDefault();
									selectAccountFromContactAccounts(getValues('to_contact'));
								}}
							>
								Pilih dari rekening penerima
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
									label="Pemilik Rekening"
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
									label="Kode Bank"
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
									label="Kode SWIFT"
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
											key={`bank_phone_code${country.code}`}
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
					<Controller
						name="bank_update"
						control={control}
						render={({ field }) => (
							<FormControl>
								<FormControlLabel
									label="Simpan/update detail bank untuk transaksi mendatang"
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
							name="transfer_date"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Tanggal Pengiriman"
									type="date"
									error={!!errors.transfer_date}
									helperText={errors?.transfer_date?.message}
									variant="outlined"
									fullWidth
								/>
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
