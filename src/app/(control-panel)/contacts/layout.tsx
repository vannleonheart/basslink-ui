import ContactsApp from './ContactsApp';
import AuthGuardRedirect from '@auth/AuthGuardRedirect';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<AuthGuardRedirect auth="client">
			<ContactsApp>{children}</ContactsApp>
		</AuthGuardRedirect>
	);
}
