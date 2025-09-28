'use client';

import React, { useMemo, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, DialogActions, DialogContent, DialogContentText, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { closeDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { Agent, CreateOrEditAgentFormData, ValidationError } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';
import { CountryCodeList } from '@/data/country-code';
import MenuItem from '@mui/material/MenuItem';
import { adminCreateAgent, adminUpdateAgentById } from '@/utils/apiCall';
import { useSession } from 'next-auth/react';
import getErrorMessage from '@/data/errors';
import PasswordField from '@/components/forms/fields/PasswordField';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const createSchema = (isNew: boolean) => {
	const schema = {
		agent_name: z.string().min(1, 'Please enter business name'),
		country: z.string().optional(),
		region: z.string().optional(),
		city: z.string().optional(),
		address: z.string().optional(),
		phone_code: z.string().optional(),
		phone_no: z.string().optional(),
		website: z.string().optional(),
		email: z.string().email('You must enter a valid email').optional()
	};

	if (isNew) {
		schema['name'] = z.string().min(1, 'Please enter name');
		schema['username'] = z.string().min(1, 'Please enter username');
		schema['password'] = z.string().min(8, 'Please enter password.');
		schema['password_confirmation'] = z.string().min(8, 'Please confirm your password.');
	} else {
		schema['name'] = z.string().optional();
		schema['username'] = z.string().optional();
		schema['password'] = z.string().optional();
		schema['password_confirmation'] = z.string().optional();
	}

	return z.object(schema);
};

type FieldName = 'password' | 'password_confirmation';

export default function DialogAgentCreateOrEdit({
	agent,
	callbackAction
}: {
	agent?: Agent;
	callbackAction?: (callback?: () => void) => void;
}) {
	const isNew = !agent;
	const {
		data: { accessToken }
	} = useSession();
	const countryList = useMemo(() => CountryCodeList.sort((a, b) => a.name.localeCompare(b.name)), []);
	const dispatch = useDispatch();
	const { control, formState, handleSubmit, setError } = useForm<CreateOrEditAgentFormData>({
		mode: 'onChange',
		defaultValues: {
			agent_name: agent?.name ?? '',
			country: agent?.country ?? '',
			region: agent?.region ?? '',
			city: agent?.city ?? '',
			address: agent?.address ?? '',
			phone_code: agent?.phone_code ? `+${agent.phone_code}` : '',
			phone_no: agent?.phone_no ?? '',
			email: agent?.email ?? '',
			website: agent?.website ?? '',
			name: '',
			username: '',
			password: '',
			password_confirmation: ''
		},
		resolver: zodResolver(createSchema(isNew))
	});
	const { isValid, dirtyFields, errors } = formState;
	const [submitting, setSubmitting] = useState(false);
	const handleClose = () => {
		dispatch(closeDialog());
	};

	async function onSubmit(formData: CreateOrEditAgentFormData) {
		try {
			if (submitting) {
				return;
			}

			setSubmitting(true);

			if (isNew) {
				await adminCreateAgent(formData, accessToken);
			} else {
				await adminUpdateAgentById(agent.id, formData, accessToken);
			}

			if (callbackAction) {
				callbackAction();
			}

			return handleClose();
		} catch (error) {
			setSubmitting(false);

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
				name="agentCreateAgentForm"
				noValidate
				className="mt-12 flex w-full flex-col justify-center"
				onSubmit={handleSubmit(onSubmit)}
			>
				<DialogTitle id="form-dialog-title">{isNew ? 'New' : 'Edit'} Agent</DialogTitle>
				<DialogContent>
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
					<DialogContentText
						component="div"
						className="flex items-center space-x-8 mb-2"
					>
						<FuseSvgIcon>heroicons-solid:building-office</FuseSvgIcon>
						<Typography variant="subtitle1">Business Detail</Typography>
					</DialogContentText>
					<Controller
						name="agent_name"
						control={control}
						render={({ field: { onChange, ...rest } }) => (
							<TextField
								{...rest}
								error={!!errors.agent_name}
								helperText={errors?.agent_name?.message}
								margin="dense"
								id="agent_name"
								label="Business Name"
								autoFocus
								fullWidth
								required
								onChange={(e) => {
									onChange(e);
								}}
							/>
						)}
					/>
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
									onChange={(e) => {
										onChange(e);
									}}
								/>
							)}
						/>
						<Controller
							name="website"
							control={control}
							render={({ field: { onChange, ...rest } }) => (
								<TextField
									{...rest}
									error={!!errors.website}
									helperText={errors?.website?.message}
									margin="dense"
									id="website"
									label="Website"
									type="url"
									fullWidth
									onChange={(e) => {
										onChange(e);
									}}
								/>
							)}
						/>
					</div>
					{isNew && (
						<React.Fragment>
							<DialogContentText
								component="div"
								className="flex items-center space-x-8 mt-16 mb-2"
							>
								<FuseSvgIcon>heroicons-solid:user-circle</FuseSvgIcon>
								<Typography variant="subtitle1">User Detail</Typography>
							</DialogContentText>
							<div className="flex flex-col w-full md:flex-row md:justify-between md:space-x-4">
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
											onChange={(e) => {
												onChange(e);
											}}
										/>
									)}
								/>
								<Controller
									name="username"
									control={control}
									render={({ field: { onChange, ...rest } }) => (
										<TextField
											{...rest}
											error={!!errors.username}
											helperText={errors?.username?.message}
											margin="dense"
											id="username"
											label="Username"
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
									name="password"
									control={control}
									render={({ field: { onChange, ...rest } }) => (
										<PasswordField
											{...rest}
											error={!!errors.password}
											helperText={errors?.password?.message}
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
						</React.Fragment>
					)}
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
