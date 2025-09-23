import { Button } from '@mui/material';
import { Deal } from '@/types';
import { agentConfirmReturnSent } from '@/utils/apiCall';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import DialogConfirm from '@/components/dialogs/DialogConfirm';

export default function AgentComplete({
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
			<div className="mt-24 flex items-center justify-between gap-8 bg-gray-300 rounded-b-lg p-20">
				<div className="w-3/4">
					<span className="font-bold">The deal is completed.</span>
				</div>
				<div className="w-1/4 flex flex-col gap-8">
					<div className="flex gap-6">
						<Button
							variant="contained"
							color="warning"
							fullWidth
							onClick={handleReturnSent}
						>
							Return Sent
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
