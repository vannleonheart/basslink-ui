'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useMemo } from 'react';
import { styled } from '@mui/material/styles';
import Header from './Header';
import ContactsList from './ListPage';
import { useSession } from 'next-auth/react';
import { Recipient } from '@/types/entity';
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
		data: { accessToken, side }
	} = useSession();
	const { data: recipientsData, isLoading } = apiService.useGetRecipientsQuery({
		accessToken,
		side
	});
	const recipients = useMemo(() => (recipientsData ?? []) as Recipient[], [recipientsData]);

	return (
		<Root
			header={
				<Header
					data={recipients}
					isLoading={isLoading}
				/>
			}
			content={
				<ContactsList
					data={recipients}
					isLoading={isLoading}
				/>
			}
		/>
	);
}

export default ContactsApp;
