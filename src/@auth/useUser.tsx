import { useSession, signOut } from 'next-auth/react';
import { useMemo } from 'react';
import { User } from '@/types/entity';

type useUser = {
	data: User | null;
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
		return signOut();
	}

	return {
		data: user,
		as,
		isGuest,
		signOut: handleSignOut
	};
}

export default useUser;
