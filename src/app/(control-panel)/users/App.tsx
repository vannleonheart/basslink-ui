import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple/FusePageSimple';
import Header from './Header';
import { useSession } from 'next-auth/react';
import ListPage from './ListPage';
import apiService from '@/store/apiService';
import { useMemo } from 'react';
import { AgentUser } from '@/types';

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
		data: { accessToken, side }
	} = useSession();
	const {
		data: usersData,
		isLoading,
		refetch
	} = apiService.useGetUsersQuery({
		side,
		accessToken
	});
	const users = useMemo(() => (usersData ?? []) as AgentUser[], [usersData]);

	return (
		<Root
			header={
				<Header
					data={users}
					isLoading={isLoading}
					fetch={refetch}
				/>
			}
			content={
				<ListPage
					data={users}
					isLoading={isLoading}
					fetch={refetch}
				/>
			}
		/>
	);
}
