import { z } from 'zod';
import { Deal, DealPropose, AgentCompany, CalculateRequest } from '@/types';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { agentGetCompanies, agentCalculateDeal, agentSubmitTerms, getRates } from '@/utils/apiCall';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Button, CircularProgress } from '@mui/material';
import _ from 'lodash';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import DialogConfirm from '@/components/dialogs/DialogConfirm';
import InputAdornment from '@mui/material/InputAdornment';
import CurrencyField from '@/components/forms/fields/CurrencyField';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import apiService from '@/store/apiService';

const submitTermsSchema = z.object({
	date: z.string().min(1, 'Please select a date'),
	company_id: z.string().min(1, 'Please select a payment company'),
	direction: z.enum(['0', '1']),
	conversion_type: z.string().min(1, 'Please select conversion type'),
	conversion_rate: z.string().min(1, 'Please enter rate'),
	commission_percentage: z.string().min(1, 'Please enter commission percentage'),
	commission_fixed: z.string().min(1, 'Please enter a commission fixed'),
	total_received: z.string().min(1, 'Please enter total received')
});

export default function AgentRequestTermAction({
	deal,
	fetch
}: {
	deal: Deal;
	fetch: (dealId: string, accessToken: string) => void;
}) {
	const {
		data: { accessToken }
	} = useSession();
	const [companies, setCompanies] = useState<AgentCompany[]>([]);
	const dispatch = useAppDispatch();
	const { control, watch, handleSubmit, formState, setValue } = useForm<DealPropose>({
		mode: 'all',
		resolver: zodResolver(submitTermsSchema),
		defaultValues: {
			date: '',
			company_id: '',
			direction: '0',
			conversion_type: deal.from_currency + '_' + deal.to_currency,
			conversion_rate: '',
			commission_percentage: '',
			commission_fixed: '0',
			total_received: ''
		}
	});
	const form = watch();
	const { direction } = form;
	const { conversion_type, conversion_rate, commission_percentage, commission_fixed, total_received } = form;
	const { isValid, dirtyFields, errors } = formState;
	const [submitting, setSubmitting] = useState(false);
	const [syncRates, { isLoading }] = apiService.useSyncRatesMutation();

	const fetchCompanies = () => {
		agentGetCompanies(accessToken)
			.then((resp) => {
				if (resp.status === 'success') {
					setCompanies(resp.data as AgentCompany[]);
				}
			})
			.catch((err) => console.error(err));
	};

	const fetchRates = () => {
		getRates(deal.from_currency, deal.to_currency, 1, 'idr')
			.then((resp) => {
				if (resp.status === 'success') {
					const data = resp?.data as number;
					setValue('conversion_rate', data.toString());
				}
			})
			.catch((err) => console.error(err));
	};

	const calculate = () => {
		agentCalculateDeal(deal.id, form, accessToken)
			.then((resp) => {
				if (resp.status === 'success') {
					const data = resp?.data as CalculateRequest;

					if (data.direction === '0') {
						setValue('total_received', data.total_received);
					} else {
						setValue('conversion_rate', data.conversion_rate);
					}
				}
			})
			.catch((err) => console.error(err));
	};

	useEffect(() => {
		fetchRates();
		fetchCompanies();
	}, []);

	useEffect(() => {
		if (direction === '0' && conversion_rate && Number(conversion_rate) > 0) {
			calculate();
			return;
		}

		if (
			direction === '1' &&
			total_received &&
			Number(total_received) > 0 &&
			Number(total_received) > Number(commission_fixed)
		) {
			calculate();
			return;
		}
	}, [direction, conversion_type, conversion_rate, commission_percentage, commission_fixed, total_received]);

	const onSubmit = useCallback(() => {
		if (submitting) {
			return;
		}

		dispatch(
			openDialog({
				fullWidth: false,
				children: (
					<DialogConfirm
						message="Are you sure want to submit the terms ?"
						onConfirm={() => {
							setSubmitting(true);

							agentSubmitTerms(deal.id, form, accessToken)
								.then((resp) => {
									if (resp.status === 'success') {
										dispatch(
											showMessage({ message: 'Terms has been submited', variant: 'success' })
										);
										fetch(deal.id, accessToken);
									} else {
										dispatch(
											showMessage({
												message: resp?.message ?? 'Failed to submit term',
												variant: 'error'
											})
										);
									}
								})
								.catch((error) => {
									dispatch(
										showMessage({
											message: error?.message ?? 'Failed to submit term',
											variant: 'error'
										})
									);
								})
								.finally(() => {
									setSubmitting(false);
								});
						}}
					/>
				)
			})
		);
	}, [form]);

	const handleRateSync = async () => {
		if (isLoading) {
			return;
		}

		const { error } = await syncRates({});

		if (!error) {
			fetchRates();
		}
	};

	return (
		<div className="mt-24 flex flex-col items-center justify-between gap-8 bg-gray-300 rounded p-12">
			<div className="w-full flex gap-12 mb-8">
				<div className="w-2/3 flex gap-12">
					<div className="w-3/12 shadow border p-12">
						<h4 className="font-bold mb-8">Date</h4>
						<Controller
							control={control}
							name="date"
							render={({ field }) => (
								<TextField
									{...field}
									error={!!errors.date}
									helperText={errors?.date?.message}
									variant="outlined"
									required
									id="date"
									fullWidth
									type="date"
								/>
							)}
						/>
					</div>
					<div className="w-4/12 shadow border p-12">
						<div className="mb-8 flex items-center justify-between gap-6">
							<h4 className="font-bold">Transaction rate</h4>
							{isLoading ? (
								<CircularProgress size={16} />
							) : (
								<FuseSvgIcon
									size={16}
									className="hover:cursor-pointer active:text-blue-500"
									onClick={handleRateSync}
								>
									heroicons-outline:arrow-path
								</FuseSvgIcon>
							)}
						</div>
						<div className="flex gap-4">
							<Controller
								control={control}
								name="conversion_rate"
								render={({ field: { onChange, ...rest } }) => (
									<TextField
										{...rest}
										className="w-1/2"
										error={!!errors.conversion_rate}
										helperText={errors?.conversion_rate?.message}
										variant="outlined"
										required
										id="conversion_rate"
										fullWidth
										type="number"
										slotProps={{
											htmlInput: {
												min: 0
											}
										}}
										onChange={(e) => {
											setValue('direction', '0');
											onChange(e);
										}}
									/>
								)}
							/>
							<Controller
								control={control}
								name="conversion_type"
								render={({ field }) => (
									<TextField
										{...field}
										className="w-1/2"
										error={!!errors.conversion_type}
										helperText={errors?.conversion_type?.message}
										variant="outlined"
										required
										id="conversion_type"
										fullWidth
										select
									>
										<MenuItem value={deal.from_currency + '_' + deal.to_currency}>
											{deal.from_currency} / {deal.to_currency}
										</MenuItem>
										<MenuItem value={deal.to_currency + '_' + deal.from_currency}>
											{deal.to_currency} / {deal.from_currency}
										</MenuItem>
									</TextField>
								)}
							/>
						</div>
					</div>
					<div className="w-5/12 shadow border p-12">
						<h4 className="font-bold mb-8">Commission</h4>
						<div className="flex gap-4">
							<Controller
								control={control}
								name="commission_percentage"
								render={({ field: { onChange, ...rest } }) => (
									<TextField
										{...rest}
										error={!!errors.commission_percentage}
										helperText={errors?.commission_percentage?.message}
										variant="outlined"
										required
										id="commission_percentage"
										fullWidth
										type="number"
										className="w-5/12"
										slotProps={{
											htmlInput: {
												min: 0
											},
											input: {
												endAdornment: <InputAdornment position="end">%</InputAdornment>
											}
										}}
										onChange={(e) => {
											onChange(e);
										}}
									/>
								)}
							/>
							<Controller
								control={control}
								name="commission_fixed"
								render={({ field: { onChange, ...rest } }) => (
									<TextField
										{...rest}
										error={!!errors.commission_fixed}
										helperText={errors?.commission_fixed?.message}
										variant="outlined"
										required
										id="commission_fixed"
										fullWidth
										type="number"
										className="w-7/12"
										slotProps={{
											input: {
												startAdornment: <InputAdornment position="start">Fix</InputAdornment>,
												endAdornment: (
													<InputAdornment position="end">{deal.from_currency}</InputAdornment>
												)
											},
											htmlInput: {
												min: 0
											}
										}}
										onChange={(e) => {
											onChange(e);
										}}
									/>
								)}
							/>
						</div>
					</div>
				</div>
				<div className="w-1/3 flex gap-12">
					<div className="w-1/2 shadow border p-12">
						<h4 className="font-bold mb-8">Total Received</h4>
						<Controller
							control={control}
							name="total_received"
							render={({ field: { onChange, ...rest } }) => (
								<CurrencyField
									{...rest}
									error={!!errors.total_received}
									helperText={errors?.total_received?.message}
									variant="outlined"
									required
									id="total_received"
									fullWidth
									onChange={(e) => {
										setValue('direction', '1');
										onChange(e);
									}}
									slotProps={{
										input: {
											endAdornment: (
												<InputAdornment position="end">{deal.from_currency}</InputAdornment>
											)
										}
									}}
								/>
							)}
						/>
					</div>
					<div className="w-1/2 shadow border p-12">
						<h4 className="font-bold mb-8">Total Paid</h4>
						<CurrencyField
							variant="outlined"
							id="total_received"
							value={deal.to_amount}
							fullWidth
							slotProps={{
								input: {
									readOnly: true,
									endAdornment: <InputAdornment position="end">{deal.to_currency}</InputAdornment>
								}
							}}
						/>
					</div>
				</div>
			</div>
			<div className="w-full shadow border p-12 mb-8">
				<Controller
					control={control}
					name="company_id"
					render={({ field }) => (
						<TextField
							{...field}
							select
							label="Select Counterparty"
							error={!!errors.company_id}
							helperText={errors?.company_id?.message}
							variant="outlined"
							required
							id="company_id"
							fullWidth
						>
							{companies.map((option) => (
								<MenuItem
									key={'company_' + option.id}
									value={option.id}
								>
									{option.name}
								</MenuItem>
							))}
						</TextField>
					)}
				/>
			</div>
			<div className="w-full flex items-center justify-between">
				<div className="w-3/4"></div>
				<div className="w-1/4 flex flex-col gap-8">
					<div className="flex gap-6">
						<Button
							variant="contained"
							color="success"
							fullWidth
							disabled={_.isEmpty(dirtyFields) || !isValid || submitting || isLoading}
							onClick={handleSubmit(onSubmit)}
						>
							Submit
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
