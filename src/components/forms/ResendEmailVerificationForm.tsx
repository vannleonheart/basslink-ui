import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Alert } from '@mui/material';
import { ResendEmailVerificationFormData } from '@/types/entity';
import { clientAuthResendEmailVerification } from '@/utils/apiCall';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const schema = z.object({
	email: z.string().email('You must enter a valid email').min(1, 'You must enter an email')
});

const defaultValues = {
	email: ''
};

function ResendEmailVerificationForm() {
	const { control, formState, handleSubmit, setError } = useForm<ResendEmailVerificationFormData>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	const router = useRouter();
	const [submitting, setSubmitting] = useState(false);

	async function onSubmit(formData: ResendEmailVerificationFormData) {
		try {
			if (submitting) {
				return;
			}

			setSubmitting(true);

			const result = await clientAuthResendEmailVerification(formData);

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

export default ResendEmailVerificationForm;
