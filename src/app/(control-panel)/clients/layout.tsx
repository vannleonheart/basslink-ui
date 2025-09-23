'use client';

import AuthGuardRedirect from '@auth/AuthGuardRedirect';
import App from '@/app/(control-panel)/clients/App';

export default function Layout() {
	return (
		<AuthGuardRedirect auth={['admin', 'agent']}>
			<App />
		</AuthGuardRedirect>
	);
}
