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
import { Agent, ApiResponse, CreateOrEditAgentFormData, ValidationError } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';
import { CountryCodeList } from '@/data/country-code';
import MenuItem from '@mui/material/MenuItem';
import { adminCreateAgent, adminDeleteAgentById, adminUpdateAgentById } from '@/utils/apiCall';
import { useSession } from 'next-auth/react';
import getErrorMessage from '@/data/errors';
import DialogConfirm from '@/components/dialogs/DialogConfirm';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import PasswordField from '@/components/forms/fields/PasswordField';

const createSchema = (isNew: boolean) => {
	if (isNew) {
		return z.object({
			name: z.string().min(1, 'Please enter agent name'),
			email: z.string().email('You must enter a valid email').min(1, 'You must enter an email'),
			country: z.string().min(1, 'Please assign the country'),
			password: z.string().min(1, 'Please enter password.'),
			password_confirmation: z.string().min(1, 'Please confirm your password.')
		});
	}

	return z.object({
		name: z.string().min(1, 'Please enter agent name'),
		email: z.string().email('You must enter a valid email').min(1, 'You must enter an email'),
		country: z.string().min(1, 'Please assign the country')
	});
};

type FieldName = 'name' | 'email' | 'country' | 'password' | 'password_confirmation';

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
	const countryList = CountryCodeList.sort((a, b) => a.name.localeCompare(b.name));
	const dispatch = useDispatch();
	const { control, formState, handleSubmit, setError, setValue } = useForm<CreateOrEditAgentFormData>({
		mode: 'onChange',
		defaultValues: {
			name: '',
			email: '',
			country: '',
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
	const handleDelete = (agent: Agent) => {
		dispatch(closeDialog());
		dispatch(
			openDialog({
				children: (
					<DialogConfirm
						message={`Are you sure want to delete agent: ${agent.name} ?`}
						onConfirm={() => {
							adminDeleteAgentById(agent.id, accessToken)
								.then((response) => {
									if (response.status === 'success') {
										dispatch(
											showMessage({ message: 'Agent has been deleted', variant: 'success' })
										);

										if (callbackAction) {
											callbackAction();
										}
									} else {
										dispatch(
											showMessage({
												message: response?.message ?? 'Failed to delete agent',
												variant: 'error'
											})
										);
									}
								})
								.catch((err) =>
									dispatch(
										showMessage({
											message: err?.message ?? 'Failed to delete agent',
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

	async function onSubmit(formData: CreateOrEditAgentFormData) {
		try {
			if (submitting) {
				return;
			}

			setSubmitting(true);

			let resp: ApiResponse;

			if (isNew) {
				resp = await adminCreateAgent(formData, accessToken);
			} else {
				resp = await adminUpdateAgentById(agent.id, formData, accessToken);
			}

			if (resp.status === 'success') {
				if (callbackAction) {
					callbackAction();
				}

				return handleClose();
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
							setError(fieldName as FieldName, { type: 'manual', message: errData.message });
						}
					}
				}

				return;
			}

			setError('root', { type: 'manual', message: getErrorMessage(error?.data?.message) });
		}
	}

	useEffect(() => {
		if (agent) {
			setValue('name', agent.name, { shouldValidate: true });
			setValue('country', agent.country, { shouldValidate: true });
			setValue('email', agent.email, { shouldValidate: true });
		}
	}, [agent]);

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
					<DialogContentText>
						To {isNew ? 'create' : 'edit'} a new agent, please fill in the following form.
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
								autoFocus
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
								onClick={() => handleDelete(agent)}
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
						{submitting ? (isNew ? 'Creating' : 'Saving') : isNew ? 'Create' : 'Save'}
					</Button>
				</DialogActions>
			</form>
		</React.Fragment>
	);
}
