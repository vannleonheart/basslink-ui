import RatesUpdateDialog from '@/components/dialogs/RatesUpdateDialog';
import { useAppDispatch } from '@/store/hooks';
import { AuthComponentProps } from '@/types/component';
import { Rate } from '@/types/entity';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { DateTime } from 'luxon';
import styled from 'styled-components';

const StyledTableRow = styled(TableRow)(() => ({
	'&:nth-of-type(odd)': {
		backgroundColor: '#e9e9e9'
	},
	'&:last-child td, &:last-child th': {
		border: 0
	}
}));

type ContentProps = Partial<AuthComponentProps> & {
	data: Rate[];
};

export default function Content({ data, accessToken, fetch }: ContentProps) {
	const dispatch = useAppDispatch();

	const handleEditRates = (rate: Rate) => {
		dispatch(
			openDialog({
				fullWidth: true,
				children: (
					<RatesUpdateDialog
						rate={rate}
						accessToken={accessToken}
						fetch={fetch}
					/>
				)
			})
		);
	};

	return (
		<div className="p-16">
			<TableContainer component={Paper}>
				<Table size="medium">
					<TableHead>
						<TableRow>
							<TableCell>From</TableCell>
							<TableCell>To</TableCell>
							<TableCell align="right">Rate Buy</TableCell>
							<TableCell align="right">Rate Sell</TableCell>
							<TableCell align="right">
								Spread
								<br />
								Percentage
							</TableCell>
							<TableCell align="right">
								Spread
								<br />
								Fixed
							</TableCell>
							<TableCell>Auto</TableCell>
							<TableCell>Source</TableCell>
							<TableCell>Updated</TableCell>
							<TableCell></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data.map((rate, index) => (
							<StyledTableRow key={`row-${index}`}>
								<TableCell>{rate.from.toUpperCase()}</TableCell>
								<TableCell>{rate.to.toUpperCase()}</TableCell>
								<TableCell align="right">
									{new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(rate.rate_buy)}
								</TableCell>
								<TableCell align="right">
									{new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(
										rate.rate_sell
									)}
								</TableCell>
								<TableCell align="right">
									{new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(
										rate.spread_percentage
									)}
								</TableCell>
								<TableCell align="right">
									{new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(
										rate.spread_fixed
									)}
								</TableCell>
								<TableCell>{rate.auto ? 'On' : 'Off'}</TableCell>
								<TableCell className="capitalize">{rate.source}</TableCell>
								<TableCell>
									{DateTime.fromSeconds(rate.updated).toFormat('yyyy-LLL-dd hh:mm:ss')}
								</TableCell>
								<TableCell>
									<Button
										size="small"
										variant="text"
										color="primary"
										onClick={() => handleEditRates(rate)}
									>
										<FuseSvgIcon size={16}>heroicons-outline:pencil-square</FuseSvgIcon>
									</Button>
								</TableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}
