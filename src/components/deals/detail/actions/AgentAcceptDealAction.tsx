import { AcceptDealFormData, AgentCompany, Deal } from '@/types';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import useNavigate from '@fuse/hooks/useNavigate';
import { agentAcceptDeal, agentGetCompanies, agentRejectDeal } from '@/utils/apiCall';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { Button } from '@mui/material';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import DialogConfirm from '@/components/dialogs/DialogConfirm';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import _ from 'lodash';

const submitTermsSchema = z.object({
	company_id: z.string().min(1, 'Please select a payment company'),
	due_date: z.string().min(1, 'Please select transfer date')
});

export default function AgentAcceptDealAction({
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
	const { control, watch, handleSubmit, formState } = useForm<AcceptDealFormData>({
		mode: 'all',
		resolver: zodResolver(submitTermsSchema),
		defaultValues: {
			company_id: '',
			due_date: ''
		}
	});
	const form = watch();
	const { isValid, dirtyFields, errors } = formState;
	const [submitting, setSubmitting] = useState(false);
	const [companies, setCompanies] = useState<AgentCompany[]>([]);

	const fetchCompanies = () => {
		agentGetCompanies(accessToken)
			.then((resp) => {
				if (resp.status === 'success') {
					setCompanies(resp.data as AgentCompany[]);
				}
			})
			.catch((err) => console.error(err));
	};

	useEffect(() => {
		fetchCompanies();
	}, []);

	const handleRejectDeal = async () => {
		dispatch(
			openDialog({
				fullWidth: false,
				children: (
					<DialogConfirm
						message="Are you sure want to reject this deal ?"
						onConfirm={() => {
							agentRejectDeal(deal.id, accessToken)
								.then((resp) => {
									if (resp.status === 'success') {
										dispatch(showMessage({ message: 'Deal rejected', variant: 'success' }));
										navigate('/deals');
									} else {
										dispatch(
											showMessage({
												message: resp?.message ?? 'Failed to reject deal',
												variant: 'error'
											})
										);
									}
								})
								.catch((err) => {
									dispatch(
										showMessage({
											message: err?.message ?? 'Failed to reject deal',
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

	const handleAcceptDeal = async () => {
		if (submitting) {
			return;
		}

		dispatch(
			openDialog({
				fullWidth: false,
				children: (
					<DialogConfirm
						message="Are you sure want to accept this deal ?"
						onConfirm={() => {
							setSubmitting(true);

							agentAcceptDeal(deal.id, form, accessToken)
								.then((resp) => {
									if (resp.status === 'success') {
										dispatch(showMessage({ message: 'Deal accepted', variant: 'success' }));
										fetch(deal.id, accessToken);
									} else {
										dispatch(
											showMessage({
												message: resp?.message ?? 'Failed to accept deal',
												variant: 'error'
											})
										);
									}
								})
								.catch((err) => {
									dispatch(
										showMessage({
											message: err?.message ?? 'Failed to accept deal',
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

	return (
		<div className="mt-24 flex items-center justify-between bg-gray-300 rounded p-12 space-x-120">
			<div className="w-3/4">
				<div className="mb-16">Please make sure all the details are correct before proceeding.</div>
				<div className="flex items-start justify-between space-x-24">
					<div className="w-1/3">
						<Controller
							control={control}
							name="due_date"
							render={({ field }) => (
								<TextField
									{...field}
									error={!!errors.due_date}
									helperText={errors?.due_date?.message}
									variant="outlined"
									required
									id="due_date"
									fullWidth
									type="date"
								/>
							)}
						/>
					</div>
					<div className="w-2/3">
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
				</div>
			</div>
			<div className="w-1/4 flex flex-col gap-8">
				<div className="flex gap-6">
					<Button
						variant="contained"
						color="success"
						fullWidth
						disabled={_.isEmpty(dirtyFields) || !isValid || submitting}
						onClick={handleSubmit(handleAcceptDeal)}
					>
						Accept
					</Button>
				</div>
				<Button
					variant="contained"
					color="error"
					fullWidth
					onClick={handleRejectDeal}
				>
					Reject
				</Button>
			</div>
		</div>
	);
}
