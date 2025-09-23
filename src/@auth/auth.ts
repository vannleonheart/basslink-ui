import NextAuth, { CredentialsSignin } from 'next-auth';
import { createStorage } from 'unstorage';
import memoryDriver from 'unstorage/drivers/memory';
import { UnstorageAdapter } from '@auth/unstorage-adapter';
import type { NextAuthConfig } from 'next-auth';
import type { Provider } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import {
	adminAuthSignin,
	adminGetProfile,
	agentAuthSignin,
	agentGetProfile,
	clientAuthSignin,
	clientGetProfile
} from '@/utils/apiCall';
import { ApiResponse, SignInFormData, SigninResponse, User } from '@/types';

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
				const { email, password, side } = credentials;

				let response: ApiResponse;

				switch (side) {
					default:
						response = await clientAuthSignin({
							email,
							password
						} as SignInFormData);
						break;
					case 'agent':
						response = await agentAuthSignin({
							email,
							password
						} as SignInFormData);
						break;
					case 'admin':
						response = await adminAuthSignin({
							email,
							password
						} as SignInFormData);
						break;
				}

				if (response.status === 'success') {
					const result = ((await response?.data) ?? {}) as SigninResponse;

					return {
						name: side,
						id: result?.token
					};
				} else {
					const { code, message } = response;

					throw new InvalidLoginError(message, code);
				}
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
				return { ...token, accessToken: user?.id, side: user?.name };
			}

			return token;
		},
		async session({ session, token }) {
			if (token && token.accessToken && typeof token.accessToken === 'string' && token.accessToken.length) {
				session.accessToken = token.accessToken;
				session.side = token.side as string;

				let response: ApiResponse;

				switch (token.side) {
					default:
						response = await clientGetProfile(session.accessToken);
						break;
					case 'agent':
						response = await agentGetProfile(session.accessToken);
						break;
					case 'admin':
						response = await adminGetProfile(session.accessToken);
						break;
				}

				if (response.status === 'success') {
					session.db = response?.data as User;

					return session;
				}
			}

			return null;
		}
	},
	session: {
		strategy: 'jwt',
		maxAge: 259200
	},
	debug: process.env.NODE_ENV !== 'production'
} satisfies NextAuthConfig;

export const { handlers, auth } = NextAuth(config);
