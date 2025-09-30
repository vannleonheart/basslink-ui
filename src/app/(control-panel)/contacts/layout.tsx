import { ReactNode } from 'react';
import AuthGuardRedirect from '@auth/AuthGuardRedirect';

export default function Layout({ children }: { children: ReactNode }) {
	return <AuthGuardRedirect auth={['agent', 'admin']}>{children}</AuthGuardRedirect>;
}
