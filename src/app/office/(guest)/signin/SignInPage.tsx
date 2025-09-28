import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Alert } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import getErrorMessage from '@/data/errors';
import AdminSignInForm from '@/components/forms/AdminSignInForm';

function SignInPage() {
	const searchParams = useSearchParams();
	const errorType = searchParams.get('code');
	const error = getErrorMessage(errorType);

	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center">
			<Paper className="bg-white min-h-full w-full rounded-0 px-16 py-32 sm:min-h-auto sm:w-auto sm:rounded-xl sm:p-48 sm:shadow md:shadow-2">
				<div className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
					<Typography className="text-4xl font-extrabold leading-4 tracking-tight text-center text-red-700 uppercase">
						<span className="block text-xl font-extrabold leading-tight tracking-tight text-center text-blue-700">
							BassLink
						</span>
						Office
					</Typography>
					<Typography className="mt-16 text-lg font-medium leading-6 tracking-tight text-gray-600 text-center">
						Please sign in to access office dashboard.
					</Typography>
					<div className="flex flex-col space-y-32">
						{error && (
							<Alert
								className=""
								severity="error"
								sx={(theme) => ({
									backgroundColor: theme.palette.error.light,
									color: theme.palette.error.dark
								})}
							>
								{error}
							</Alert>
						)}
						<AdminSignInForm />
					</div>
				</div>
			</Paper>
		</div>
	);
}

export default SignInPage;
