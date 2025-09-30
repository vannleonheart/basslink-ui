import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple/FusePageSimple';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider,
		padding: '0 24px'
	},
	'& .FusePageSimple-content': {
		padding: '0 24px'
	},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

export default function PageContainer({ header, content }: { header?: ReactNode; content?: ReactNode }) {
	return (
		<Root
			header={header}
			content={content}
		/>
	);
}
