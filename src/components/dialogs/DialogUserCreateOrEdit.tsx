'use client';

import React, { useMemo } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, DialogActions, DialogContent, DialogContentText, MenuItem } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { closeDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { CreateOrEditUserFormData, User, ValidationError } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import PasswordField from '@/components/forms/fields/PasswordField';
import apiService from '@/store/apiService';
import getErrorMessage from '@/data/errors';
import { CountryCodeList } from '@/data/country-code';
import FileUploadInput from '../forms/fields/FileUploadInput';

const createSchema = (isNew: boolean) => {
	const schema = {
		username: z.string().min(1, 'Please enter username.'),
		name: z.string().min(1, 'Please enter agent name'),
		gender: z.string().optional(),
		birthdate: z.string().optional(),
		country: z.string().optional(),
		region: z.string().optional(),
		city: z.string().optional(),
		address: z.string().optional(),
		phone_code: z.string().optional(),
		phone_no: z.string().optional(),
		email: z.string().email('You must enter a valid email').optional(),
		identity_type: z.string().optional(),
		identity_no: z.string().optional(),
		occupation: z.string().optional(),
		portrait_image: z.string().optional(),
		identity_image: z.string().optional(),
		notes: z.string().optional()
	};

	if (isNew) {
		schema['password'] = z.string().min(8, 'Please enter password.');
		schema['password_confirmation'] = z.string().min(8, 'Please confirm your password.');
	} else {
		schema['password'] = z.string().optional();
		schema['password_confirmation'] = z.string().optional();
	}

	return z.object(schema);
};

type FieldName = 'password' | 'password_confirmation';

export default function DialogUserCreateOrEdit({
	user,
	callbackAction
}: {
	user?: User;
	callbackAction?: (callback?: () => void) => void;
}) {
	const countryList = useMemo(() => CountryCodeList.sort((a, b) => a.name.localeCompare(b.name)), []);
	const isNew = !user;
	const {
		data: { accessToken, side }
	} = useSession();
	const dispatch = useDispatch();
	const [createUser, { isLoading: submitting }] = apiService.useCreateUserMutation();
	const [updateUser] = apiService.useUpdateUserMutation();
	const { control, formState, handleSubmit, setError, setValue } = useForm<CreateOrEditUserFormData>({
		mode: 'onChange',
		defaultValues: {
			username: user?.username ?? '',
			name: user?.name ?? '',
			gender: user?.gender ?? '',
			birthdate: user?.birthdate ?? '',
			country: user?.country ?? '',
			region: user?.region ?? '',
			city: user?.city ?? '',
			address: user?.address ?? '',
			email: user?.email ?? '',
			phone_code: user?.phone_code ?? '',
			phone_no: user?.phone_no ?? '',
			identity_type: user?.identity_type ?? '',
			identity_no: user?.identity_no ?? '',
			occupation: user?.occupation ?? '',
			portrait_image: user?.portrait_image ?? '',
			identity_image: user?.identity_image ?? '',
			notes: user?.notes ?? '',
			password: '',
			password_confirmation: ''
		},
		resolver: zodResolver(createSchema(isNew))
	});
	const { isValid, dirtyFields, errors } = formState;
	const handleClose = () => {
		dispatch(closeDialog());
	};

	async function onSubmit(formData: CreateOrEditUserFormData) {
		try {
			if (submitting) {
				return;
			}

			let result;

			if (isNew) {
				result = await createUser({
					side,
					accessToken,
					data: formData
				});
			} else {
				result = await updateUser({
					id: user.id,
					side,
					accessToken,
					data: formData
				});
			}

			const { error, data } = result;

			if (error) {
				throw error;
			}

			if (data.status === 'success') {
				if (callbackAction) {
					callbackAction();
				}

				return handleClose();
			}

			setError('root', { type: 'manual', message: getErrorMessage('Unknown error') });
		} catch (error) {
			console.error(error);
			let errMessage = error?.message;

			if (error?.data?.message) {
				errMessage = error.data.message;
			}

			if (errMessage === 'ERROR_VALIDATION' && error?.data?.data) {
				const errorData = error.data.data as ValidationError[];

				if (errorData && errorData.length) {
					for (const errData of errorData) {
						const fieldName = errData.field.trim().replace(/[A-Z]/g, (letter, index) => {
							if (index > 0) {
								return `_${letter.toLowerCase()}`;
							}

							return letter.toLowerCase();
						});

						if (fieldName && fieldName.length > 0) {
							setError(fieldName as FieldName, { type: 'manual', message: errData.message });
						}
					}
				}

				return;
			}

			setError('root', { type: 'manual', message: getErrorMessage(error?.data?.message) });
		}
	}

	return (
		<React.Fragment>
			<form
				name="agentCreateUserForm"
				noValidate
				className="mt-12 flex w-full flex-col justify-center"
				onSubmit={handleSubmit(onSubmit)}
			>
				<DialogTitle id="form-dialog-title">{isNew ? 'New' : 'Edit'} User</DialogTitle>
				<DialogContent>
					<DialogContentText>
						To {isNew ? 'create' : 'edit'} a new user, please fill in the following form.
					</DialogContentText>
					{errors?.root?.message && (
						<Alert
							className="my-16"
							severity="error"
							sx={(theme) => ({
								backgroundColor: theme.palette.error.light,
								color: theme.palette.error.dark
							})}
						>
							{errors?.root?.message}
						</Alert>
					)}
					<div className="flex flex-col w-full md:flex-row md:justify-between md:space-x-4">
						<Controller
							name="username"
							control={control}
							render={({ field: { onChange, ...rest } }) => (
								<TextField
									{...rest}
									error={!!errors.username}
									helperText={errors?.username?.message}
									autoFocus
									margin="dense"
									id="username"
									label="Username"
									fullWidth
									required
									onChange={(e) => {
										onChange(e);
									}}
								/>
							)}
						/>
						<Controller
							name="name"
							control={control}
							render={({ field: { onChange, ...rest } }) => (
								<TextField
									{...rest}
									error={!!errors.name}
									helperText={errors?.name?.message}
									margin="dense"
									id="name"
									label="Name"
									fullWidth
									required
									onChange={(e) => {
										onChange(e);
									}}
								/>
							)}
						/>
					</div>
					<div className="flex flex-col w-full md:flex-row md:justify-between md:space-x-4">
						<Controller
							name="gender"
							control={control}
							render={({ field: { onChange, ...rest } }) => (
								<TextField
									{...rest}
									error={!!errors.gender}
									helperText={errors?.gender?.message}
									margin="dense"
									id="gender"
									label="Gender"
									fullWidth
									onChange={(e) => {
										onChange(e);
									}}
									select
								>
									<MenuItem value="">Select</MenuItem>
									<MenuItem value="male">Male</MenuItem>
									<MenuItem value="female">Female</MenuItem>
								</TextField>
							)}
						/>
						<Controller
							name="birthdate"
							control={control}
							render={({ field: { onChange, ...rest } }) => (
								<TextField
									{...rest}
									error={!!errors.birthdate}
									helperText={errors?.birthdate?.message}
									margin="dense"
									id="birthdate"
									label="Birthdate"
									fullWidth
									type="date"
									slotProps={{
										inputLabel: { shrink: true }
									}}
									onChange={(e) => {
										onChange(e);
									}}
								/>
							)}
						/>
					</div>
					<Controller
						name="country"
						control={control}
						render={({ field: { onChange, ...rest } }) => (
							<TextField
								{...rest}
								error={!!errors.country}
								helperText={errors?.country?.message}
								margin="dense"
								id="country"
								label="Country"
								fullWidth
								select
								onChange={(e) => {
									onChange(e);
								}}
							>
								{countryList.map((country) => (
									<MenuItem
										key={`country_${country.code}`}
										value={country.code}
									>
										{country.name}
									</MenuItem>
								))}
							</TextField>
						)}
					/>
					<div className="flex flex-col w-full md:flex-row md:justify-between md:space-x-4">
						<Controller
							name="region"
							control={control}
							render={({ field: { onChange, ...rest } }) => (
								<TextField
									{...rest}
									error={!!errors.region}
									helperText={errors?.region?.message}
									margin="dense"
									id="region"
									label="Region"
									fullWidth
									onChange={(e) => {
										onChange(e);
									}}
								/>
							)}
						/>
						<Controller
							name="city"
							control={control}
							render={({ field: { onChange, ...rest } }) => (
								<TextField
									{...rest}
									error={!!errors.city}
									helperText={errors?.city?.message}
									margin="dense"
									id="city"
									label="City"
									fullWidth
									onChange={(e) => {
										onChange(e);
									}}
								/>
							)}
						/>
					</div>
					<Controller
						name="address"
						control={control}
						render={({ field: { onChange, ...rest } }) => (
							<TextField
								{...rest}
								error={!!errors.address}
								helperText={errors?.address?.message}
								margin="dense"
								id="address"
								label="Address"
								multiline
								rows={2}
								fullWidth
								onChange={(e) => {
									onChange(e);
								}}
							/>
						)}
					/>
					<div className="flex flex-col w-full md:flex-row md:justify-between md:space-x-4">
						<Controller
							name="phone_code"
							control={control}
							render={({ field: { onChange, ...rest } }) => (
								<TextField
									{...rest}
									error={!!errors.phone_code}
									helperText={errors?.phone_code?.message}
									margin="dense"
									id="phone_code"
									label="Phone Code"
									fullWidth
									select
									onChange={(e) => {
										onChange(e);
									}}
								>
									{countryList.map((country) => (
										<MenuItem
											key={`phone_code_${country.code}`}
											value={country.dial_code}
										>
											{country.name} ({country.dial_code})
										</MenuItem>
									))}
								</TextField>
							)}
						/>
						<Controller
							name="phone_no"
							control={control}
							render={({ field: { onChange, ...rest } }) => (
								<TextField
									{...rest}
									error={!!errors.phone_no}
									helperText={errors?.phone_no?.message}
									margin="dense"
									id="phone_no"
									label="Phone Number"
									fullWidth
									onChange={(e) => {
										onChange(e);
									}}
								/>
							)}
						/>
					</div>
					<div className="flex flex-col w-full md:flex-row md:justify-between md:space-x-4">
						<Controller
							name="email"
							control={control}
							render={({ field: { onChange, ...rest } }) => (
								<TextField
									{...rest}
									error={!!errors.email}
									helperText={errors?.email?.message}
									margin="dense"
									id="email"
									label="Email Address"
									type="email"
									fullWidth
									required
									onChange={(e) => {
										onChange(e);
									}}
								/>
							)}
						/>
						<Controller
							name="occupation"
							control={control}
							render={({ field: { onChange, ...rest } }) => (
								<TextField
									{...rest}
									error={!!errors.occupation}
									helperText={errors?.occupation?.message}
									margin="dense"
									id="occupation"
									label="Occupation"
									fullWidth
									onChange={(e) => {
										onChange(e);
									}}
								/>
							)}
						/>
					</div>

					<div className="flex flex-col w-full md:flex-row md:justify-between md:space-x-4">
						<Controller
							name="identity_type"
							control={control}
							render={({ field: { onChange, ...rest } }) => (
								<TextField
									{...rest}
									error={!!errors.identity_type}
									helperText={errors?.identity_type?.message}
									margin="dense"
									id="identity_type"
									label="Identity Type"
									fullWidth
									onChange={(e) => {
										onChange(e);
									}}
								/>
							)}
						/>
						<Controller
							name="identity_no"
							control={control}
							render={({ field: { onChange, ...rest } }) => (
								<TextField
									{...rest}
									error={!!errors.identity_no}
									helperText={errors?.identity_no?.message}
									margin="dense"
									id="identity_no"
									label="Identity Number"
									fullWidth
									onChange={(e) => {
										onChange(e);
									}}
								/>
							)}
						/>
					</div>
					<div className="flex flex-col w-full gap-8 md:flex-row md:justify-between md:space-x-4 my-4 md:gap-0">
						<Controller
							name="portrait_image"
							control={control}
							render={({ field }) => (
								<FileUploadInput
									{...field}
									error={!!errors.portrait_image}
									helperText={errors?.portrait_image?.message}
									id="portrait_image"
									label="Portrait Image"
									variant="outlined"
									fullWidth
									onChange={(value) => setValue('portrait_image', value)}
								/>
							)}
						/>
						<Controller
							name="identity_image"
							control={control}
							render={({ field }) => (
								<FileUploadInput
									{...field}
									error={!!errors.identity_image}
									helperText={errors?.identity_image?.message}
									id="identity_image"
									label="Identity Image"
									variant="outlined"
									fullWidth
									onChange={(value) => setValue('identity_image', value)}
								/>
							)}
						/>
					</div>
					<Controller
						name="notes"
						control={control}
						render={({ field: { onChange, ...rest } }) => (
							<TextField
								{...rest}
								error={!!errors.notes}
								helperText={errors?.notes?.message}
								margin="dense"
								id="notes"
								label="Notes"
								multiline
								rows={2}
								fullWidth
								onChange={(e) => {
									onChange(e);
								}}
							/>
						)}
					/>
					<div className="flex flex-row justify-between w-full space-x-4">
						<Controller
							name="password"
							control={control}
							render={({ field: { onChange, ...rest } }) => (
								<PasswordField
									{...rest}
									error={!!errors.password}
									helperText={errors?.password?.message}
									autoFocus
									margin="dense"
									id="password"
									label="Password"
									type="password"
									fullWidth
									required
									onChange={(e) => {
										onChange(e);
									}}
								/>
							)}
						/>
						<Controller
							name="password_confirmation"
							control={control}
							render={({ field: { onChange, ...rest } }) => (
								<PasswordField
									{...rest}
									error={!!errors.password_confirmation}
									helperText={errors?.password_confirmation?.message}
									autoFocus
									margin="dense"
									id="password_confirmation"
									label="Confirm Password"
									type="password"
									fullWidth
									required
									onChange={(e) => {
										onChange(e);
									}}
								/>
							)}
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleClose}
						color="primary"
						type="button"
					>
						Cancel
					</Button>
					<Button
						disabled={_.isEmpty(dirtyFields) || !isValid || submitting}
						type="submit"
						color="primary"
					>
						{submitting ? (isNew ? 'Creating' : 'Saving') : isNew ? 'Create' : 'Save'}
					</Button>
				</DialogActions>
			</form>
		</React.Fragment>
	);
}
