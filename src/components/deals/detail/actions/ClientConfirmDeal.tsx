import { Button } from '@mui/material';
import { Deal } from '@/types/entity';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { clientCancelDeal, clientConfirmDeal } from '@/utils/apiCall';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import DialogConfirm from '@/components/dialogs/DialogConfirm';

export default function ClientConfirmDeal({
	deal,
	fetch
}: {
	deal: Deal;
	fetch: (dealId: string, accessToken: string) => void;
}) {
	const { data } = useSession();
	const { accessToken } = data;
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

	const handleConfirmDeal = async () => {
		dispatch(
			openDialog({
				fullWidth: false,
				children: (
					<DialogConfirm
						message="Are you sure want to confirm this deal ?"
						onConfirm={() => {
							clientConfirmDeal(deal.id, accessToken)
								.then((response) => {
									if (response.status === 'success') {
										dispatch(showMessage({ message: 'Deal was confirmed', variant: 'success' }));
										fetch(deal.id, accessToken);
									} else {
										dispatch(
											showMessage({
												message: response?.message ?? 'Failed to confirm deal',
												variant: 'error'
											})
										);
									}
								})
								.catch((err) =>
									dispatch(
										showMessage({
											message: err?.message ?? 'Failed to confirm deal',
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
		<div className="mt-24 flex items-center justify-between gap-8 bg-gray-300 rounded p-20">
			<div className="w-3/4">Please make sure all the details are clear before proceeding.</div>
			<div className="w-1/4 flex flex-col gap-8">
				<Button
					variant="contained"
					color="error"
					fullWidth
					onClick={handleCancel}
				>
					Cancel
				</Button>
				<Button
					variant="contained"
					color="success"
					fullWidth
					onClick={handleConfirmDeal}
				>
					Confirm
				</Button>
			</div>
		</div>
	);
}
