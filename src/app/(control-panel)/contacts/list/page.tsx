'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useMemo } from 'react';
import { styled } from '@mui/material/styles';
import Header from './Header';
import ContactsList from './ContactsList';
import { useSession } from 'next-auth/react';
import { Contact } from '@/types/entity';
import apiService from '@/store/apiService';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

function ContactsApp() {
	const {
		data: { accessToken }
	} = useSession();
	const { data: contactsData, isLoading } = apiService.useGetContactsQuery({
		accessToken
	});
	const contacts = useMemo(() => (contactsData ?? []) as Contact[], [contactsData]);

	return (
		<Root
			header={
				<Header
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
		/>
	);
}

export default ContactsApp;
