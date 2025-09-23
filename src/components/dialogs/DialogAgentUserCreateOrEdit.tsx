'use client';

import React, { useEffect, useMemo } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useDispatch } from 'react-redux';
import { closeDialog, openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { AgentUser, Client, CreateOrEditAgentUserFormData, ValidationError } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import _ from 'lodash';
import MenuItem from '@mui/material/MenuItem';
import { useSession } from 'next-auth/react';
import DialogConfirm from '@/components/dialogs/DialogConfirm';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import PasswordField from '@/components/forms/fields/PasswordField';
import apiService from '@/store/apiService';
import { UserRoles } from '@/data/user';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import getErrorMessage from '@/data/errors';

const createSchema = (isNew: boolean) => {
	if (isNew) {
		return z.object({
			name: z.string().min(1, 'Please enter agent name'),
			email: z.string().email('You must enter a valid email').min(1, 'You must enter an email'),
			role: z.string().min(1, 'Please enter role'),
			client_scope: z.array(z.string()).optional(),
			password: z.string().min(1, 'Please enter password.'),
			password_confirmation: z.string().min(1, 'Please confirm your password.')
		});
	}

	return z.object({
		name: z.string().min(1, 'Please enter agent name'),
		email: z.string().email('You must enter a valid email').min(1, 'You must enter an email'),
		role: z.string().min(1, 'Please enter role'),
		client_scope: z.array(z.string()).optional()
	});
};

type FieldName = 'name' | 'email' | 'password' | 'password_confirmation';

export default function DialogAgentUserCreateOrEdit({
	agentUser,
	callbackAction
}: {
	agentUser?: AgentUser;
	callbackAction?: (callback?: () => void) => void;
}) {
	const isNew = !agentUser;
	const {
		data: { accessToken, side }
	} = useSession();
	const dispatch = useDispatch();
	const { data: clientsData } = apiService.useGetClientsQuery({
		side,
		accessToken
	});
	const clients = useMemo(() => (clientsData ?? []) as Client[], [clientsData]);
	const [createUser, { isLoading: submitting }] = apiService.useCreateUserMutation();
	const [updateUser] = apiService.useUpdateUserMutation();
	const [deleteUser] = apiService.useDeleteUserByIdMutation();
	const { control, formState, handleSubmit, setError, setValue, getValues } = useForm<CreateOrEditAgentUserFormData>({
		mode: 'onChange',
		defaultValues: {
			name: '',
			email: '',
			role: '',
			client_scope: [],
			password: '',
			password_confirmation: ''
		},
		resolver: zodResolver(createSchema(isNew))
	});
	const { isValid, dirtyFields, errors } = formState;
	const handleClose = () => {
		dispatch(closeDialog());
	};
	const handleDelete = (agentUser: AgentUser) => {
		dispatch(closeDialog());
		dispatch(
			openDialog({
				children: (
					<DialogConfirm
						message={`Are you sure want to delete user: ${agentUser.email} ?`}
						onConfirm={() => {
							deleteUser({
								id: agentUser.id,
								accessToken,
								side
							}).then(({ error }) => {
								if (error) {
									dispatch(
										showMessage({
											message: error?.data?.message ?? 'Failed to delete user',
											variant: 'error'
										})
									);
									return;
								}

								dispatch(showMessage({ message: 'User has been deleted', variant: 'success' }));

								if (callbackAction) {
									callbackAction();
								}
							});
						}}
					/>
				)
			})
		);
	};

	async function onSubmit(formData: CreateOrEditAgentUserFormData) {
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
					id: agentUser.id,
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
		if (agentUser) {
			const clientScopes = agentUser?.meta?.role?.[agentUser.role]?.scope?.clients ?? ([] as string[]);
			setValue('name', agentUser.name, { shouldValidate: true });
			setValue('role', agentUser.role, { shouldValidate: true });
			setValue('email', agentUser.email, { shouldValidate: true });
			setValue('client_scope', clientScopes, { shouldValidate: true });
		}
	}, [agentUser]);

	return (
		<React.Fragment>
			<form
				name="agentCreateAgentUserForm"
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
						name="role"
						control={control}
						render={({ field: { onChange, ...rest } }) => (
							<TextField
								{...rest}
								error={!!errors.role}
								helperText={errors?.role?.message}
								autoFocus
								margin="dense"
								id="role"
								label="Role"
								fullWidth
								required
								select
								onChange={(e) => {
									onChange(e);
								}}
							>
								{UserRoles.map((userRole) => (
									<MenuItem
										key={`role_${userRole.role}`}
										value={userRole.role}
									>
										{userRole.name}
									</MenuItem>
								))}
							</TextField>
						)}
					/>
					<Controller
						name="client_scope"
						control={control}
						render={({ field: { onChange, ...rest } }) => (
							<TextField
								{...rest}
								error={!!errors.role}
								autoFocus
								margin="dense"
								id="client_scope"
								label="Client Scope"
								fullWidth
								required
								select
								slotProps={{
									input: {
										inputProps: {
											multiple: true,
											renderValue: (selected) => {
												let result = '';

												if (selected && selected?.length) {
													if (selected.length > 1) {
														result = 'More than 1 client selected';
													} else {
														result = clients.find((r) => r.id === selected[0])?.name;
													}
												}

												return result;
											}
										}
									}
								}}
								onChange={(e) => {
									onChange(e);
								}}
							>
								{clients.map((client) => {
									const scopes = getValues('client_scope') ?? [];
									const isChecked = scopes.includes(client.id);

									return (
										<MenuItem
											key={`client_${client.id}`}
											value={client.id}
										>
											<Checkbox checked={isChecked} />
											<ListItemText primary={client.name} />
										</MenuItem>
									);
								})}
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
								onClick={() => handleDelete(agentUser)}
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
