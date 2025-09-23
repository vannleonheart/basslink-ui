'use client';

import AuthGuardRedirect from '@auth/AuthGuardRedirect';
import App from './App';

function Page() {
	return (
		<AuthGuardRedirect auth="admin">
			<App />
		</AuthGuardRedirect>
	);
}

export default Page;
