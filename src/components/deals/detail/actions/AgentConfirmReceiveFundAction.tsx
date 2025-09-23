import { Button } from '@mui/material';
import { Deal } from '@/types';
import { agentConfirmReceiveFund, agentConfirmReturnSent } from '@/utils/apiCall';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import DialogConfirm from '@/components/dialogs/DialogConfirm';

export default function AgentConfirmReceiveFundAction({
	deal,
	fetch
}: {
	deal: Deal;
	fetch: (dealId: string, accessToken: string) => void;
}) {
	const {
		data: { accessToken }
	} = useSession();
	const dispatch = useDispatch();

	const handleReceiveFund = () => {
		dispatch(
			openDialog({
				fullWidth: false,
				children: (
					<DialogConfirm
						message="Are you sure want to confirm the fund has been received ?"
						onConfirm={() => {
							agentConfirmReceiveFund(deal.id, accessToken)
								.then((response) => {
									if (response.status === 'success') {
										dispatch(
											showMessage({ message: 'Fund receive was confirmed', variant: 'success' })
										);
										fetch(deal.id, accessToken);
									} else {
										dispatch(
											showMessage({
												message: response?.message ?? 'Failed to confirm fund receive',
												variant: 'error'
											})
										);
									}
								})
								.catch((err) =>
									dispatch(
										showMessage({
											message: err?.message ?? 'Failed to confirm fund receive',
											variant: 'error'
										})
									)
								);
						}}
					/>
				)
			})
		);
	};

	const handleReturnSent = () => {
		dispatch(
			openDialog({
				fullWidth: false,
				children: (
					<DialogConfirm
						message="Are you sure want to confirm the return ?"
						onConfirm={() => {
							agentConfirmReturnSent(deal.id, accessToken)
								.then((response) => {
									if (response.status === 'success') {
										dispatch(
											showMessage({
												message: 'Return was confirmed',
												variant: 'success'
											})
										);
										fetch(deal.id, accessToken);
									} else {
										dispatch(
											showMessage({
												message: response?.message ?? 'Failed to confirm the return',
												variant: 'error'
											})
										);
									}
								})
								.catch((err) =>
									dispatch(
										showMessage({
											message: err?.message ?? 'Failed to confirm the return',
											variant: 'error'
										})
									)
								);
						}}
					/>
				)
			})
		);
	};

	return (
		<div>
			<div className="mt-24 flex items-center justify-between gap-8 bg-gray-300 rounded p-20">
				<div className="w-3/4">Please make sure all the details are correct before proceeding.</div>
				<div className="w-1/4 flex flex-col gap-8">
					<Button
						variant="contained"
						color="warning"
						fullWidth
						onClick={handleReturnSent}
					>
						Return
					</Button>
					<Button
						variant="contained"
						color="success"
						fullWidth
						onClick={handleReceiveFund}
					>
						Fund Received
					</Button>
				</div>
			</div>
		</div>
	);
}
