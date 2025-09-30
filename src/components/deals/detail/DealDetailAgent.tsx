import { AuthComponentProps, Deal, User } from '@/types/entity';
import FileList from './FileList';
import ChatRoom from './ChatRoom';
import { useParams } from 'next/navigation';
import TransferDetailAgent from '@/components/deals/detail/TransferDetailAgent';
import AgentRequestTermAction from './actions/AgentRequestTermAction';
import AgentAcceptDealAction from './actions/AgentAcceptDealAction';
import AgentConfirmReceiveFundAction from '@/components/deals/detail/actions/AgentConfirmReceiveFundAction';
import AgentConfirmInvoicePaymentOrReturnAction from '@/components/deals/detail/actions/AgentConfirmInvoicePaymentOrReturnAction';
import { ArrowCircleLeft } from '@mui/icons-material';
import { Button } from '@mui/material';
import AgentComplete from '@/components/deals/detail/actions/AgentComplete';
import Alert from '@/components/deals/detail/Alert';
import { DateTime } from 'luxon';
import CopyButton from '@/components/commons/CopyButton';
import StatusLabel from '@/components/deals/list/StatusLabel';
import apiService from '@/store/apiService';
import { useMemo } from 'react';

export default function DealDetailAgent({ side, accessToken, user }: Required<AuthComponentProps>) {
	const params = useParams();
	const dealId = params.dealId.toString();
	const {
		data: dealData,
		isLoading,
		refetch
	} = apiService.useGetDealByIdQuery({
		side,
		accessToken,
		id: dealId
	});
	const deal = useMemo(() => dealData as Deal, [dealData]);

	return isLoading ? (
		<div></div>
	) : deal ? (
		<DealDetail
			deal={deal}
			fetch={refetch}
			user={user}
		/>
	) : (
		<div></div>
	);
}

function DealDetail({
	deal,
	fetch,
	user
}: {
	deal: Deal;
	user: User;
	fetch: (dealId: string, accessToken: string) => void;
}) {
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
					<div className="flex gap-12">
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
					<TransferDetailAgent deal={deal} />
					<FileList deal={deal} />
					{deal.accepted_at && (
						<ChatRoom
							deal={deal}
							side="agent"
							allowSend={['owner', 'admin', 'editor'].includes(user.role)}
						/>
					)}
				</div>
			)}
			<ActionsList
				deal={deal}
				fetch={fetch}
				actionable={['owner', 'admin', 'editor'].includes(user.role)}
			/>
		</div>
	);
}

function ActionsList({
	deal,
	fetch,
	actionable
}: {
	deal: Deal;
	actionable: boolean;
	fetch: (dealId: string, accessToken: string) => void;
}) {
	if (deal?.status === 'suggested') {
		return (
			actionable && (
				<AgentAcceptDealAction
					deal={deal}
					fetch={fetch}
				/>
			)
		);
	}

	if (deal?.status === 'accepted') {
		return (
			<Alert
				message="Waiting for confirmation from operator."
				className="bg-yellow-300"
			/>
		);
	}

	if (deal?.status === 'request_for_terms') {
		if (!deal?.terms_submitted_at) {
			return (
				actionable && (
					<AgentRequestTermAction
						deal={deal}
						fetch={fetch}
					/>
				)
			);
		} else {
			return (
				<Alert
					message="Waiting for terms to be accepted by operator."
					className="bg-yellow-300"
				/>
			);
		}
	}

	if (deal?.status === 'waiting_for_payment') {
		return (
			<Alert
				message="Waiting for payment."
				className="bg-yellow-300"
			/>
		);
	}

	if (deal?.status === 'payment_made' && !deal.fund_received_at) {
		return (
			actionable && (
				<AgentConfirmReceiveFundAction
					deal={deal}
					fetch={fetch}
				/>
			)
		);
	}

	if (deal?.status === 'payment_of_invoice' && deal.fund_received_at) {
		return (
			actionable && (
				<AgentConfirmInvoicePaymentOrReturnAction
					deal={deal}
					fetch={fetch}
				/>
			)
		);
	}

	if (deal?.status === 'return_sent') {
		return (
			<Alert
				message="Waiting for confirmation from operator."
				className="bg-yellow-300"
			/>
		);
	}

	if (deal?.status === 'completed') {
		return (
			actionable && (
				<AgentComplete
					deal={deal}
					fetch={fetch}
				/>
			)
		);
	}

	if (deal?.status === 'return') {
		return (
			<Alert
				message="Transaction was completed with a refund."
				className="bg-red-300 text-white"
			/>
		);
	}

	return null;
}
