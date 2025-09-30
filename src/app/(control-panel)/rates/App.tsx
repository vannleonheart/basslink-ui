import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import Header from './Header';
import Content from './Content';
import apiService from '@/store/apiService';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { Rate } from '@/types/entity';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider,
		'& .container': {
			maxWidth: '100%'
		}
	},
	'& .FusePageSimple-content': {
		'& .container': {
			maxWidth: '100%'
		}
	},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

export default function App() {
	const {
		data: { accessToken }
	} = useSession();
	const { data: ratesData, refetch } = apiService.useGetRatesQuery({
		accessToken
	});
	const rates = useMemo(() => (ratesData ?? []) as Rate[], [ratesData]);
	return (
		<Root
			header={<Header fetch={refetch} />}
			content={
				<Content
					data={rates}
					accessToken={accessToken}
					fetch={refetch}
				/>
			}
		/>
	);
}
