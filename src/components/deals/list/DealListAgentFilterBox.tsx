import { Accordion, AccordionDetails, AccordionSummary, Select, SelectChangeEvent } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { CountryCodeList } from '@/data/country-code';
import { DatePicker } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import Divider from '@mui/material/Divider';
import { Currency, DealFilter } from '@/types';
import React, { useMemo, useState } from 'react';
import { agentDownloadDeals } from '@/utils/apiCall';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { useSession } from 'next-auth/react';
import apiService from '@/store/apiService';

const statusList = {
	new: [
		{ label: 'Suggested', value: 'suggested' },
		{ label: 'Accepted', value: 'accepted' },
		{ label: 'Request For Terms', value: 'request_for_terms' }
	],
	accepted: [
		{ label: 'Waiting For Payment', value: 'waiting_for_payment' },
		{ label: 'Payment Made', value: 'payment_made' },
		{ label: 'Payment of Invoice', value: 'payment_of_invoice' },
		{ label: 'Return Sent', value: 'return_sent' }
	],
	archived: [
		{ label: 'Completed', value: 'completed' },
		{ label: 'Return', value: 'return' }
	]
};

export default function DealListAgentFilterBox({
	handleChangeFilter,
	filter,
	tabValue
}: {
	handleChangeFilter: (key: string, value: string) => void;
	filter: DealFilter;
	tabValue: string;
}) {
	const { data } = useSession();
	const { accessToken } = data;
	const { data: currenciesData } = apiService.useGetCurrenciesQuery({});
	const currencies = useMemo(() => (currenciesData ?? []) as Currency[], [currenciesData]);
	const cryptoCurrencies = currencies.filter((currency) => currency.category === 'crypto' && currency.is_enable);
	const fiatCurrencies = currencies.filter((currency) => currency.category === 'fiat' && currency.is_enable);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleDownload = (format: 'csv' | 'xlsx') => {
		setAnchorEl(null);
		const options = {
			format,
			...filter
		};
		agentDownloadDeals(accessToken, options).then((res) => {
			if (res.ok) {
				res.blob().then((blob) => {
					const url = window.URL.createObjectURL(blob);
					const tempLink = document.createElement('a');
					tempLink.href = url;
					tempLink.setAttribute('download', `${DateTime.now().toFormat('yyyy-MM-dd-hh')}.${format}`);
					tempLink.click();
					tempLink.remove();
				});
			}
		});
	};

	return (
		<Accordion
			defaultExpanded
			style={{
				width: '100%',
				backgroundColor: 'transparent',
				border: 'none',
				borderRadius: '0',
				boxShadow: 'none'
			}}
		>
			<AccordionSummary
				className="px-0"
				sx={{
					'&.Mui-focusVisible': {
						backgroundColor: 'transparent'
					}
				}}
			>
				<FormControl fullWidth>
					<TextField
						placeholder="Search"
						variant="outlined"
						fullWidth
						value={filter.search}
						onChange={(e) => handleChangeFilter('search', e.target.value)}
					/>
				</FormControl>
			</AccordionSummary>
			<AccordionDetails className="px-0">
				<div className="w-full flex items-center justify-start gap-8 mb-20">
					<div className="w-1/2">
						<FormControl fullWidth>
							<Select
								label="Country"
								variant="filled"
								onChange={(e: SelectChangeEvent) => handleChangeFilter('country', e.target.value)}
								fullWidth
								value={filter.country}
							>
								<MenuItem value="all">All Countries</MenuItem>
								<Divider />
								{CountryCodeList.map((country) => (
									<MenuItem
										key={country.code}
										value={country.code}
									>
										{country.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
					<div className="w-1/2">
						<FormControl fullWidth>
							<Select
								label="Status"
								variant="filled"
								value={filter.status}
								onChange={(e: SelectChangeEvent) => handleChangeFilter('status', e.target.value)}
								fullWidth
							>
								<MenuItem value="all">All Status</MenuItem>
								<Divider />
								{statusList?.[tabValue]?.map((s: { label: string; value: string }) => (
									<MenuItem
										key={s.value}
										value={s.value}
									>
										{s.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
				</div>
				<div className="w-full flex items-center justify-start gap-8">
					<div className="grow">
						<div className="w-full flex items-center justify-between gap-8">
							<FormControl fullWidth>
								<DatePicker
									label="Start Date"
									format="MM/dd/yyyy"
									onChange={(date) => {
										handleChangeFilter('start', DateTime.fromJSDate(date).toFormat('yyyy-MM-dd'));
									}}
								/>
							</FormControl>
							<FormControl fullWidth>
								<DatePicker
									label="End Date"
									format="MM/dd/yyyy"
									onChange={(date) => {
										handleChangeFilter('end', DateTime.fromJSDate(date).toFormat('yyyy-MM-dd'));
									}}
								/>
							</FormControl>
						</div>
					</div>
					<div className="grow">
						<FormControl fullWidth>
							<Select
								label="Currency"
								variant="filled"
								value={filter.currency}
								onChange={(e: SelectChangeEvent) => handleChangeFilter('currency', e.target.value)}
								fullWidth
							>
								<MenuItem value="all">All Currencies</MenuItem>
								<Divider />
								{fiatCurrencies.map((currency) => (
									<MenuItem
										key={currency.id}
										value={currency.id}
									>
										{currency.name} ({currency.symbol})
									</MenuItem>
								))}
								<Divider />
								{cryptoCurrencies.map((currency) => (
									<MenuItem
										key={currency.id}
										value={currency.id}
									>
										{currency.name} ({currency.symbol})
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
					<div className="grow">
						<div className="w-full flex items-center justify-between gap-8">
							<FormControl fullWidth>
								<TextField
									placeholder="Min Amount"
									variant="outlined"
									fullWidth
									type="number"
									value={filter.min}
									onChange={(e) => handleChangeFilter('min', e.target.value)}
								/>
							</FormControl>
							<FormControl fullWidth>
								<TextField
									placeholder="Max Amount"
									variant="outlined"
									fullWidth
									type="number"
									value={filter.max}
									onChange={(e) => handleChangeFilter('max', e.target.value)}
								/>
							</FormControl>
						</div>
					</div>
					{tabValue === 'accepted' && (
						<div className="grow">
							<Button
								variant="contained"
								color="primary"
								onClick={handleClick}
							>
								Download
							</Button>
							<Menu
								anchorEl={anchorEl}
								open={open}
								onClose={handleClose}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'right'
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right'
								}}
							>
								<MenuItem onClick={() => handleDownload('csv')}>Download as CSV</MenuItem>
								<MenuItem onClick={() => handleDownload('xlsx')}>Download as XLSX</MenuItem>
							</Menu>
						</div>
					)}
				</div>
			</AccordionDetails>
		</Accordion>
	);
}
