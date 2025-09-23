'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

function Dashboard() {
	const { t } = useTranslation('dashboard');

	return (
		<Root
			header={
				<div className="p-24">
					<h4>Dashboard</h4>
				</div>
			}
			content={<div className="p-24"></div>}
		/>
	);
}

export default Dashboard;
