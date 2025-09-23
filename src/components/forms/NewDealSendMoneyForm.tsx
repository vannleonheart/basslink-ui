import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Alert } from '@mui/material';
import { ClientContact, CreateDealSendMoneyFormData, Currency, Deal } from '@/types';
import { useRouter } from 'next/navigation';
import MenuItem from '@mui/material/MenuItem';
import { CountryCodeList } from '@/data/country-code';
import { clientCreateDealSendMoney, clientUpdateDealSendMoney, clientUploadFiles } from '@/utils/apiCall';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { lighten } from '@mui/material/styles';
import { useAppDispatch } from '@/store/hooks';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import ContactListDialog from '@/app/(control-panel)/deals/ContactListDialog';
import UploadedFileItem from '@/components/forms/fields/UploadedFileItem';
import Divider from '@mui/material/Divider';
import apiService from '@/store/apiService';
import getErrorMessage from '@/data/errors';
import CurrencyField from './fields/CurrencyField';

const schema = z.object({
	from_currency: z.string().min(1, 'You must choose the currency'),
	to_currency: z.string().min(1, 'You must choose the currency'),
	to_amount: z.string().min(1, 'You must enter the amount'),
	receiver_name: z.string().min(1, 'You must enter the name'),
	receiver_country: z.string().min(1, 'You must choose the country'),
	receiver_address: z.string().min(1, 'You must enter the address'),
	receiver_bank_country: z.string().min(1, 'You must choose the country'),
	receiver_bank_name: z.string().min(1, 'You must enter bank name'),
	receiver_bank_account_no: z.string().min(1, 'You must enter account number'),
	receiver_bank_swift_code: z.string().min(1, 'You must enter swift code'),
	receiver_bank_address: z.string().min(1, 'You must enter bank address'),
	purpose: z.string().min(1, 'You must enter the purpose'),
	files: z.array(z.string())
});

const defaultValues = {
	from_currency: '',
	to_currency: '',
	to_amount: '',
	receiver_name: '',
	receiver_country: '',
	receiver_address: '',
	receiver_bank_country: '',
	receiver_bank_address: '',
	receiver_bank_name: '',
	receiver_bank_account_no: '',
	receiver_bank_swift_code: '',
	purpose: '',
	files: [] as string[]
};

function NewDealSendMoneyForm({ deal, fetch }: { deal?: Deal; fetch?: () => void }) {
	const { control, formState, handleSubmit, setError, getValues, setValue } = useForm<CreateDealSendMoneyFormData>({
		mode: 'onChange',
		resolver: zodResolver(schema),
		defaultValues
	});
	const { isValid, dirtyFields, errors } = formState;
	const router = useRouter();
	const { data } = useSession() ?? {};
	const { accessToken } = data ?? {};
	const [submitting, setSubmitting] = useState(false);
	const [uploading, setUploading] = useState(false);
	const dispatch = useAppDispatch();
	const { data: currenciesData, isLoading: currenciesLoading } = apiService.useGetCurrenciesQuery({});
	const currencies = useMemo(() => (currenciesData ?? []) as Currency[], [currenciesData]);

	useEffect(() => {
		if (deal && !currenciesLoading) {
			setValue('receiver_name', deal.receiver_name, { shouldValidate: true });
			setValue('receiver_country', deal.receiver_country, { shouldValidate: true });
			setValue('receiver_address', deal.receiver_address, { shouldValidate: true });
			setValue('receiver_bank_country', deal.receiver_bank_country, { shouldValidate: true });
			setValue('receiver_bank_address', deal.receiver_bank_address, { shouldValidate: true });
			setValue('receiver_bank_name', deal.receiver_bank_name, { shouldValidate: true });
			setValue('receiver_bank_account_no', deal.receiver_bank_account_no, { shouldValidate: true });
			setValue('receiver_bank_swift_code', deal.receiver_bank_swift_code, { shouldValidate: true });
			setValue('from_currency', deal.from_currency, { shouldValidate: true });
			setValue('to_currency', deal.to_currency, { shouldValidate: true });
			setValue('to_amount', `${deal.to_amount}`, { shouldValidate: true });
			setValue('purpose', deal.purpose, { shouldValidate: true });
			setValue(
				'files',
				deal.files.map((file) => file.filename),
				{ shouldValidate: true }
			);
		}
	}, [deal, currenciesLoading]);

	async function onSubmit(formData: CreateDealSendMoneyFormData) {
		try {
			if (submitting) {
				return;
			}

			setSubmitting(true);

			let message = '';

			if (!deal) {
				const result = await clientCreateDealSendMoney(formData, accessToken);

				if (result?.status === 'success') {
					if (fetch) {
						fetch();
					}

					router.push('/deals');
					return;
				}

				message = result?.message;
			} else {
				const result = await clientUpdateDealSendMoney(deal.id, formData, accessToken);

				if (result?.status === 'success') {
					if (fetch) {
						fetch();
					}

					router.push(`/deals/${deal.id}`);
					return;
				}

				message = result?.message;
			}

			setSubmitting(false);
			setError('root', { type: 'manual', message });
			return false;
		} catch (error) {
			const { message, data } = error;

			setSubmitting(false);

			if (!data) {
				setError('root', { type: 'manual', message });
			} else {
				setError('root', { type: 'manual', message: data?.message });
			}

			return false;
		}
	}

	const selectBeneficiaryFromContact = () => {
		dispatch(
			openDialog({
				fullWidth: true,
				children: (
					<ContactListDialog
						onSelect={(contact: ClientContact) => {
							setValue('receiver_name', contact.name ?? '');
							setValue('receiver_country', contact.country ?? '');
							setValue('receiver_address', contact.address ?? '');
							setValue('receiver_bank_country', contact.bank_country ?? '');
							setValue('receiver_bank_address', contact.bank_address ?? '');
							setValue('receiver_bank_swift_code', contact.bank_swift_code ?? '');
							setValue('receiver_bank_name', contact.bank_name ?? '');
							setValue('receiver_bank_account_no', contact.bank_account_no ?? '');
						}}
					/>
				)
			})
		);
	};

	const cryptoCurrencies = currencies.filter((currency) => currency.category === 'crypto' && currency.is_enable);
	const fiatCurrencies = currencies.filter((currency) => currency.category === 'fiat' && currency.is_enable);
	const countryList = CountryCodeList.sort((a, b) => a.name.localeCompare(b.name));

	return (
		<form
			name="loginForm"
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
					<h4 className="mb-24 font-bold">How much are you paying ?</h4>
					<div className="flex flex-col items-start justify-between gap-12 md:gap-24 md:flex-row md:mb-24">
						<div className="w-full flex flex-col items-start justify-center gap-12 md:flex-row">
							<Controller
								name="from_currency"
								control={control}
								render={({ field: { onChange, ...rest } }) => (
									<TextField
										{...rest}
										label="I am paying in"
										className="w-full md:w-1/2"
										autoFocus
										error={!!errors.from_currency}
										helperText={errors?.from_currency?.message}
										variant="outlined"
										onChange={(e) => {
											onChange(e);
										}}
										required
										fullWidth
										select
									>
										{cryptoCurrencies.map((currency) => (
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
								name="to_currency"
								control={control}
								render={({ field: { onChange, ...rest } }) => (
									<TextField
										{...rest}
										label="I want the beneficiary to receive in"
										className="w-full md:w-1/2"
										autoFocus
										onChange={(e) => {
											onChange(e);
										}}
										error={!!errors.to_currency}
										helperText={errors?.to_currency?.message}
										variant="outlined"
										required
										fullWidth
										select
									>
										{fiatCurrencies.map((currency) => (
											<MenuItem
												key={`to_currency_${currency.id}`}
												value={currency.id}
											>
												{currency.name} ({currency.symbol})
											</MenuItem>
										))}
										<Divider />
										{cryptoCurrencies.map((currency) => (
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
								render={({ field }) => {
									return (
										<CurrencyField
											{...field}
											className="w-full md:w-1/2"
											label="The amount to be received"
											autoFocus
											error={!!errors.to_amount}
											helperText={errors?.to_amount?.message}
											variant="outlined"
											required
											fullWidth
										/>
									);
								}}
							/>
						</div>
					</div>
				</div>
				<div className="w-full p-24 bg-white shadow-2 rounded">
					<div className="mb-24 flex flex-col items-start justify-start gap-12 md:flex-row md:items-center md:justify-between">
						<h4 className="font-bold">Who are you paying to ?</h4>
						<div>
							<a
								href="#"
								onClick={(e) => {
									e.preventDefault();
									selectBeneficiaryFromContact();
								}}
							>
								Select from my contact
							</a>
						</div>
					</div>
					<div className="flex flex-col items-start justify-between gap-12 md:gap-24 md:flex-row mb-12 md:mb-24">
						<Controller
							name="receiver_name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Beneficiary name"
									autoFocus
									type="text"
									error={!!errors.receiver_name}
									helperText={errors?.receiver_name?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
					</div>
					<div className="flex flex-col items-start justify-between gap-12 md:gap-24 md:flex-row mb-12 md:mb-24">
						<Controller
							name="receiver_country"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Country"
									className="md:w-2/5"
									autoFocus
									error={!!errors.receiver_country}
									helperText={errors?.receiver_country?.message}
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
							name="receiver_address"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Address"
									className="md:w-3/5"
									autoFocus
									type="text"
									error={!!errors.receiver_address}
									helperText={errors?.receiver_address?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
					</div>
				</div>
				<div className="w-full p-24 bg-white shadow-2 rounded">
					<div className="mb-24 flex flex-col items-start justify-start gap-12 md:flex-row md:items-center md:justify-between">
						<h4 className="font-bold">To which account the payment will be made ?</h4>
					</div>
					<div className="flex flex-col items-start justify-between gap-12 md:gap-24 md:flex-row mb-12 md:mb-24">
						<Controller
							name="receiver_bank_name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Beneficiary Bank name"
									autoFocus
									type="text"
									error={!!errors.receiver_bank_name}
									helperText={errors?.receiver_bank_name?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
						<Controller
							name="receiver_bank_account_no"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Bank account number (IBAN)"
									autoFocus
									type="text"
									error={!!errors.receiver_bank_account_no}
									helperText={errors?.receiver_bank_account_no?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
					</div>
					<div className="flex flex-col items-start justify-between gap-12 md:gap-24 md:flex-row mb-12 md:mb-24">
						<Controller
							name="receiver_bank_country"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Bank country"
									autoFocus
									error={!!errors.receiver_bank_country}
									helperText={errors?.receiver_bank_country?.message}
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
							name="receiver_bank_swift_code"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Bank SWIFT code"
									autoFocus
									type="text"
									error={!!errors.receiver_bank_swift_code}
									helperText={errors?.receiver_bank_swift_code?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
					</div>
					<div className="flex flex-col items-start justify-between gap-12 md:gap-24 md:flex-row mb-12 md:mb-24">
						<Controller
							name="receiver_bank_address"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Bank address"
									autoFocus
									type="text"
									error={!!errors.receiver_bank_address}
									helperText={errors?.receiver_bank_address?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
					</div>
				</div>
				<div className="w-full p-24 bg-white shadow-2 rounded">
					<h4 className="mb-24 font-bold">Tell us more about the payment</h4>
					<div className="flex flex-col items-start justify-between gap-12 md:gap-24 md:flex-row mb-12 md:mb-24">
						<Controller
							name="purpose"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Purpose of Transfer"
									autoFocus
									type="text"
									error={!!errors.purpose}
									helperText={errors?.purpose?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
					</div>
					<div className="flex flex-col items-start justify-between gap-12 md:gap-24 md:flex-row">
						<Controller
							name="files"
							control={control}
							render={({ field: { onChange } }) => (
								<div className="w-full flex flex-col">
									<div className="grid grid-cols-2 gap-12 mb-12">
										{getValues('files').map((file, index) => {
											return (
												<UploadedFileItem
													key={`file_${index}`}
													filename={file}
													onRemove={() => {
														const newFiles = getValues('files').filter(
															(_, i) => i !== index
														);
														setValue('files', newFiles);
													}}
												/>
											);
										})}
									</div>
									<Box
										sx={(theme) => ({
											backgroundColor: lighten(theme.palette.background.default, 0.02),
											...theme.applyStyles('light', {
												backgroundColor: lighten(theme.palette.background.default, 0.2)
											})
										})}
										component="label"
										htmlFor="button-file"
										className="productImageUpload flex items-center justify-center relative w-full h-128 rounded-lg mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
									>
										<input
											className="hidden"
											id="button-file"
											type="file"
											multiple
											onChange={async (e) => {
												function readFileAsync() {
													setUploading(true);

													return new Promise<void>((resolve, reject) => {
														const files = e?.target?.files;

														if (!files || !files.length) {
															return reject('No file selected');
														}

														clientUploadFiles(Array.from(files), accessToken)
															.then((result) => {
																if (result.status === 'success') {
																	const prevFiles = getValues('files');
																	const uploadedFiles = result?.data as {
																		files: string[];
																	};
																	const newFiles = [
																		...prevFiles,
																		...uploadedFiles.files
																	];

																	onChange(newFiles);

																	return resolve();
																} else {
																	return reject(result.message);
																}
															})
															.catch(reject)
															.finally(() => {
																setUploading(false);
															});
													});
												}

												try {
													await readFileAsync();
												} catch (error) {
													setError('root', {
														type: 'manual',
														message: getErrorMessage(error?.data?.message ?? error?.message)
													});
												}
											}}
										/>
										<div className="flex flex-col items-center gap-4">
											<FuseSvgIcon
												size={32}
												color="action"
											>
												heroicons-outline:arrow-up-on-square
											</FuseSvgIcon>
											Upload Files
										</div>
									</Box>
								</div>
							)}
						/>
					</div>
				</div>
			</div>
			<Button
				variant="contained"
				color="secondary"
				className="mt-24 w-full shadow-2"
				aria-label="Submit"
				disabled={_.isEmpty(dirtyFields) || !isValid || submitting || uploading}
				type="submit"
				size="large"
			>
				{submitting ? 'Submitting...' : 'Submit'}
			</Button>
		</form>
	);
}

export default NewDealSendMoneyForm;
