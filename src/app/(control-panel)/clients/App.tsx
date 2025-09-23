import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple/FusePageSimple';
import Header from './Header';
import { useSession } from 'next-auth/react';
import ListPage from '@/app/(control-panel)/clients/ListPage';
import apiService from '@/store/apiService';
import { useMemo } from 'react';
import { Client } from '@/types';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	}
}));

export default function App() {
	const {
		data: { accessToken, side, db: user }
	} = useSession();
	const {
		data: clientsData,
		isLoading,
		refetch
	} = apiService.useGetClientsQuery({
		side,
		accessToken
	});
	const clients = useMemo(() => (clientsData ?? []) as Client[], [clientsData]);
	const allowedRolesToCreateAndUpdate = ['owner', 'admin'];

	return (
		<Root
			header={
				<Header
					data={clients}
					isLoading={isLoading}
					fetch={refetch}
					allowCreate={side === 'agent' && allowedRolesToCreateAndUpdate.includes(user.role)}
				/>
			}
			content={
				<ListPage
					data={clients}
					isLoading={isLoading}
					fetch={refetch}
					allowUpdate={side === 'agent' && allowedRolesToCreateAndUpdate.includes(user.role)}
				/>
			}
		/>
	);
}
