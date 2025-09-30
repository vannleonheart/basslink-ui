'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import { SecuritySettings, ValidationError } from '@/types/entity';
import { agentUpdatePassword, clientUpdatePassword } from '@/utils/apiCall';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import PasswordField from '@/components/forms/fields/PasswordField';
import useUser from '@auth/useUser';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useDispatch } from 'react-redux';
import getErrorMessage from '@/data/errors';

const defaultValues: SecuritySettings = {
	current_password: '',
	new_password: '',
	new_password_confirmation: ''
};

const schema = z.object({
	current_password: z.string(),
	new_password: z.string().min(6, 'Password must be at least 6 characters').or(z.literal('')).optional(),
	new_password_confirmation: z.string().min(6, 'Password must be at least 6 characters').or(z.literal('')).optional()
});

export default function SecuritySettingsPage() {
	const {
		data: { accessToken }
	} = useSession();
	const { side } = useUser();
	const { control, reset, handleSubmit, formState, setError } = useForm<SecuritySettings>({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	const [submitting, setSubmitting] = useState(false);
	const dispatch = useDispatch();

	async function onSubmit(formData: SecuritySettings) {
		try {
			if (submitting) {
				return;
			}

			setSubmitting(true);

			let result;

			if (side === 'agent') {
				result = await agentUpdatePassword(formData, accessToken);
			} else {
				result = await clientUpdatePassword(formData, accessToken);
			}

			setSubmitting(false);

			if (result?.status === 'success') {
				dispatch(showMessage({ message: 'Password has been updated', variant: 'success' }));
				reset(defaultValues);
				return;
			}

			dispatch(
				showMessage({
					message: getErrorMessage(response?.message ?? 'Failed to update password'),
					variant: 'error'
				})
			);
			return;
		} catch (error) {
			setSubmitting(false);

			const message = getErrorMessage(error?.data?.message ?? error.message ?? 'Failed to update password');

			if (message === 'ERROR_VALIDATION') {
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
							setError(fieldName, { type: 'manual', message: errData.message });
						}
					}
				}

				return;
			}

			dispatch(
				showMessage({
					message,
					variant: 'error'
				})
			);
			return;
		}
	}

	return (
		<div className="w-full max-w-3xl">
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="w-full">
					<Typography className="text-xl">Change your password</Typography>
					<Typography color="text.secondary">
						You can change your password here. Make sure to use a strong password.
					</Typography>
				</div>
				<div className="mt-32 grid w-full gap-6 sm:grid-cols-4 space-y-16">
					<div className="sm:col-span-4">
						<Controller
							name="current_password"
							control={control}
							render={({ field }) => (
								<PasswordField
									{...field}
									label="Current password"
									error={!!errors.current_password}
									helperText={errors?.current_password?.message}
									variant="outlined"
									fullWidth
								/>
							)}
						/>
					</div>
					<div className="sm:col-span-4">
						<Controller
							name="new_password"
							control={control}
							render={({ field }) => (
								<PasswordField
									{...field}
									label="New password"
									error={!!errors.new_password}
									variant="outlined"
									fullWidth
									helperText={errors?.new_password?.message}
								/>
							)}
						/>
					</div>
					<div className="sm:col-span-4">
						<Controller
							name="new_password_confirmation"
							control={control}
							render={({ field }) => (
								<PasswordField
									{...field}
									label="New password (Confirm)"
									error={!!errors.new_password_confirmation}
									variant="outlined"
									fullWidth
									helperText={errors?.new_password_confirmation?.message}
								/>
							)}
						/>
					</div>
				</div>

				<Divider className="mb-40 mt-44 border-t" />
				<div className="flex items-center justify-end space-x-8">
					<Button
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid || submitting}
						type="submit"
					>
						{submitting ? 'Saving...' : 'Save'}
					</Button>
				</div>
			</form>
		</div>
	);
}
