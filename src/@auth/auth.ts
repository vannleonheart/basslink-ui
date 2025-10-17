import NextAuth, { CredentialsSignin } from 'next-auth';
import { createStorage } from 'unstorage';
import memoryDriver from 'unstorage/drivers/memory';
import { UnstorageAdapter } from '@auth/unstorage-adapter';
import type { NextAuthConfig } from 'next-auth';
import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import { adminAuthSignin, adminGetProfile, agentAuthSignin, agentGetProfile } from '@/utils/apiCall';
import { ApiResponse } from '@/types/component';
import { SignInFormData, SigninResponse } from '@/types/form';
import { AdminUser, AgentUser } from '@/types/entity';

const storage = createStorage({
	driver: memoryDriver()
});

class InvalidLoginError extends CredentialsSignin {
	declare code: string;
	declare status: string;

	constructor(message = 'credentials', status?: string) {
		super();
		this.code = message;
		this.status = status;
	}
}

export const providers: Provider[] = [
	Credentials({
		async authorize(credentials) {
			try {
				const { username, password, as } = credentials;

				let response: ApiResponse;

				switch (as) {
					default:
						response = await agentAuthSignin({
							username,
							password
						} as SignInFormData);
						break;
					case 'admin':
						response = await adminAuthSignin({
							username,
							password
						} as SignInFormData);
						break;
				}

				const result = response.data as SigninResponse;

				return {
					name: as,
					id: result?.token
				};
			} catch (err) {
				const data = err?.data;

				if (!data) {
					throw new InvalidLoginError(err?.message);
				}

				const { code, message } = data ?? {};

				throw new InvalidLoginError(message, code);
			}
		}
	})
];

const config = {
	theme: { logo: '/assets/images/logo/logo.svg' },
	adapter: UnstorageAdapter(storage),
	pages: {
		signIn: '/signin'
	},
	providers,
	basePath: '/auth',
	trustHost: true,
	callbacks: {
		authorized() {
			return true;
		},
		jwt({ token, account, user }) {
			if (account?.provider === 'credentials') {
				return { ...token, accessToken: user.id, as: user.name };
			}

			return token;
		},
		async session({ session, token }) {
			if (token && token.accessToken && typeof token.accessToken === 'string' && token.accessToken.length) {
				session.accessToken = token.accessToken;
				session.side = token.as as string;

				try {
					let response: ApiResponse;

					switch (token.as) {
						default:
							response = await agentGetProfile(session.accessToken);
							session.db = response.data as AgentUser;
							session.db.as = `${token.as}.${session.db?.role}`;
							session.as = session.db.as;
							break;
						case 'admin':
							response = await adminGetProfile(session.accessToken);
							session.db = response.data as AdminUser;
							session.db.as = `${token.as}.${session.db?.role}`;
							session.as = session.db.as;
							break;
					}

					return session;
				} catch (_err) {
					return null;
				}
			}

			return null;
		}
	},
	experimental: {
		enableWebAuthn: true
	},
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60
	},
	debug: process.env.NODE_ENV !== 'production'
} satisfies NextAuthConfig;

export type AuthJsProvider = {
	id: string;
	name: string;
	style?: {
		text?: string;
		bg?: string;
	};
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
