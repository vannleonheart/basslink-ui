'use client';

import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import _ from 'lodash';
import { ProfileSettings } from '@/types/entity';
import { CountryCodeList } from '@/data/country-code';
import MenuItem from '@mui/material/MenuItem';
import { useSession } from 'next-auth/react';
import { agentUpdateProfile, clientUpdateProfile } from '@/utils/apiCall';
import React from 'react';
import useUser from '@auth/useUser';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useDispatch } from 'react-redux';

const schema = z.object({
	name: z.string().min(1, 'Name is required'),
	phone_code: z.string().min(1, 'Phone code is required'),
	phone_no: z.string().min(1, 'Phone number is required')
});

export default function ProfileSettingsPage() {
	const {
		data: { accessToken }
	} = useSession();
	const { data: user, side } = useUser();
	const defaultValues: ProfileSettings = {
		name: user?.name || '',
		phone_code: user?.phone_code ? '+' + user?.phone_code : '',
		phone_no: user?.phone_no || ''
	};
	const { control, handleSubmit, formState } = useForm<ProfileSettings>({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	const [submitting, setSubmitting] = React.useState(false);
	const dispatch = useDispatch();

	async function onSubmit(formData: ProfileSettings) {
		try {
			if (submitting) {
				return;
			}

			setSubmitting(true);

			let result;

			if (side === 'agent') {
				result = await agentUpdateProfile(formData, accessToken);
			} else {
				result = await clientUpdateProfile(formData, accessToken);
			}

			setSubmitting(false);

			if (result?.status === 'success') {
				dispatch(showMessage({ message: 'Profile has been updated', variant: 'success' }));
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

			const message = getErrorMessage(error?.data?.message ?? error.message ?? 'Failed to update profile');

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
					<Typography className="text-xl">Profile</Typography>
					<Typography color="text.secondary">
						Please fill in your personal information. This information will be displayed on your profile.
					</Typography>
				</div>
				<div className="mt-32 grid w-full gap-24 sm:grid-cols-4">
					<div className="sm:col-span-4">
						<Controller
							control={control}
							name="name"
							render={({ field }) => (
								<TextField
									{...field}
									label="Name"
									placeholder="Name"
									id="name"
									error={!!errors.name}
									helperText={errors?.name?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
					</div>
					<div className="sm:col-span-2">
						<Controller
							name="phone_code"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									select
									label="Phone Code"
									error={!!errors.phone_code}
									helperText={errors?.phone_code?.message}
									variant="outlined"
									required
									fullWidth
								>
									{CountryCodeList.map((option) => (
										<MenuItem
											key={option.code}
											value={option.dial_code}
										>
											{option.name} ({option.dial_code})
										</MenuItem>
									))}
								</TextField>
							)}
						/>
					</div>
					<div className="sm:col-span-2">
						<Controller
							control={control}
							name="phone_no"
							render={({ field }) => (
								<TextField
									className=""
									{...field}
									label="Phone Number"
									placeholder=""
									id="phone_no"
									error={!!errors.phone_no}
									helperText={errors?.phone_no?.message}
									variant="outlined"
									fullWidth
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
