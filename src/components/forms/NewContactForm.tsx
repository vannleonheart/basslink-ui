import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Alert } from '@mui/material';
import { CreateContactAccountFormData, CreateContactDocumentFormData, CreateContactFormData } from '@/types/form';
import MenuItem from '@mui/material/MenuItem';
import { CountryCodeList } from '@/data/country-code';
import { useSession } from 'next-auth/react';
import NewContactDocument from './parts/NewContactDocument';
import NewContactBankAccount from './parts/NewContactBankAccount';
import apiService from '@/store/apiService';
import { ApiResponse } from '@/types/component';
import { useAppDispatch } from '@/store/hooks';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import useNavigate from '@fuse/hooks/useNavigate';
import { Gender, IdentityTypes, Occupations, UserTypes } from '@/data/static-data';

const schema = z.object({
	contact_type: z.enum(['individual', 'institutional']),
	contact_name: z
		.string()
		.min(3, 'Name should be at least 3 characters long')
		.max(100, 'Name should be at most 100 characters long'),
	contact_gender: z.optional(z.enum(['male', 'female']).or(z.literal(''))),
	contact_birthdate: z.optional(z.string().or(z.literal(''))),
	contact_citizenship: z.string().min(2, 'Citizenship is required'),
	contact_country: z.optional(z.string().or(z.literal(''))),
	contact_region: z.optional(z.string().or(z.literal(''))),
	contact_city: z.optional(z.string().or(z.literal(''))),
	contact_address: z.optional(z.string().or(z.literal(''))),
	contact_email: z.optional(z.string().email('Invalid email address').or(z.literal(''))),
	contact_phone_code: z.optional(z.string().or(z.literal(''))),
	contact_phone_no: z.optional(z.string().or(z.literal(''))),
	contact_occupation: z.optional(z.string().or(z.literal(''))),
	contact_identity_type: z.enum(['national_id', 'passport', 'other']),
	contact_identity_no: z.string().min(3, 'Identity number is required'),
	contact_notes: z.optional(z.string().or(z.literal(''))),
	contact_documents: z.array(
		z.object({
			document_data: z.string().min(2, 'Document data is required'),
			document_type: z.string().min(2, 'Document type is required'),
			notes: z.optional(z.string().or(z.literal(''))),
			is_verified: z.optional(z.boolean())
		})
	),
	contact_accounts: z.array(
		z.object({
			bank_name: z.string().min(2, 'Bank name is required'),
			bank_account_no: z.string().min(2, 'Account number is required'),
			bank_account_name: z.string().min(2, 'Account name is required'),
			bank_country: z.string().min(2, 'Bank country is required'),
			bank_code: z.optional(z.string().or(z.literal(''))),
			bank_swift_code: z.optional(z.string().or(z.literal(''))),
			bank_address: z.optional(z.string().or(z.literal(''))),
			bank_email: z.optional(z.string().email('Invalid email address').or(z.literal(''))),
			bank_phone_code: z.optional(z.string().or(z.literal(''))),
			bank_phone_no: z.optional(z.string().or(z.literal(''))),
			bank_website: z.optional(z.string().url('Invalid URL').or(z.literal(''))),
			bank_notes: z.optional(z.string().or(z.literal('')))
		})
	)
});

export default function NewContactForm() {
	const { control, formState, handleSubmit } = useForm<CreateContactFormData>({
		mode: 'onChange',
		resolver: zodResolver(schema),
		defaultValues: {
			contact_type: '',
			contact_name: '',
			contact_gender: '',
			contact_birthdate: '',
			contact_citizenship: '',
			contact_country: '',
			contact_region: '',
			contact_city: '',
			contact_address: '',
			contact_email: '',
			contact_phone_code: '',
			contact_phone_no: '',
			contact_occupation: '',
			contact_identity_type: '',
			contact_identity_no: '',
			contact_notes: '',
			contact_documents: [
				{
					document_data: '',
					document_type: '',
					notes: '',
					is_verified: false
				}
			] as CreateContactDocumentFormData[],
			contact_accounts: [
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
			] as CreateContactAccountFormData[]
		}
	});
	const { isValid, dirtyFields, errors } = formState;
	const { data } = useSession() ?? {};
	const { accessToken } = data ?? {};
	const [createContact, { isLoading: submitting }] = apiService.useCreateContactMutation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	async function onSubmit(formData: CreateContactFormData) {
		if (submitting) {
			return;
		}

		const { error } = await createContact({
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

		navigate(`/contacts/list`);
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
						<h4 className="font-bold">Contact Information</h4>
					</div>
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<Controller
							name="contact_type"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Contact Type"
									error={!!errors.contact_type}
									helperText={errors?.contact_type?.message}
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
							name="contact_name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Contact Name"
									error={!!errors.contact_name}
									helperText={errors?.contact_name?.message}
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
							name="contact_gender"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Gender"
									error={!!errors.contact_gender}
									helperText={errors?.contact_gender?.message}
									variant="outlined"
									fullWidth
									select
									className="w-full md:w-1/3"
								>
									{Object.entries(Gender).map(([key, value]) => (
										<MenuItem
											key={`gender-${key}`}
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
								name="contact_birthdate"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Birth Date"
										type="date"
										error={!!errors.contact_birthdate}
										helperText={errors?.contact_birthdate?.message}
										variant="outlined"
										required
										fullWidth
									/>
								)}
							/>
							<Controller
								name="contact_citizenship"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Citizenship"
										error={!!errors.contact_citizenship}
										helperText={errors?.contact_citizenship?.message}
										variant="outlined"
										required
										fullWidth
										select
									>
										{countryList.map((country) => (
											<MenuItem
												key={`contact_citizenship_${country.code}`}
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
							name="contact_identity_type"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Identity Type"
									error={!!errors.contact_identity_type}
									helperText={errors?.contact_identity_type?.message}
									variant="outlined"
									required
									fullWidth
									select
									className="w-full md:w-1/3"
								>
									{Object.entries(IdentityTypes).map(([key, value]) => (
										<MenuItem
											key={`identity-type-${key}`}
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
								name="contact_identity_no"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Identity Number"
										error={!!errors.contact_identity_no}
										helperText={errors?.contact_identity_no?.message}
										variant="outlined"
										required
										fullWidth
									/>
								)}
							/>
							<Controller
								name="contact_occupation"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Occupation"
										error={!!errors.contact_occupation}
										helperText={errors?.contact_occupation?.message}
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
							name="contact_country"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Country"
									error={!!errors.contact_country}
									helperText={errors?.contact_country?.message}
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
								name="contact_region"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Region"
										error={!!errors.contact_region}
										helperText={errors?.contact_region?.message}
										variant="outlined"
										fullWidth
									/>
								)}
							/>
							<Controller
								name="contact_city"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="City"
										error={!!errors.contact_city}
										helperText={errors?.contact_city?.message}
										variant="outlined"
										fullWidth
									/>
								)}
							/>
						</div>
					</div>
					<Controller
						name="contact_address"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Address"
								error={!!errors.contact_address}
								helperText={errors?.contact_address?.message}
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
							name="contact_email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Email"
									type="email"
									error={!!errors.contact_email}
									helperText={errors?.contact_email?.message}
									variant="outlined"
									fullWidth
									className="w-full md:w-1/3"
								/>
							)}
						/>
						<div className="w-full md:w-2/3 flex flex-col items-start justify-between gap-12 md:flex-row">
							<Controller
								name="contact_phone_code"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Phone Code"
										type="tel"
										error={!!errors.contact_phone_code}
										helperText={errors?.contact_phone_code?.message}
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
								name="contact_phone_no"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Phone Number"
										type="tel"
										error={!!errors.contact_phone_no}
										helperText={errors?.contact_phone_no?.message}
										variant="outlined"
										fullWidth
									/>
								)}
							/>
						</div>
					</div>
					<Controller
						name="contact_notes"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Notes"
								error={!!errors.contact_notes}
								helperText={errors?.contact_notes?.message}
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
					name="contact_documents"
					control={control}
					render={({ field }) => <NewContactDocument {...field} />}
				/>
				<Controller
					name="contact_accounts"
					control={control}
					render={({ field }) => (
						<NewContactBankAccount
							{...field}
							countryList={countryList}
						/>
					)}
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
				{submitting ? 'Submitting...' : 'Submit'}
			</Button>
		</div>
	);
}
