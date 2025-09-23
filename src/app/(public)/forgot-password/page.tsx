'use client';

import AuthGuardRedirect from '@auth/AuthGuardRedirect';
import ForgotPasswordPage from './ForgotPasswordPage';

function Page() {
	return (
		<AuthGuardRedirect auth={false}>
			<ForgotPasswordPage />
		</AuthGuardRedirect>
	);
}

export default Page;
