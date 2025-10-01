import CopyButton from '@/components/commons/CopyButton';
import Empty from '@/components/commons/Empty';
import LoadingBar from '@/components/commons/LoadingBar';
import StatusLabel from '@/components/commons/StatusLabel';
import { DisbursementStatuses, UserTypes } from '@/data/static-data';
import apiService from '@/store/apiService';
import { DisbursementFilter } from '@/types/component';
import { Disbursement } from '@/types/entity';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	Accordion,
	AccordionActions,
	AccordionDetails,
	AccordionSummary,
	MenuItem,
	TextField,
	Typography
} from '@mui/material';
import { DateTime } from 'luxon';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';

export default function Content() {
	const [filter, setFilter] = useState<DisbursementFilter>({
		status: 'all',
		search: '',
		start: '',
		end: ''
	});
	const {
		data: { accessToken, side }
	} = useSession();
	const { data: disbursementsData, isLoading } = apiService.useGetDisbursementsQuery({
		side,
		accessToken,
		filter
	});
	const disbursements = useMemo(() => (disbursementsData ?? []) as Disbursement[], [disbursementsData]);

	const userTypes = useMemo(() => {
		const types: Record<string, string> = {};
		Object.keys(UserTypes).forEach((key) => {
			types[key] = UserTypes[key];
		});
		return types;
	}, []);

	return (
		<div className="">
			<div className="flex flex-col gap-12">
				<div className="w-full mt-24 bg-white p-12 rounded flex flex-col md:flex-row md:justify-between gap-8 shadow">
					<div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:gap-16">
						<Typography>Status</Typography>
						<TextField
							select
							value={filter.status}
							onChange={(e) => setFilter({ ...filter, status: e.target.value })}
							fullWidth
						>
							{Object.keys(DisbursementStatuses).map((key) => (
								<MenuItem
									key={'status-' + key}
									value={key}
								>
									{DisbursementStatuses[key as keyof typeof DisbursementStatuses]}
								</MenuItem>
							))}
						</TextField>
					</div>
					<div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:gap-16">
						<Typography>From</Typography>
						<TextField
							type="date"
							fullWidth
							value={filter.start}
							onChange={(e) => setFilter({ ...filter, start: e.target.value })}
							InputLabelProps={{ shrink: true }}
						/>
					</div>
					<div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:gap-16">
						<Typography>To</Typography>
						<TextField
							type="date"
							value={filter.end}
							fullWidth
							onChange={(e) => setFilter({ ...filter, end: e.target.value })}
							InputLabelProps={{ shrink: true }}
						/>
					</div>
					<div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:gap-16">
						<Typography>Search</Typography>
						<TextField
							fullWidth
							placeholder="Search by ID, sender or recipient"
							value={filter.search}
							onChange={(e) => setFilter({ ...filter, search: e.target.value })}
						/>
					</div>
				</div>
				{isLoading ? (
					<LoadingBar />
				) : disbursements.length > 0 ? (
					disbursements.map((disbursement) => (
						<DisbursementItem
							key={disbursement.id}
							disbursement={disbursement}
							userTypes={userTypes}
						/>
					))
				) : (
					<Empty text="There are no disbursement" />
				)}
			</div>
		</div>
	);
}

function DisbursementItem({
	disbursement,
	userTypes
}: {
	disbursement: Disbursement;
	userTypes: Record<string, string>;
}) {
	return (
		<div className="p-12 border-b-1 cursor-pointer bg-white rounded border-gray-500 hover:shadow-md">
			<div className="flex flex-col gap-6">
				<div className="flex flex-col md:flex-row md:justify-between gap-8 bg-gray-100 p-4 rounded border-1 border-gray-300">
					<div className="flex gap-4 items-center">
						<FuseSvgIcon size={18}>heroicons-outline:bookmark</FuseSvgIcon>
						<Typography>{disbursement.id}</Typography>
					</div>
					<div className="flex gap-4 items-center">
						<FuseSvgIcon size={18}>heroicons-outline:clock</FuseSvgIcon>
						<Typography>
							{DateTime.fromSeconds(disbursement.created).toFormat('LLL dd, yyyy hh:mm a')}
						</Typography>
					</div>
				</div>
				<div className="flex flex-col md:flex-row md:justify-between gap-4">
					<div className="w-full md:w-1/3 bg-gray-100 p-6 rounded border-1 border-gray-300">
						<div className="h-full flex flex-col gap-4 justify-center items-center">
							<Typography
								className="font-bold"
								fontSize={14}
							>
								{disbursement?.target_account?.bank_name}
							</Typography>
							<div className="flex gap-8 items-center">
								<Typography
									className="font-medium"
									fontSize={12}
								>
									{disbursement?.target_account?.no}
								</Typography>
								<CopyButton value={disbursement?.target_account?.no || ''} />
							</div>
							<Typography
								className="font-medium"
								fontSize={12}
							>
								{disbursement?.target_account?.owner_name}
							</Typography>
						</div>
					</div>
					<div className="w-full md:w-1/3 bg-gray-100 p-6	 rounded flex flex-col gap-8 justify-center items-center border-1 border-gray-300">
						<div className="flex flex-col gap-8 justify-center items-center">
							<Typography
								className="font-medium"
								fontSize={10}
							>
								STATUS
							</Typography>
							<StatusLabel
								status={disbursement.status}
								size="medium"
							/>
						</div>
					</div>
					<div className="w-full md:w-1/3 bg-gray-100 p-6 rounded flex flex-col gap-12 justify-center items-center border-1 border-gray-300">
						<div className="w-full bg-gray-200 p-4 rounded flex flex-col gap-4 justify-center items-center">
							<Typography
								className="font-medium"
								fontSize={12}
							>
								{disbursement?.target_currency?.name} ({disbursement?.target_currency?.symbol})
							</Typography>
						</div>
						<div className="flex gap-8 justify-center items-center">
							<Typography
								className="font-bold"
								fontSize={20}
							>
								{new Intl.NumberFormat('en-US', {
									minimumFractionDigits: 0,
									maximumFractionDigits: 2
								}).format(disbursement.to_amount)}
							</Typography>
							<CopyButton value={disbursement.to_amount.toString()} />
						</div>
					</div>
				</div>
				<Accordion
					square
					disableGutters
					className="bg-gray-50"
					sx={{ boxShadow: 'none',
						border: '1px solid',
						borderColor: 'grey.300',
						'&:before': {
							display: 'none'
						 }
					 }}
				>
					<AccordionSummary>
						<Typography className="font-bold">Details</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<div className="flex flex-col gap-16">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-16">
								<div className="bg-gray-200 p-12 rounded flex flex-col gap-8">
									<Typography className="font-bold">Sender</Typography>
									<div className="flex flex-col gap-4">
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography>Type</Typography>
											<Typography className="font-medium">
												{userTypes[disbursement.user?.user_type] ||
													disbursement.user?.user_type}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography>Name</Typography>
											<Typography className="font-medium">{disbursement.user?.name}</Typography>
										</div>
									</div>
								</div>
								<div className="bg-gray-200 p-12 rounded flex flex-col gap-8">
									<Typography className="font-bold">Recipient</Typography>
									<div className="flex flex-col gap-4">
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography>Type</Typography>
											<Typography className="font-medium">
												{userTypes[disbursement.contact?.contact_type] ||
													disbursement.contact?.contact_type}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography>Name</Typography>
											<Typography className="font-medium">
												{disbursement.contact?.name}
											</Typography>
										</div>
									</div>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-16">
								<div className="bg-gray-200 p-12 rounded flex flex-row gap-4 justify-between items-center">
									<Typography className="font-bold">Rate:</Typography>
									<Typography>{disbursement.rate}</Typography>
								</div>
								<div className="bg-gray-200 p-12 rounded flex flex-row gap-4 justify-between items-center">
									<Typography className="font-bold">Fee:</Typography>
									<Typography>{disbursement.fee_amount}</Typography>
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-16">
								<div className="bg-gray-200 p-12 rounded flex flex-col gap-8">
									<Typography className="font-bold">Purpose:</Typography>
									<Typography>{disbursement.purpose}</Typography>
								</div>
								<div className="bg-gray-200 p-12 rounded flex flex-col gap-8">
									<Typography className="font-bold">Fund Source:</Typography>
									<Typography>{disbursement.fund_source}</Typography>
								</div>
							</div>
						</div>
					</AccordionDetails>
					<AccordionActions>
						<Typography className="text-xs text-gray-500 italic">
							* More details will be added in the future.
						</Typography>
					</AccordionActions>
				</Accordion>
			</div>
		</div>
	);
}
