import CopyButton from '@/components/commons/CopyButton';
import Empty from '@/components/commons/Empty';
import LoadingBar from '@/components/commons/LoadingBar';
import StatusLabel from '@/components/commons/StatusLabel';
import { CountryCodeList } from '@/data/country-code';
import {
	DisbursementStatuses,
	FundSources,
	IdentityTypes,
	Occupations,
	TransferPurposes,
	UserTypes
} from '@/data/static-data';
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

	const purposeTypes = useMemo(() => {
		const types: Record<string, string> = {};
		Object.keys(TransferPurposes).forEach((key) => {
			types[key] = TransferPurposes[key];
		});
		return types;
	}, []);

	const fundSourceTypes = useMemo(() => {
		const types: Record<string, string> = {};
		Object.keys(FundSources).forEach((key) => {
			types[key] = FundSources[key];
		});
		return types;
	}, []);

	const countryList = useMemo(() => {
		const types: Record<string, string> = {};
		CountryCodeList.forEach((item) => {
			types[item.code] = item.name;
		});
		return types;
	}, []);

	const identityTypeList = useMemo(() => {
		const types: Record<string, string> = {};
		Object.keys(IdentityTypes).forEach((key) => {
			types[key] = IdentityTypes[key];
		});
		return types;
	}, []);

	const occupationList = useMemo(() => {
		const types: Record<string, string> = {};
		Object.keys(Occupations).forEach((key) => {
			types[key] = Occupations[key];
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
							purposeTypes={purposeTypes}
							fundSourceTypes={fundSourceTypes}
							countryList={countryList}
							identityTypeList={identityTypeList}
							occupationList={occupationList}
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
	userTypes,
	purposeTypes,
	fundSourceTypes,
	countryList,
	identityTypeList,
	occupationList
}: {
	disbursement: Disbursement;
	userTypes: Record<string, string>;
	purposeTypes: Record<string, string>;
	fundSourceTypes: Record<string, string>;
	countryList: Record<string, string>;
	identityTypeList: Record<string, string>;
	occupationList: Record<string, string>;
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
								{disbursement?.to_bank_name}
							</Typography>
							<div className="flex gap-8 items-center">
								<Typography
									className="font-medium"
									fontSize={12}
								>
									{disbursement?.to_bank_account_no}
								</Typography>
								<CopyButton value={disbursement?.to_bank_account_no || ''} />
							</div>
							<Typography
								className="font-medium"
								fontSize={12}
							>
								{disbursement?.to_bank_account_name}
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
					sx={{
						boxShadow: 'none',
						border: '1px solid',
						borderColor: 'grey.300',
						'&:before': {
							display: 'none'
						}
					}}
				>
					<AccordionSummary expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}>
						<Typography className="font-bold">Details</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<div className="flex flex-col gap-16">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-16">
								<div className="bg-gray-200 p-12 rounded flex flex-col gap-12">
									<div className="flex gap-6 items-center">
										<FuseSvgIcon size={16}>heroicons-outline:paper-airplane</FuseSvgIcon>
										<Typography className="font-bold">Sender</Typography>
									</div>
									<div className="flex flex-col gap-4">
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Type</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{userTypes[disbursement.from_type] || disbursement.from_type}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Name</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{disbursement.from_name}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Citizenship</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{countryList[disbursement.from_citizenship] ||
													disbursement.from_citizenship}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Identity Type</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{identityTypeList[disbursement.from_identity_type] ||
													disbursement.from_identity_type}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Identity No</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{disbursement.from_identity_no}
											</Typography>
										</div>
										{disbursement.from_occupation && (
											<div className="flex gap-4 items-center items-center justify-between">
												<Typography className="w-full md:w-1/2">Occupation</Typography>
												<Typography className="w-full md:w-1/2 font-medium text-right">
													{occupationList[disbursement.from_occupation] ||
														disbursement.from_occupation}
												</Typography>
											</div>
										)}
										{disbursement.from_email && (
											<div className="flex gap-4 items-center items-center justify-between">
												<Typography className="w-full md:w-1/2">Email</Typography>
												<Typography className="w-full md:w-1/2 font-medium text-right">
													{disbursement.from_email}
												</Typography>
											</div>
										)}
										{disbursement.from_phone_code && disbursement.from_phone_no && (
											<div className="flex gap-4 items-center items-center justify-between">
												<Typography className="w-full md:w-1/2">Phone</Typography>
												<Typography className="w-full md:w-1/2 font-medium text-right">
													({disbursement.from_phone_code}) {disbursement.from_phone_no}
												</Typography>
											</div>
										)}
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Address</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{disbursement.from_address}, {disbursement.from_city},{' '}
												{disbursement.from_region},{' '}
												{countryList[disbursement.from_country] || disbursement.from_country}
											</Typography>
										</div>
									</div>
								</div>
								<div className="bg-gray-200 p-12 rounded flex flex-col gap-12">
									<div className="flex gap-6 items-center">
										<FuseSvgIcon size={16}>heroicons-outline:gift-top</FuseSvgIcon>
										<Typography className="font-bold">Recipient</Typography>
									</div>
									<div className="flex flex-col gap-4">
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Type</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{userTypes[disbursement.to_type] || disbursement.to_type}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Name</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{disbursement.to_name}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Citizenship</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{countryList[disbursement.to_citizenship] ||
													disbursement.to_citizenship}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Identity Type</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{identityTypeList[disbursement.to_identity_type] ||
													disbursement.to_identity_type}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Identity No</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{disbursement.to_identity_no}
											</Typography>
										</div>
										{disbursement.to_occupation && (
											<div className="flex gap-4 items-center items-center justify-between">
												<Typography className="w-full md:w-1/2">Occupation</Typography>
												<Typography className="w-full md:w-1/2 font-medium text-right">
													{occupationList[disbursement.to_occupation] ||
														disbursement.to_occupation}
												</Typography>
											</div>
										)}
										{disbursement.to_email && (
											<div className="flex gap-4 items-center items-center justify-between">
												<Typography className="w-full md:w-1/2">Email</Typography>
												<Typography className="w-full md:w-1/2 font-medium text-right">
													{disbursement.to_email}
												</Typography>
											</div>
										)}
										{disbursement.to_phone_code && disbursement.to_phone_no && (
											<div className="flex gap-4 items-center items-center justify-between">
												<Typography className="w-full md:w-1/2">Phone</Typography>
												<Typography className="w-full md:w-1/2 font-medium text-right">
													({disbursement.to_phone_code}) {disbursement.to_phone_no}
												</Typography>
											</div>
										)}
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Address</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{disbursement.to_address}, {disbursement.to_city},{' '}
												{disbursement.to_region},{' '}
												{countryList[disbursement.to_country] || disbursement.to_country}
											</Typography>
										</div>
										{disbursement.to_relationship && (
											<div className="flex gap-4 items-center items-center justify-between">
												<Typography className="w-full md:w-1/2">Relationship</Typography>
												<Typography className="w-full md:w-1/2 font-medium text-right">
													{disbursement.to_relationship}
												</Typography>
											</div>
										)}
									</div>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-16">
								<div className="bg-gray-200 p-12 rounded flex flex-row gap-4 justify-between items-center">
									<Typography className="font-bold">Sender Currency:</Typography>
									<Typography>
										{disbursement?.source_currency?.name} ({disbursement?.source_currency?.symbol})
									</Typography>
								</div>
								<div className="bg-gray-200 p-12 rounded flex flex-row gap-4 justify-between items-center">
									<Typography className="font-bold">Sent Amount:</Typography>
									<Typography>
										{new Intl.NumberFormat('en-US', {
											minimumFractionDigits: 0,
											maximumFractionDigits: 2
										}).format(disbursement.from_amount)}
									</Typography>
								</div>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-16">
								<div className="bg-gray-200 p-12 rounded flex flex-row gap-4 justify-between items-center">
									<Typography className="font-bold">Rate:</Typography>
									<Typography>{disbursement.rate}</Typography>
								</div>
								<div className="bg-gray-200 p-12 rounded flex flex-row gap-4 justify-between items-center">
									<Typography className="font-bold">Fee Percentage:</Typography>
									<Typography>{disbursement.fee_amount_percent} %</Typography>
								</div>
								<div className="bg-gray-200 p-12 rounded flex flex-row gap-4 justify-between items-center">
									<Typography className="font-bold">Fee Fixed:</Typography>
									<Typography>
										{disbursement?.source_currency?.symbol}{' '}
										{new Intl.NumberFormat('en-US', {
											minimumFractionDigits: 0,
											maximumFractionDigits: 2
										}).format(disbursement.fee_amount_fixed)}
									</Typography>
								</div>
								<div className="bg-gray-200 p-12 rounded flex flex-row gap-4 justify-between items-center">
									<Typography className="font-bold">Fee Total:</Typography>
									<Typography>
										{disbursement?.source_currency?.symbol}{' '}
										{new Intl.NumberFormat('en-US', {
											minimumFractionDigits: 0,
											maximumFractionDigits: 2
										}).format(disbursement.fee_total)}
									</Typography>
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-16">
								<div className="bg-gray-200 p-12 rounded flex flex-col gap-8">
									<Typography className="font-bold">Purpose:</Typography>
									<Typography>
										{purposeTypes[disbursement.purpose] || disbursement.purpose}
									</Typography>
								</div>
								<div className="bg-gray-200 p-12 rounded flex flex-col gap-8">
									<Typography className="font-bold">Fund Source:</Typography>
									<Typography>
										{fundSourceTypes[disbursement.fund_source] || disbursement.fund_source}
									</Typography>
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-16">
								<div className="bg-gray-200 p-12 rounded flex flex-col gap-8">
									<Typography className="font-bold">Bank Detail</Typography>
									<div className="flex gap-4 items-center items-center justify-between">
										<Typography className="w-full md:w-1/2">Bank Name</Typography>
										<Typography className="w-full md:w-1/2 font-medium text-right">
											{disbursement.to_bank_name}
										</Typography>
									</div>
									<div className="flex gap-4 items-center items-center justify-between">
										<Typography className="w-full md:w-1/2">Bank Account No</Typography>
										<div className="flex gap-8 items-center justify-end w-full md:w-1/2">
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{disbursement.to_bank_account_no}
											</Typography>
											<CopyButton value={disbursement?.to_bank_account_no || ''} />
										</div>
									</div>
									<div className="flex gap-4 items-center items-center justify-between">
										<Typography className="w-full md:w-1/2">Account Owner</Typography>
										<Typography className="w-full md:w-1/2 font-medium text-right">
											{disbursement.to_bank_account_name}
										</Typography>
									</div>
									<div className="flex gap-4 items-center items-center justify-between">
										<Typography className="w-full md:w-1/2">Bank Code</Typography>
										<div className="flex gap-8 items-center justify-end w-full md:w-1/2">
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{disbursement.to_bank_code}
											</Typography>
											<CopyButton value={disbursement?.to_bank_code || ''} />
										</div>
									</div>
									<div className="flex gap-4 items-center items-center justify-between">
										<Typography className="w-full md:w-1/2">Bank Swift</Typography>
										<div className="flex gap-8 items-center justify-end w-full md:w-1/2">
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{disbursement.to_bank_swift}
											</Typography>
											<CopyButton value={disbursement?.to_bank_swift || ''} />
										</div>
									</div>
									<div className="flex gap-4 items-center items-center justify-between">
										<Typography className="w-full md:w-1/2">Bank Country</Typography>
										<Typography className="w-full md:w-1/2 font-medium text-right">
											{countryList[disbursement.to_bank_country] || disbursement.to_bank_country}
										</Typography>
									</div>
									<div className="flex gap-4 items-center items-center justify-between">
										<Typography className="w-full md:w-1/2">Bank Email</Typography>
										<Typography className="w-full md:w-1/2 font-medium text-right">
											{disbursement.to_bank_email}
										</Typography>
									</div>
								</div>
								{disbursement.attachments && disbursement.attachments.length > 0 && (
									<div className="w-full bg-gray-200 p-12 rounded flex flex-col gap-8">
										<Typography className="font-bold">Attachments:</Typography>
										{disbursement.attachments.map((attachment) => (
											<a
												key={attachment.id}
												href={attachment.attachment}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 hover:underline break-all p-12"
											>
												<FuseSvgIcon
													className="inline-block mr-4"
													size={16}
												>
													heroicons-outline:paper-clip
												</FuseSvgIcon>
												{attachment.attachment.split('/').pop()}
											</a>
										))}
									</div>
								)}
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
