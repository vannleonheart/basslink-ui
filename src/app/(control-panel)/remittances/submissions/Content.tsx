import apiService from '@/store/apiService';
import { RemittanceFilter } from '@/types/component';
import { Remittance } from '@/types/entity';
import { CircularProgress, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import Filter from './Filter';
import { formatNumber } from '@/utils/format';
import StatusLabel from '@/components/commons/StatusLabel';

const defaultFilter: RemittanceFilter = {
	status: 'all',
	type: 'all',
	start: '',
	end: '',
	min: '',
	max: '',
	search: ''
};

export default function Content() {
	const [filter, setFilter] = useState<RemittanceFilter>(defaultFilter);
	const {
		data: { accessToken, side }
	} = useSession();
	const [queryLoaded, setQueryLoaded] = useState(false);
	const {
		data: remittancesData,
		isLoading,
		isUninitialized,
		refetch
	} = apiService.useGetRemittanceSubmissionsQuery(
		{
			side,
			accessToken,
			filter
		},
		{
			skip: !queryLoaded // Skip the query until the URL params are loaded
		}
	);
	const remittances = useMemo(() => (remittancesData ?? []) as Remittance[], [remittancesData]);

	useEffect(() => {
		if (!isUninitialized) {
			refetch();
		}
	}, [filter, isUninitialized, refetch]);

	useEffect(() => {
		// Parse URL query params to set initial filter state
		const params = new URLSearchParams(window.location.search);
		const initialFilter: RemittanceFilter = { ...defaultFilter };
		params.forEach((value, key) => {
			if (key in initialFilter) {
				initialFilter[key] = value;
			}
		});
		setFilter(initialFilter);
		setQueryLoaded(true); // Now we can load the query
	}, []);

	const handleChangeFilter = (filter: RemittanceFilter) => {
		setFilter(filter);

		// generate url query params
		const newFilter = {
			...filter
		};
		const queryParams = new URLSearchParams();
		Object.entries(newFilter).forEach(([k, val]) => {
			if (val && val !== 'all') {
				queryParams.append(k, String(val));
			}
		});
		const queryString = queryParams.toString();
		const newUrl = `/remittances/list?${queryString}`;
		window.history.replaceState(null, '', newUrl);
	};

	return (
		<div className="flex flex-col bg-white my-20 p-12 rounded shadow h-full">
			<Filter
				filter={filter}
				setFilter={handleChangeFilter}
			/>
			<div>
				<div className="hidden mt-28 mb-6 w-full px-12 gap-20 md:grid grid-cols-1 md:grid-cols-12">
					<Typography className="col-span-2">No. Trx</Typography>
					<Typography className="col-span-2">Penerima</Typography>
					<Typography className="col-span-2">Bank</Typography>
					<Typography className="col-span-2 text-right">Dibayar</Typography>
					<Typography className="col-span-2 text-right">Diterima</Typography>
					<Typography className="col-span-2 text-center">Status</Typography>
				</div>
			</div>
			{isLoading ? (
				<Loading />
			) : remittances.length > 0 ? (
				<div className="flex flex-col gap-8">
					{remittances.map((remittance) => (
						<RemittanceItem
							key={remittance.id}
							remittance={remittance}
						/>
					))}
				</div>
			) : (
				<Empty />
			)}
		</div>
	);
}

function RemittanceItem({ remittance }: { remittance: Remittance }) {
	const handleOpen = () => {
		const url = `/remittances/${remittance.id}`;
		window.location.href = url;
	};

	return (
		<div
			className="p-12 cursor-pointer bg-white rounded border border-gray-500"
			onClick={handleOpen}
		>
			<div className="w-full grid grid-cols-1 md:grid-cols-12 gap-20">
				<div className="md:col-span-2">
					<Typography fontWeight="medium">{remittance.id}</Typography>
					<Typography fontSize={10}>
						{DateTime.fromSeconds(remittance.created).toFormat('LLL dd, yyyy hh:mm a')}
					</Typography>
				</div>
				<div className="md:col-span-2">
					<div>{remittance.to_name}</div>
				</div>
				<div className="md:col-span-2">
					<div>
						<Typography
							fontWeight="medium"
							fontSize={14}
						>
							{remittance.to_bank_name}
						</Typography>
						<Typography fontSize={12}>Account No: {remittance.to_bank_account_no}</Typography>
					</div>
				</div>
				<div className="md:col-span-2 md:text-right">
					{formatNumber(
						remittance.from_amount,
						{
							currencySign: 'standard',
							style: 'currency',
							currency: remittance.from_currency
						},
						'id-ID'
					)}
				</div>
				<div className="md:col-span-2 md:text-right">
					{formatNumber(
						remittance.to_amount,
						{
							currencySign: 'standard',
							style: 'currency',
							currency: remittance.to_currency
						},
						'id-ID'
					)}
				</div>
				<div className="md:col-span-2 md:flex md:items-start md:justify-center">
					<StatusLabel
						size="small"
						status={remittance.status}
					/>
				</div>
			</div>
		</div>
	);
}

function Loading() {
	return (
		<div className="py-24 bg-white rounded border border-gray-500">
			<div className="flex gap-8 items-center justify-center bg-white px-12 py-6 rounded-md opacity-70">
				<CircularProgress size={20} />
				<Typography fontSize={14}>Loading...</Typography>
			</div>
		</div>
	);
}

function Empty() {
	return (
		<div className="py-28 bg-white rounded border border-gray-500 text-center">
			<Typography
				fontWeight="medium"
				fontSize={14}
				color="textSecondary"
			>
				Data tidak ditemukan
			</Typography>
		</div>
	);
}
