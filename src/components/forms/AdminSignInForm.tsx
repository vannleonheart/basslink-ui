import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@fuse/core/Link';
import Button from '@mui/material/Button';
import { signIn } from 'next-auth/react';
import { Alert } from '@mui/material';
import { SignInFormData } from '@/types';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import PasswordField from '@/components/forms/fields/PasswordField';
import getErrorMessage from '@/data/errors';

const schema = z.object({
	email: z.string().email('You must enter a valid email').min(1, 'You must enter an email'),
	password: z.string().min(1, 'Please enter your password.'),
	remember: z.boolean().optional().default(false)
});

function AdminSignInForm() {
	const { control, formState, handleSubmit, setError, setValue } = useForm<SignInFormData>({
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: '',
			remember: false
		},
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	const [submitting, setSubmitting] = useState(false);

	async function onSubmit(formData: SignInFormData) {
		if (submitting) {
			return;
		}

		setSubmitting(true);

		const result = await signIn('credentials', {
			...formData,
			side: 'admin',
			redirect: false
		});

		if (result?.error) {
			setValue('password', '');
			setSubmitting(false);
			setError('root', { type: 'manual', message: getErrorMessage(result?.code) });
			return false;
		}

		return redirect('/dashboard');
	}

	return (
		<form
			name="adminLoginForm"
			noValidate
			className="mt-20 flex w-full flex-col justify-center"
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
				name="email"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Email"
						autoFocus
						type="email"
						error={!!errors.email}
						helperText={errors?.email?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>
			<Controller
				name="password"
				control={control}
				render={({ field }) => (
					<PasswordField
						{...field}
						className="mb-24"
						label="Password"
						error={!!errors.password}
						helperText={errors?.password?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>
			<div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">
				<Controller
					name="remember"
					control={control}
					render={({ field }) => (
						<FormControl>
							<FormControlLabel
								label="Remember me"
								control={
									<Checkbox
										size="small"
										{...field}
									/>
								}
							/>
						</FormControl>
					)}
				/>

				<Link
					className="text-md font-medium"
					to="/forgot-password"
				>
					Forgot password?
				</Link>
			</div>
			<Button
				variant="contained"
				color="secondary"
				className="mt-16 w-full"
				aria-label="Sign in"
				disabled={_.isEmpty(dirtyFields) || !isValid || submitting}
				type="submit"
				size="large"
			>
				{submitting ? 'Signing in...' : 'Sign in'}
			</Button>
		</form>
	);
}

export default AdminSignInForm;
