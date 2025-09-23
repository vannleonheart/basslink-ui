'use client';

import React, { useEffect, useState } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { closeDialog, openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { ApiResponse, Client, CreateOrEditClientFormData, ValidationError } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';
import { CountryCodeList } from '@/data/country-code';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { agentCreateClient, agentDeleteClientById, agentUpdateClientById } from '@/utils/apiCall';
import { useSession } from 'next-auth/react';
import getErrorMessage from '@/data/errors';
import DialogConfirm from '@/components/dialogs/DialogConfirm';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import PasswordField from '@/components/forms/fields/PasswordField';

const createSchema = (isNew: boolean) => {
	let schema = z.object({
		code: z.string().max(5, 'Client code must be 5 characters long.').optional(),
		name: z.string().min(1, 'Please enter client name.'),
		country: z.string().min(1, 'Please assign client country.'),
		email: z.string().email('You must enter a valid email').min(1, 'You must enter an email')
	});

	if (isNew) {
		schema = schema.merge(
			z.object({
				password: z.string().min(1, 'Please enter password.'),
				password_confirmation: z.string().min(1, 'Please confirm password.')
			})
		);
	}

	return schema;
};

type FieldName = 'code' | 'name' | 'country' | 'email' | 'password' | 'password_confirmation';

export default function DialogClientCreateOrEdit({
	client,
	callbackAction
}: {
	client?: Client;
	callbackAction?: () => void;
}) {
	const isNew = !client;
	const {
		data: { accessToken }
	} = useSession();
	const countryList = CountryCodeList.sort((a, b) => a.name.localeCompare(b.name));
	const dispatch = useDispatch();
	const { control, formState, handleSubmit, setError, setValue } = useForm<CreateOrEditClientFormData>({
		mode: 'onChange',
		defaultValues: {
			code: '',
			name: '',
			country: '',
			email: '',
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
	const handleDelete = (client: Client) => {
		dispatch(closeDialog());
		dispatch(
			openDialog({
				children: (
					<DialogConfirm
						message={`Are you sure want to delete client: ${client.name} ?`}
						onConfirm={() => {
							agentDeleteClientById(client.id, accessToken)
								.then((response) => {
									if (response.status === 'success') {
										dispatch(
											showMessage({ message: 'Client has been deleted', variant: 'success' })
										);

										if (callbackAction) {
											callbackAction();
										}
									} else {
										dispatch(
											showMessage({
												message: response?.message ?? 'Failed to delete client',
												variant: 'error'
											})
										);
									}
								})
								.catch((err) =>
									dispatch(
										showMessage({
											message: err?.message ?? 'Failed to delete client',
											variant: 'error'
										})
									)
								);
						}}
					/>
				)
			})
		);
	};
	const generatePrefixCode = (text: string) => {
		let prefixCode = '';

		const slicesText = text.split(' ');

		for (let sliceText of slicesText) {
			sliceText = sliceText.trim();

			if (sliceText.length > 0) {
				prefixCode += sliceText.charAt(0).toUpperCase();
			}
		}

		setValue('code', prefixCode);
	};

	async function onSubmit(formData: CreateOrEditClientFormData) {
		try {
			if (submitting) {
				return;
			}

			setSubmitting(true);

			let resp: ApiResponse;

			if (isNew) {
				resp = await agentCreateClient(formData, accessToken);
			} else {
				resp = await agentUpdateClientById(client.id, formData, accessToken);
			}

			if (resp.status === 'success') {
				if (callbackAction) {
					callbackAction();
				}

				handleClose();
			}

			setError('root', { type: 'manual', message: getErrorMessage(resp?.message) });
		} catch (error) {
			setSubmitting(false);

			let errMessage = error?.message;

			if (error?.data?.message) {
				errMessage = error.data.message;
			}

			if (errMessage === 'ERR_VALIDATION' && error?.data?.data) {
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
							const allowedFieldNames = [
								'code',
								'name',
								'country',
								'email',
								'password',
								'password_confirmation'
							];

							if (allowedFieldNames.includes(fieldName)) {
								setError(fieldName as FieldName, { type: 'manual', message: errData.message });
							}
						}
					}
				}

				return;
			}

			setError('root', { type: 'manual', message: getErrorMessage(error?.data?.message) });
		}
	}

	useEffect(() => {
		if (client) {
			setValue('name', client.name, { shouldValidate: true });
			setValue('code', client.code, { shouldValidate: true });
			setValue('country', client.country, { shouldValidate: true });
			setValue('email', client.email, { shouldValidate: true });
		}
	}, [client]);

	return (
		<React.Fragment>
			<form
				name="agentCreateClientForm"
				noValidate
				className="mt-12 flex w-full flex-col justify-center"
				onSubmit={handleSubmit(onSubmit)}
			>
				<DialogTitle id="form-dialog-title">{isNew ? 'New' : 'Edit'} Client</DialogTitle>
				<DialogContent>
					<DialogContentText>
						To {isNew ? 'create' : 'edit'} a new client, please fill in the following form.
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
					<Controller
						name="name"
						control={control}
						render={({ field: { onChange, ...rest } }) => (
							<TextField
								{...rest}
								error={!!errors.name}
								helperText={errors?.name?.message}
								autoFocus
								margin="dense"
								id="name"
								label="Name"
								type="text"
								fullWidth
								required
								onChange={(e) => {
									generatePrefixCode(e.target.value);
									onChange(e);
								}}
							/>
						)}
					/>
					<Controller
						name="code"
						control={control}
						render={({ field: { onChange, ...rest } }) => (
							<TextField
								{...rest}
								error={!!errors.code}
								helperText={errors?.code?.message}
								autoFocus
								margin="dense"
								id="code"
								label="Prefix Code"
								type="text"
								fullWidth
								onChange={(e) => {
									onChange(e);
								}}
								slotProps={{
									input: {
										endAdornment: (
											<Tooltip
												title="This is the prefix code used for the client deal id"
												arrow
											>
												<span className="font-medium text-lg">?</span>
											</Tooltip>
										)
									},
									htmlInput: {
										minLength: 1,
										maxLength: 5
									}
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
								autoFocus
								margin="dense"
								id="country"
								label="Country"
								fullWidth
								required
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
					{!isNew && (
						<div className="grow flex flex-col items-start justify-start">
							<Button
								onClick={() => handleDelete(client)}
								color="error"
								type="button"
							>
								Delete
							</Button>
						</div>
					)}
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
						Create
					</Button>
				</DialogActions>
			</form>
		</React.Fragment>
	);
}
