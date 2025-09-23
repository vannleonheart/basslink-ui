'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import ContactsHeader from './ContactsHeader';
import ContactsList from './ContactsList';
import ContactsSidebarContent from './ContactsSidebarContent';
import { useSession } from 'next-auth/react';
import { ClientContact } from '@/types';
import { clientGetContacts } from '@/utils/apiCall';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

function ContactsApp({ children }: { children: React.ReactNode }) {
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
	const [contacts, setContacts] = useState<ClientContact[]>();
	const fetchContacts = () => {
		if (accessToken) {
			clientGetContacts(accessToken)
				.then((resp) => {
					if (resp.status === 'success') {
						setContacts(resp.data as ClientContact[]);
					}
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	};

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.contactId);
	}, [routeParams]);

	useEffect(() => {
		fetchContacts();
	}, [accessToken, id]);

	return (
		<Root
			header={
				<ContactsHeader
					data={contacts}
					isLoading={isLoading}
				/>
			}
			content={
				<ContactsList
					data={contacts}
					isLoading={isLoading}
				/>
			}
			ref={pageLayout}
			rightSidebarContent={<ContactsSidebarContent>{children}</ContactsSidebarContent>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => navigate('/contacts')}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default ContactsApp;
