import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';
import Paper from '@mui/material/Paper';
import CardContent from '@mui/material/CardContent';
import ResetPasswordForm from '@/components/forms/ResetPasswordForm';
import FormSideBox from '@/components/commons/FormSideBox';

/**
 * The forgot password page.
 */
function ResetPasswordPage() {
	return (
		<div className="flex min-w-0 flex-1 flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<FormSideBox />

			<Paper className="h-full w-full px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-xl sm:p-48 sm:shadow md:flex md:h-full md:w-1/2 md:items-center md:justify-end md:rounded-none md:p-64 md:shadow-none">
				<CardContent className="mx-auto w-full">
					<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
						Reset your password
					</Typography>

					<div className="mt-2 flex items-baseline font-medium">
						<Typography>Already have an account?</Typography>
						<Link
							className="ml-4"
							to="/signin"
						>
							Sign in
						</Link>
					</div>

					<ResetPasswordForm />
				</CardContent>
			</Paper>
		</div>
	);
}

export default ResetPasswordPage;
