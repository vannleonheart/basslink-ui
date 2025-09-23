import { User as AuthUser } from '@/types';

declare module 'next-auth' {
	interface Session {
		accessToken?: string;
		db: AuthUser;
		side: string;
	}

	interface JWT {
		accessToken?: string;
	}
}
