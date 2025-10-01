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
import { CreateContactDocumentFormData, CreateCustomerFormData } from '@/types/form';
import apiService from '@/store/apiService';
import { useAppDispatch } from '@/store/hooks';
import useNavigate from '@fuse/hooks/useNavigate';
import { ApiResponse } from '@/types/component';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import NewCustomerDocument from './parts/NewCustomerDocument';
import PasswordField from './fields/PasswordField';
import { Gender, IdentityTypes, Occupations, UserTypes } from '@/data/static-data';
import { User } from '@/types/entity';

const schema = z.object({
	customer_type: z.enum(['individual', 'institution'], { message: 'Invalid contact type' }),
	customer_name: z
		.string()
		.min(3, 'Name should be at least 3 characters long')
		.max(100, 'Name should be at most 100 characters long'),
	customer_gender: z.optional(z.enum(['male', 'female']).or(z.literal(''))),
	customer_birthdate: z.optional(z.string().or(z.literal(''))),
	customer_citizenship: z.string().min(2, 'Citizenship is required'),
	customer_country: z.optional(z.string().or(z.literal(''))),
	customer_region: z.optional(z.string().or(z.literal(''))),
	customer_city: z.optional(z.string().or(z.literal(''))),
	customer_address: z.optional(z.string().or(z.literal(''))),
	customer_email: z.optional(z.string().email('Invalid email address').or(z.literal(''))),
	customer_phone_code: z.optional(z.string().or(z.literal(''))),
	customer_phone_no: z.optional(z.string().or(z.literal(''))),
	customer_occupation: z.optional(z.string().or(z.literal(''))),
	customer_identity_type: z.enum(['national_id', 'passport', 'other']),
	customer_identity_no: z.string().min(3, 'Identity number is required'),
	customer_notes: z.optional(z.string().or(z.literal(''))),
	customer_documents: z.array(
		z.object({
			id: z.optional(z.string().or(z.literal(''))),
			document_data: z.string().min(2, 'Document data is required'),
			document_type: z.string().min(2, 'Document type is required'),
			notes: z.optional(z.string().or(z.literal(''))),
			is_verified: z.optional(z.boolean())
		})
	),
	username: z.optional(z.string().min(5, 'Username should be at least 5 characters long').or(z.literal(''))),
	password: z.optional(z.string().min(8, 'Password should be at least 8 characters long').or(z.literal(''))),
	password_confirmation: z.optional(
		z.string().min(8, 'Password confirmation should be at least 8 characters long').or(z.literal(''))
	)
});

type NewCustomerFormProps = {
	customer?: User;
};

export default function NewCustomerForm({ customer }: NewCustomerFormProps) {
	const { control, formState, handleSubmit } = useForm<CreateCustomerFormData>({
		mode: 'onChange',
		resolver: zodResolver(schema),
		defaultValues: {
			customer_type: customer?.user_type ?? '',
			customer_name: customer?.name ?? '',
			customer_gender: customer?.gender ?? '',
			customer_birthdate: customer?.birthdate ?? '',
			customer_citizenship: customer?.citizenship ?? '',
			customer_country: customer?.country ?? '',
			customer_region: customer?.region ?? '',
			customer_city: customer?.city ?? '',
			customer_address: customer?.address ?? '',
			customer_email: customer?.email ?? '',
			customer_phone_code: customer?.phone_code ? `+${customer.phone_code}` : '',
			customer_phone_no: customer?.phone_no ?? '',
			customer_occupation: customer?.occupation ?? '',
			customer_identity_type: customer?.identity_type ?? 'national_id',
			customer_identity_no: customer?.identity_no ?? '',
			customer_notes: customer?.notes ?? '',
			customer_documents: [
				{
					id: '',
					document_data: '',
					document_type: '',
					notes: '',
					is_verified: false
				}
			] as CreateContactDocumentFormData[],
			username: '',
			password: '',
			password_confirmation: ''
		}
	});
	const { isValid, dirtyFields, errors } = formState;
	const { data } = useSession() ?? {};
	const { accessToken } = data ?? {};
	const [createCustomer, { isLoading: submitting }] = apiService.useCreateCustomerMutation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	async function onSubmit(formData: CreateCustomerFormData) {
		if (submitting) {
			return;
		}

		const { error } = await createCustomer({
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

		navigate(`/customers/list`);
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
						<h4 className="font-bold">Customer Information</h4>
					</div>
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<Controller
							name="customer_type"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Customer Type"
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
							name="customer_name"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Customer Name"
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
									label="Gender"
									error={!!errors.customer_gender}
									helperText={errors?.customer_gender?.message}
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
								name="customer_birthdate"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Birth Date"
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
										label="Citizenship"
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
									label="Identity Type"
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
								name="customer_identity_no"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Identity Number"
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
										label="Occupation"
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
									label="Country"
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
										label="Region"
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
										label="City"
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
								label="Address"
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
										label="Phone Code"
										type="tel"
										error={!!errors.customer_phone_code}
										helperText={errors?.customer_phone_code?.message}
										variant="outlined"
										fullWidth
										select
									>
										{countryList.map((country) => (
											<MenuItem
												key={`customer_phone_code${country.code}`}
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
										label="Phone Number"
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
								label="Notes"
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
				</div>
				<Controller
					name="customer_documents"
					control={control}
					render={({ field }) => <NewCustomerDocument {...field} />}
				/>
				<div className="w-full p-24 bg-white shadow-2 rounded">
					<div className="mb-24 flex flex-col items-start justify-start gap-12 md:flex-row md:items-center md:justify-between">
						<h4 className="font-bold">Account Information</h4>
					</div>
					<Controller
						name="username"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Username"
								error={!!errors.username}
								helperText={errors?.username?.message}
								variant="outlined"
								required
								fullWidth
								className="mb-12"
							/>
						)}
					/>
					<div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
						<Controller
							name="password"
							control={control}
							render={({ field }) => (
								<PasswordField
									{...field}
									label="Password"
									error={!!errors.password}
									helperText={errors?.password?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
						<Controller
							name="password_confirmation"
							control={control}
							render={({ field }) => (
								<PasswordField
									{...field}
									label="Confirm Password"
									error={!!errors.password_confirmation}
									helperText={errors?.password_confirmation?.message}
									variant="outlined"
									required
									fullWidth
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
				onClick={handleSubmit(onSubmit)}
			>
				{submitting ? 'Submitting...' : 'Submit'}
			</Button>
		</div>
	);
}
