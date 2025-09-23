import { AuthComponentProps, Deal } from '@/types';
import FileList from './FileList';
import ChatRoom from './ChatRoom';
import { useParams } from 'next/navigation';
import TransferDetailAgent from '@/components/deals/detail/TransferDetailAgent';
import { ArrowCircleLeft } from '@mui/icons-material';
import { Button } from '@mui/material';
import { DateTime } from 'luxon';
import CopyButton from '@/components/commons/CopyButton';
import StatusLabel from '@/components/deals/list/StatusLabel';
import apiService from '@/store/apiService';

export default function DealDetailAdmin({ side, accessToken }: Required<AuthComponentProps>) {
	const params = useParams();
	const dealId = params.dealId.toString();
	const { data: deal, isLoading } = apiService.useGetDealByIdQuery({
		side,
		id: dealId,
		accessToken: accessToken
	});

	return isLoading ? <div></div> : deal ? <DealDetail deal={deal as Deal} /> : <div></div>;
}

function DealDetail({ deal }: { deal: Deal }) {
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
					<ChatRoom
						deal={deal}
						side="admin"
					/>
				</div>
			)}
		</div>
	);
}
