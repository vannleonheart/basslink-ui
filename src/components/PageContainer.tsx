import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple/FusePageSimple';
import PageHeader from './PageHeader';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider,
		boxShadow: `inset 0 -1px 0 0px ${theme.palette.divider}`
	},
	'& .FusePageSimple-content': {
		padding: '0 24px'
	},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

type PageContainerProps = {
	header?: ReactNode;
	content?: ReactNode;
	title?: string;
	icon?: string | ReactNode;
};

export default function PageContainer({ header, content, title, icon }: PageContainerProps) {
	if (!header && title && title.length > 0) {
		header = (
			<PageHeader
				title={title}
				icon={icon}
			/>
		);
	}

	return (
		<Root
			header={header}
			content={content}
		/>
	);
}
