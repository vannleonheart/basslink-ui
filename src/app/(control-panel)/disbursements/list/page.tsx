import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple/FusePageSimple';
import Header from './Header';
import Content from './Content';

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
	// const {
	// 	data: { accessToken, side }
	// } = useSession();
	// const {
	// 	data: disbursementsData,
	// 	isLoading,
	// 	refetch
	// } = apiService.useGetDisbursementsQuery({
	// 	side,
	// 	accessToken
	// });
	// const disbursements = useMemo(() => (disbursementsData ?? []) as Disbursement[], [disbursementsData]);

	return (
		<Root
			header={<Header />}
			content={<Content />}
		/>
	);
}
