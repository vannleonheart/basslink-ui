'use client';

import AuthGuardRedirect from '@auth/AuthGuardRedirect';

export default function Layout({ children }: { children: React.ReactNode }) {
	return <AuthGuardRedirect auth={true}>{children}</AuthGuardRedirect>;
}
