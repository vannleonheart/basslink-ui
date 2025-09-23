import { clientConfirmReturn } from '@/utils/apiCall';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { Button } from '@mui/material';
import { Deal } from '@/types';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import DialogConfirm from '@/components/dialogs/DialogConfirm';

export default function ClientConfirmReturn({
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

	const handleConfirmPaymentReturn = () => {
		dispatch(
			openDialog({
				fullWidth: false,
				children: (
					<DialogConfirm
						message="Are you sure want to confirm the return of this deal ?"
						onConfirm={() => {
							clientConfirmReturn(deal.id, accessToken)
								.then((response) => {
									if (response.status === 'success') {
										dispatch(
											showMessage({ message: 'Deal return was confirmed', variant: 'success' })
										);
										fetch(deal.id, accessToken);
									} else {
										dispatch(
											showMessage({
												message: response?.message ?? 'Failed to confirm the return of deal',
												variant: 'error'
											})
										);
									}
								})
								.catch((err) =>
									dispatch(
										showMessage({
											message: err?.message ?? 'Failed to confirm the return of deal',
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
					<div className="flex gap-6">
						<Button
							variant="contained"
							color="success"
							fullWidth
							onClick={handleConfirmPaymentReturn}
						>
							Confirm Return
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
