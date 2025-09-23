import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from 'lodash';
import Button from '@mui/material/Button';
import { Alert } from '@mui/material';
import { ResetPasswordFormData } from '@/types';
import { clientAuthReset } from '@/utils/apiCall';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import PasswordField from '@/components/forms/fields/PasswordField';

const schema = z
	.object({
		password: z
			.string()
			.min(1, 'Please enter your password.')
			.min(6, 'Password is too short - should be 8 chars minimum.'),
		password_confirmation: z.string().min(1, 'Password confirmation is required')
	})
	.refine((data) => data.password === data.password_confirmation, {
		message: 'Passwords must match',
		path: ['passwordConfirmation']
	});

const defaultValues = {
	id: '',
	token: '',
	password: '',
	password_confirmation: ''
};

function ResetPasswordForm() {
	const query = useSearchParams();
	const id = query.get('id');
	const token = query.get('token');
	const { control, formState, handleSubmit, setError } = useForm<ResetPasswordFormData>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	const router = useRouter();
	const [submitting, setSubmitting] = useState(false);

	async function onSubmit(formData: ResetPasswordFormData) {
		try {
			if (submitting) {
				return;
			}

			setSubmitting(true);

			const result = await clientAuthReset({
				...formData,
				id,
				token
			});

			if (result?.status === 'success') {
				router.push('/signin');
				return;
			}

			setSubmitting(false);
			setError('root', { type: 'manual', message: result.message });
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
			<Controller
				name="password"
				control={control}
				render={({ field }) => (
					<PasswordField
						{...field}
						className="mb-24"
						label="New Password"
						autoFocus
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
						className="mb-24"
						label="New Password (Confirm)"
						autoFocus
						error={!!errors.password_confirmation}
						helperText={errors?.password_confirmation?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>
			<Button
				variant="contained"
				color="secondary"
				className="mt-16 w-full"
				aria-label="Submit"
				disabled={_.isEmpty(dirtyFields) || !isValid || submitting}
				type="submit"
				size="large"
			>
				{submitting ? 'Submitting...' : 'Submit'}
			</Button>
		</form>
	);
}

export default ResetPasswordForm;
