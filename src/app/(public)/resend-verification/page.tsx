'use client';

import AuthGuardRedirect from '@auth/AuthGuardRedirect';
import ResendVerificationPage from './ResendVerificationPage';

function Page() {
	return (
		<AuthGuardRedirect auth={false}>
			<ResendVerificationPage />
		</AuthGuardRedirect>
	);
}

export default Page;
