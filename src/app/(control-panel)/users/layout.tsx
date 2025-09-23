'use client';

import AuthGuardRedirect from '@auth/AuthGuardRedirect';
import App from './App';

export default function Layout() {
	return (
		<AuthGuardRedirect
			auth={[
				{
					type: 'agent',
					roles: ['owner', 'admin']
				}
			]}
		>
			<App />
		</AuthGuardRedirect>
	);
}
