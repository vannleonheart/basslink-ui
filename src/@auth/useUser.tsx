import { useSession, signOut } from 'next-auth/react';
import { useMemo } from 'react';
import { User } from '@/types';

type useUser = {
	data: User | null;
	side: string;
	isGuest: boolean;
	signOut: typeof signOut;
};

function useUser(): useUser {
	const { data } = useSession();
	const user = useMemo(() => data?.db ?? null, [data]);
	const side = useMemo(() => {
		if (user) {
			if (user?.agent) {
				return 'agent';
			}

			if (user?.client) {
				return 'client';
			}

			if (user?.username) {
				return 'admin';
			}
		}

		return '';
	}, [user]);
	const isGuest = useMemo(() => !user || !user?.id || user?.id?.length === 0, [user]);

	async function handleSignOut() {
		return signOut();
	}

	return {
		data: user,
		side,
		isGuest,
		signOut: handleSignOut
	};
}

export default useUser;
