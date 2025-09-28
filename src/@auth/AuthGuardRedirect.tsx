'use client';

import React, { useCallback, useEffect, useState } from 'react';
import FuseUtils from '@fuse/utils';
import {
	getSessionRedirectUrl,
	resetSessionRedirectUrl,
	setSessionRedirectUrl
} from '@fuse/core/FuseAuthorization/sessionRedirectUrl';
import usePathname from '@fuse/hooks/usePathname';
import FuseLoading from '@fuse/core/FuseLoading';
import useNavigate from '@fuse/hooks/useNavigate';
import useUser from './useUser';
import { AuthType } from '@/types';

type AuthGuardProps = {
	auth: AuthType;
	children: React.ReactNode;
	loginRedirectUrl?: string;
};

function AuthGuardRedirect({ auth, children, loginRedirectUrl = '/' }: AuthGuardProps) {
	const { data: user, as } = useUser();
	const navigate = useNavigate();
	const [accessGranted, setAccessGranted] = useState<boolean>(false);
	const pathname = usePathname();
	const ignoredPaths = [
		'/',
		'/callback',
		'/signin',
		'/agent/signin',
		'/office/signin',
		'/signout',
		'/logout',
		'/404'
	];
	const handleRedirection = useCallback(() => {
		const redirectUrl = getSessionRedirectUrl() || loginRedirectUrl;

		if (!user) {
			switch (as) {
				case 'agent':
					navigate('/agent/signin');
					break;
				case 'admin':
					navigate('/office/signin');
					break;
				default:
					navigate('/signin');
					break;
			}
		} else {
			navigate(redirectUrl);
			resetSessionRedirectUrl();
		}
	}, [loginRedirectUrl, user]);

	useEffect(() => {
		const userHasPermission = FuseUtils.hasPermission(auth, user);

		if (userHasPermission) {
			resetSessionRedirectUrl();
			setAccessGranted(true);
			return;
		} else {
			if (!user && !ignoredPaths.includes(pathname)) {
				setSessionRedirectUrl(pathname);
			}

			if (user && !ignoredPaths.includes(pathname)) {
				setSessionRedirectUrl('/401');
			}
		}

		handleRedirection();
	}, [auth, user, pathname]);

	return accessGranted ? children : <FuseLoading />;
}

export default AuthGuardRedirect;
