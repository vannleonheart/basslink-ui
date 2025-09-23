import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import FormSideBox from '@/components/commons/FormSideBox';
import { Alert } from '@mui/material';
import AgentSignInForm from '@/components/forms/AgentSignInForm';
import { useSearchParams } from 'next/navigation';
import getErrorMessage from '@/data/errors';

function SignInPage() {
	const searchParams = useSearchParams();
	const errorType = searchParams.get('code');
	const error = getErrorMessage(errorType);

	return (
		<div className="flex min-w-0 flex-1 flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<Paper className="h-full w-full px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-xl sm:p-48 sm:shadow md:flex md:h-full md:w-1/2 md:items-center md:justify-end md:rounded-none md:p-64 md:shadow-none">
				<CardContent className="mx-auto w-full">
					<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
						Sign in
					</Typography>

					<Typography className="mt-16 text-lg font-medium leading-6 tracking-tight text-gray-600">
						Hi Agent, please sign in to access your account.
					</Typography>

					<div className="flex flex-col space-y-32">
						{error && (
							<Alert
								className="mt-16"
								severity="error"
								sx={(theme) => ({
									backgroundColor: theme.palette.error.light,
									color: theme.palette.error.dark
								})}
							>
								{error}
							</Alert>
						)}
						<AgentSignInForm />
					</div>
				</CardContent>
			</Paper>

			<FormSideBox />
		</div>
	);
}

export default SignInPage;
