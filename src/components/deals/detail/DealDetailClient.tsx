import TransferDetailClient from './TransferDetailClient';
import { AuthComponentProps, Deal } from '@/types';
import FileList from './FileList';
import ChatRoom from './ChatRoom';
import { useParams } from 'next/navigation';
import ClientConfirmReturn from './actions/ClientConfirmReturn';
import ClientConfirmPaymentMade from '@/components/deals/detail/actions/ClientConfirmPaymentMade';
import ClientAssignDeal from '@/components/deals/detail/actions/ClientAssignDeal';
import ClientConfirmDeal from '@/components/deals/detail/actions/ClientConfirmDeal';
import { ArrowCircleLeft } from '@mui/icons-material';
import { Button } from '@mui/material';
import Alert from '@/components/deals/detail/Alert';
import ClientSuggestDeal from '@/components/deals/detail/actions/ClientSuggestDeal';
import { DateTime } from 'luxon';
import CopyButton from '@/components/commons/CopyButton';
import StatusLabel from '@/components/deals/list/StatusLabel';
import ClientDraftDeal from '@/components/deals/detail/actions/ClientDraftDeal';
import apiService from '@/store/apiService';

export default function DealDetailClient({ side, accessToken }: Required<AuthComponentProps>) {
	const params = useParams();
	const dealId = params.dealId.toString();
	const {
		data: deal,
		isLoading,
		refetch
	} = apiService.useGetDealByIdQuery({
		side,
		accessToken,
		id: dealId
	});

	return isLoading ? (
		<div></div>
	) : deal ? (
		<DealDetail
			deal={deal as Deal}
			fetch={refetch}
		/>
	) : (
		<div></div>
	);
}

function DealDetail({ deal, fetch }: { deal: Deal; fetch: (dealId: string, accessToken: string) => void }) {
	const statusText = deal.status.toLowerCase().split('_').join(' ');

	return (
		<div className="p-16 sm:p-24 w-full bg-white shadow-2 rounded">
			<div className="flex items-center justify-between mb-32">
				<div>
					<div className="flex items-center gap-8">
						<div className="text-3xl font-bold">{deal.id}</div>
						<CopyButton
							value={deal.id}
							size="inherit"
							className="text-[14px]"
						/>
					</div>
					<div className="flex items-center gap-8">
						<div>{DateTime.fromSeconds(deal.created).toFormat('MM/dd/yyyy')}</div>
						<StatusLabel
							status={statusText}
							size="small"
							rounded
						/>
					</div>
				</div>
				<Button
					variant="outlined"
					color="primary"
					startIcon={<ArrowCircleLeft />}
					href={`/deals`}
				>
					Back
				</Button>
			</div>
			{deal && (
				<div className="flex flex-col gap-24">
					<TransferDetailClient deal={deal} />
					<FileList deal={deal} />
					<ChatRoom
						deal={deal}
						side="client"
						allowSend={true}
					/>
				</div>
			)}
			<ActionList
				deal={deal}
				fetch={fetch}
			/>
		</div>
	);
}

function ActionList({ deal, fetch }: { deal: Deal; fetch: (dealId: string, accessToken: string) => void }) {
	if (deal?.status === 'draft') {
		return (
			<ClientDraftDeal
				deal={deal}
				fetch={fetch}
			/>
		);
	}

	if (deal?.status === 'suggested') {
		return (
			<ClientSuggestDeal
				deal={deal}
				fetch={fetch}
			/>
		);
	}

	if (deal?.status === 'dropped') {
		return (
			<Alert
				message="This deal has been dropped."
				className="bg-gray-300"
			/>
		);
	}

	if (deal?.status === 'accepted') {
		return (
			<ClientConfirmDeal
				deal={deal}
				fetch={fetch}
			/>
		);
	}

	if (deal?.status === 'rejected') {
		return (
			<Alert
				message="This deal has been rejected."
				className="bg-gray-300"
			/>
		);
	}

	if (deal?.status === 'request_for_terms') {
		if (!deal.terms_submitted_at) {
			return (
				<Alert
					message="Waiting for terms."
					className="bg-yellow-300"
				/>
			);
		} else {
			return (
				<ClientAssignDeal
					deal={deal}
					fetch={fetch}
				/>
			);
		}
	}

	if (deal?.status === 'waiting_for_payment') {
		return (
			<ClientConfirmPaymentMade
				deal={deal}
				fetch={fetch}
			/>
		);
	}

	if (deal?.status === 'payment_made') {
		if (!deal?.fund_received_at) {
			return (
				<Alert
					message="Waiting for funds confirmation."
					className="bg-yellow-300"
				/>
			);
		} else {
			return (
				<Alert
					message="Waiting for invoice payment."
					className="bg-yellow-300"
				/>
			);
		}
	}

	if (deal?.status === 'payment_of_invoice') {
		return (
			<Alert
				message="Waiting for payment to be processed."
				className="bg-yellow-300"
			/>
		);
	}

	if (deal?.status === 'return_sent') {
		return (
			<ClientConfirmReturn
				deal={deal}
				fetch={fetch}
			/>
		);
	}

	if (deal?.status === 'return') {
		return (
			<Alert
				message="The deal is returned."
				className="bg-red-300 text-white"
			/>
		);
	}

	if (deal?.status === 'completed') {
		return (
			<Alert
				message="The deal is completed."
				className="bg-green-300 text-white"
			/>
		);
	}

	return null;
}
