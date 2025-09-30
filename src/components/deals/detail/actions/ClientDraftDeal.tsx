import Alert from '@/components/deals/detail/Alert';
import { Deal } from '@/types/entity';
import { Button } from '@mui/material';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import DialogConfirm from '@/components/dialogs/DialogConfirm';
import { clientCancelDeal, clientDeleteDealById, clientPublishDeal } from '@/utils/apiCall';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import useNavigate from '@fuse/hooks/useNavigate';

export default function ClientDraftDeal({
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
	const navigate = useNavigate();

	const handleDelete = () => {
		dispatch(
			openDialog({
				fullWidth: false,
				children: (
					<DialogConfirm
						message="Are you sure want to delete this deal ?"
						onConfirm={() => {
							clientDeleteDealById(deal.id, accessToken)
								.then((resp) => {
									if (resp.status === 'success') {
										dispatch(showMessage({ message: 'Deal was deleted', variant: 'success' }));
										navigate('/deals');
									} else {
										dispatch(
											showMessage({
												message: resp?.message ?? 'Failed to delete deal',
												variant: 'error'
											})
										);
									}
								})
								.catch((err) => {
									dispatch(
										showMessage({
											message: err?.message ?? 'Failed to delete deal',
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

	const handlePublish = () => {
		dispatch(
			openDialog({
				fullWidth: false,
				children: (
					<DialogConfirm
						message="Are you sure want to publish this deal ?"
						onConfirm={() => {
							clientPublishDeal(deal.id, accessToken)
								.then((resp) => {
									if (resp.status === 'success') {
										dispatch(showMessage({ message: 'Deal was published', variant: 'success' }));
										navigate('/deals');
									} else {
										dispatch(
											showMessage({
												message: resp?.message ?? 'Failed to publish deal',
												variant: 'error'
											})
										);
									}
								})
								.catch((err) => {
									dispatch(
										showMessage({
											message: err?.message ?? 'Failed to publish deal',
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

	const handleCancel = () => {
		dispatch(
			openDialog({
				fullWidth: false,
				children: (
					<DialogConfirm
						message="Are you sure want to delete this deal ?"
						onConfirm={() => {
							clientCancelDeal(deal.id, accessToken)
								.then((resp) => {
									if (resp.status === 'success') {
										dispatch(showMessage({ message: 'Deal was canceled', variant: 'success' }));
										navigate('/deals');
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
											message: err?.message ?? 'Failed to delete deal',
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

	if (!deal.is_published && deal?.status === 'draft') {
		return (
			<div className="flex items-center justify-between gap-8 bg-gray-300 rounded p-12 shadow-2">
				<div className="w-3/4">Please make sure all the details are correct before proceeding.</div>
				<div className="w-1/4 flex flex-col gap-8">
					<div className="flex gap-6">
						<Button
							variant="contained"
							color="error"
							fullWidth
							onClick={handleDelete}
						>
							Delete
						</Button>
						<Button
							variant="contained"
							color="secondary"
							fullWidth
							href={`/deals/${deal.id}/edit`}
						>
							Edit
						</Button>
					</div>
					<Button
						variant="contained"
						color="success"
						fullWidth
						onClick={handlePublish}
					>
						Ready
					</Button>
				</div>
			</div>
		);
	}

	if (!deal.is_published && deal?.status === 'pending') {
		return <div className="mt-24 bg-yellow-200 rounded py-20 text-center">Waiting for admin to approve.</div>;
	}

	if (['new', 'suggested'].includes(deal.status)) {
		return (
			<div className="mt-24 flex items-center justify-between gap-8 bg-gray-300 rounded p-12 shadow-2">
				<div className="w-3/4">Waiting the deal to be accepted by payment agent.</div>
				<div className="w-1/4 flex flex-col gap-8">
					<Button
						variant="contained"
						color="error"
						fullWidth
						onClick={handleCancel}
					>
						Cancel Deal
					</Button>
				</div>
			</div>
		);
	}

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
