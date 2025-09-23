'use client';

import AuthGuardRedirect from '@auth/AuthGuardRedirect';
import VerifyEmailPage from './VerifyEmailPage';

function Page() {
	return (
		<AuthGuardRedirect auth={null}>
			<VerifyEmailPage />
		</AuthGuardRedirect>
	);
}

export default Page;
