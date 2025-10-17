import { useSession, signOut } from 'next-auth/react';
import { useMemo } from 'react';
import { AllUser } from '@/types/entity';

type useUser = {
	data: AllUser | null;
	as: string;
	isGuest: boolean;
	signOut: typeof signOut;
};

function useUser(): useUser {
	const { data } = useSession();
	const user = useMemo(() => data?.db, [data]);
	const as = useMemo(() => data?.as, [data]);
	const isGuest = useMemo(() => !user, [user]);

	async function handleSignOut() {
		let redirectTo = '/signin';

		if (as === 'admin') {
			redirectTo = '/office/signin';
		}

		return signOut({
			redirect: true,
			redirectTo
		});
	}

	return {
		data: user,
		as,
		isGuest,
		signOut: handleSignOut
	};
}

export default useUser;
