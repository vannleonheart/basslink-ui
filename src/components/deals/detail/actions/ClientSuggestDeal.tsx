import Alert from '@/components/deals/detail/Alert';
import { Deal } from '@/types/entity';
import { Button } from '@mui/material';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import DialogConfirm from '@/components/dialogs/DialogConfirm';
import { clientCancelDeal } from '@/utils/apiCall';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';

export default function ClientSuggestDeal({
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
	const handleCancel = () => {
		dispatch(
			openDialog({
				fullWidth: false,
				children: (
					<DialogConfirm
						message="Are you sure want to cancel this deal ?"
						onConfirm={() => {
							clientCancelDeal(deal.id, accessToken)
								.then((resp) => {
									if (resp.status === 'success') {
										dispatch(showMessage({ message: 'Deal was canceled', variant: 'success' }));
										fetch(deal.id, accessToken);
									} else {
										dispatch(
											showMessage({
												message: resp?.message ?? 'Failed to cancel deal',
												variant: 'error'
											})
										);
									}
								})
								.catch((err) => {
									dispatch(
										showMessage({
											message: err?.message ?? 'Failed to cancel deal',
											variant: 'error'
										})
									);
								});
						}}
					/>
				)
			})
		);
	};

	return (
		<>
			<Alert
				message="Waiting for deal to be accepted."
				className="bg-yellow-300"
			/>
			<Button
				fullWidth
				color="error"
				variant="contained"
				className="mt-12"
				onClick={handleCancel}
			>
				Cancel
			</Button>
		</>
	);
}
