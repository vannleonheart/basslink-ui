'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import Header from './Header';
import ListPage from './ListPage';
import SidebarContent from './SidebarContent';
import { useSession } from 'next-auth/react';
import { AgentCompany } from '@/types';
import { agentGetCompanies } from '@/utils/apiCall';
import AuthGuardRedirect from '@auth/AuthGuardRedirect';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

function PageLayout({ children }: { children: React.ReactNode }) {
	const {
		data: { accessToken }
	} = useSession();
	const navigate = useNavigate();
	const routeParams = useParams();
	const searchParams = useSearchParams();
	const id = searchParams.get('_');
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [companies, setCompanies] = useState<AgentCompany[]>();
	const fetchCompaniess = () => {
		if (accessToken) {
			agentGetCompanies(accessToken)
				.then((resp) => {
					if (resp.status === 'success') {
						const companies = (resp.data ?? []) as AgentCompany[];

						setCompanies(companies);
					}
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.companyId);
	}, [routeParams]);

	useEffect(() => {
		fetchCompaniess();
	}, [accessToken, id]);

	return (
		<Root
			header={
				<Header
					data={companies}
					isLoading={isLoading}
				/>
			}
			content={
				<ListPage
					data={companies}
					isLoading={isLoading}
				/>
			}
			ref={pageLayout}
			rightSidebarContent={<SidebarContent>{children}</SidebarContent>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => navigate('/companies')}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<AuthGuardRedirect
			auth={[
				{
					type: 'agent',
					roles: ['owner', 'admin']
				}
			]}
		>
			<PageLayout>{children}</PageLayout>
		</AuthGuardRedirect>
	);
}
