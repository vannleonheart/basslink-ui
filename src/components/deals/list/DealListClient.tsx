import { AuthComponentProps, Deal, DealFilter } from '@/types/entity';
import { DateTime } from 'luxon';
import { CountryCodeList } from '@/data/country-code';
import { Button } from '@mui/material';
import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import FuseTab from '@/components/tabs/FuseTab';
import FuseTabs from '@/components/tabs/FuseTabs';
import { Send } from '@mui/icons-material';
import Empty from './Empty';
import Loading from './Loading';
import StatusLabel from '@/components/deals/list/StatusLabel';
import DealListClientFilterBox from '@/components/deals/list/DealListClientFilterBox';
import { useRouter } from 'next/navigation';
import apiService from '@/store/apiService';

const defaultFilter: DealFilter = {
	state: 'new',
	search: '',
	country: 'all',
	status: 'all',
	currency: 'all',
	min: undefined,
	max: undefined,
	start: null,
	end: null
};

export default function DealListClient({ side, accessToken }: Required<AuthComponentProps>) {
	const [tabValue, setTabValue] = useState('new');
	const [filter, setFilter] = useState<DealFilter>(defaultFilter);
	const {
		data: dealsData,
		isLoading,
		refetch
	} = apiService.useGetDealsQuery({
		side,
		accessToken,
		filter
	});
	const deals = useMemo(() => (dealsData ?? []) as Deal[], [dealsData]);
	const handleChangeFilter = (key: string, value: string | number | null) => {
		setFilter({
			...filter,
			[key]: value
		});
	};

	useEffect(() => {
		refetch();
	}, [filter]);

	return (
		<div className="bg-white rounded p-20 shadow-2">
			<div className="flex flex-col items-center justify-between mb-24 md:flex-row">
				<div className="grow flex items-center justify-start">
					<FuseTabs
						value={tabValue}
						onChange={(_: SyntheticEvent, value: string) => {
							setFilter({
								...defaultFilter,
								state: value
							});
							setTabValue(value);
						}}
					>
						<FuseTab
							value="new"
							label="New"
						/>
						<FuseTab
							value="accepted"
							label="Accepted"
						/>
						<FuseTab
							value="archived"
							label="Archived"
						/>
					</FuseTabs>
				</div>
				<div className="flex flex-col items-center justify-between gap-12 mt-24 md:flex-row md:mt-0">
					<Button
						variant="contained"
						color="primary"
						startIcon={<Send />}
						href={`/deals/send-money`}
						fullWidth
					>
						Send Funds
					</Button>
					{/*<Button*/}
					{/*	variant="contained"*/}
					{/*	color="success"*/}
					{/*	startIcon={<MoneySharp />}*/}
					{/*	href={`#`}*/}
					{/*	fullWidth*/}
					{/*>*/}
					{/*	Accept Funds*/}
					{/*</Button>*/}
				</div>
			</div>
			<div className="flex flex-col">
				<div className="w-full mb-24">
					<DealListClientFilterBox
						handleChangeFilter={handleChangeFilter}
						filter={filter}
						tabValue={tabValue}
					/>
				</div>
				<div className="w-full flex items-center justify-between text-sm mb-12 px-6">
					<span className="w-2/12 font-bold px-6">Deal</span>
					<span className="w-3/12 font-bold px-6">Recipient</span>
					<span className="w-2/12 font-bold">Bank/Country</span>
					{['accepted', 'archived'].includes(tabValue) ? (
						<span className="w-1/12 font-bold">Commission</span>
					) : (
						<span className="w-1/12 font-bold">Funding</span>
					)}
					<span className="w-2/12 font-bold">Amount</span>
					<span className="w-2/12 font-bold text-center">Status</span>
				</div>
				{isLoading ? (
					<Loading />
				) : deals.length > 0 ? (
					<div className="w-full flex flex-col gap-12">
						{deals.map((deal, key) => {
							return (
								<DealListItem
									key={key}
									deal={deal}
									tab={tabValue}
								/>
							);
						})}
					</div>
				) : (
					<Empty />
				)}
			</div>
		</div>
	);
}

function DealListItem({ deal, tab }: { deal: Deal; tab: string }) {
	const router = useRouter();
	const countryName = CountryCodeList.find((country) => country.code === deal.receiver_bank_country)?.name;
	return (
		<div
			className="w-full relative px-12 rounded border-1 border-gray-500 cursor-pointer hover:bg-gray-100"
			onClick={() => router.push(`/deals/${deal.id}`)}
		>
			<div className="w-full py-28 flex items-center justify-between gap-4">
				<div className="w-2/12 flex flex-col">
					{deal.id}
					<span className="font-bold text-gray-500 text-sm">
						{DateTime.fromSeconds(deal.created).toFormat('MM/dd/yyyy')}
					</span>
				</div>
				<div className="w-3/12 flex flex-col">{deal.receiver_name}</div>
				<div className="w-2/12 flex flex-col">
					{deal.receiver_bank_name}
					<span className="font-bold text-gray-500 text-sm">{countryName}</span>
				</div>
				{['accepted', 'archived'].includes(tab) ? (
					<div className="w-1/12 flex flex-col">{deal?.commission_percentage}%</div>
				) : (
					<div className="w-1/12 flex flex-col">{deal.from_currency}</div>
				)}
				<div className="w-2/12 flex gap-5">
					<div>{deal.to_currency}</div>
					<div>
						{new Intl.NumberFormat('en-US', {
							minimumFractionDigits: 0
						}).format(Number(deal.to_amount))}
					</div>
				</div>
				<div className="w-2/12 flex flex-col">
					<StatusLabel
						status={deal.status}
						rounded
					/>
				</div>
			</div>
		</div>
	);
}
