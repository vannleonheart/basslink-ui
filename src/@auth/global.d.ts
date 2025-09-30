import { UserType } from '@/types/entity';

declare module 'next-auth' {
	interface Session {
		accessToken?: string;
		db: UserType;
		as: string;
		side: string;
	}

	interface JWT {
		accessToken?: string;
		as: string;
	}
}
