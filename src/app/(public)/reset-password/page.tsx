'use client';

import AuthGuardRedirect from '@auth/AuthGuardRedirect';
import ResetPasswordPage from './ResetPasswordPage';

function Page() {
	return (
		<AuthGuardRedirect auth={false}>
			<ResetPasswordPage />
		</AuthGuardRedirect>
	);
}

export default Page;
