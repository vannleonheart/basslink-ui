import { Button } from '@mui/material';
import { AgentCompanyAccount, Deal, PaymentInvoiceRequest } from '@/types/entity';
import {
	agentGetCompanyAccounts,
	agentConfirmInvoicePayment,
	agentConfirmReturnSent,
	agentUploadFiles
} from '@/utils/apiCall';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import DialogConfirm from '@/components/dialogs/DialogConfirm';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { z } from 'zod';
import _ from 'lodash';
import { Delete } from '@mui/icons-material';

const submitPaymentInvoiceSchema = z.object({
	company_id: z.string().min(1, 'Please select a payer'),
	company_account_id: z.string().min(1, 'Please select a payer account')
});

export default function AgentConfirmInvoicePaymentOrReturnAction({
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
	const [companyAccounts, setCompanyAccounts] = useState<AgentCompanyAccount[]>([]);
	const [selectedPaymentAccount, setSelectedPaymentAccount] = useState<AgentCompanyAccount | null>(null);
	const { control, watch, handleSubmit, formState, getValues, setValue } = useForm<PaymentInvoiceRequest>({
		mode: 'all',
		resolver: zodResolver(submitPaymentInvoiceSchema),
		defaultValues: {
			company_id: deal.agent_company_id,
			company_account_id: '',
			files: []
		}
	});
	const form = watch();
	const { company_account_id } = form;
	const { isValid, dirtyFields, errors } = formState;
	const [submitting, setSubmitting] = useState(false);
	const [uploading, setUploading] = useState(false);
	const uploadInputRef = useRef<HTMLInputElement>(null);

	const fetchCompanyAccounts = () => {
		agentGetCompanyAccounts(deal.agent_company_id, accessToken)
			.then((resp) => {
				if (resp.status === 'success') {
					setCompanyAccounts(resp.data as AgentCompanyAccount[]);
				}
			})
			.catch((err) => console.error(err));
	};

	const handleUploadFiles = async (e: ChangeEvent<HTMLInputElement>) => {
		function readFileAsync() {
			return new Promise<void>((resolve, reject) => {
				const files = e?.target?.files;

				if (!files || !files.length) {
					return resolve();
				}

				agentUploadFiles(Array.from(files), accessToken)
					.then((result) => {
						if (result.status === 'success') {
							const prevFiles = getValues('files');
							const uploadedFiles = result?.data as {
								files: string[];
							};
							const newFiles = [...prevFiles, ...uploadedFiles.files];

							setValue('files', newFiles);

							return resolve();
						} else {
							return reject(result.message);
						}
					})
					.finally(() => {
						setUploading(false);
					});
			});
		}

		try {
			await readFileAsync();
		} catch (error) {
			dispatch(showMessage({ message: error?.message ?? 'Failed to upload files', variant: 'error' }));
		}
	};

	const handleRemoveFile = (index: number) => {
		const files = getValues('files');
		const newFiles = files.filter((_, i) => i !== index);

		setValue('files', newFiles);
	};

	useEffect(() => {
		fetchCompanyAccounts();
	}, []);

	useEffect(() => {
		if (company_account_id && company_account_id.length && companyAccounts && companyAccounts.length) {
			const selectedAccount = companyAccounts.find((account) => account.id === company_account_id);
			setSelectedPaymentAccount(selectedAccount ?? null);
		}
	}, [company_account_id]);

	const handleInvoicePayment = () => {
		if (submitting) {
			return;
		}

		setSubmitting(true);

		dispatch(
			openDialog({
				fullWidth: false,
				children: (
					<DialogConfirm
						message="Are you sure want to confirm this invoice payment ?"
						onConfirm={() => {
							agentConfirmInvoicePayment(deal.id, form, accessToken)
								.then((response) => {
									if (response.status === 'success') {
										dispatch(
											showMessage({
												message: 'Deal invoice payment was confirmed',
												variant: 'success'
											})
										);
										fetch(deal.id, accessToken);
									} else {
										dispatch(
											showMessage({
												message: response?.message ?? 'Failed to confirm invoice payment',
												variant: 'error'
											})
										);
									}
								})
								.catch((err) =>
									dispatch(
										showMessage({
											message: err?.message ?? 'Failed to confirm invoice payment',
											variant: 'error'
										})
									)
								)
								.finally(() => {
									setSubmitting(false);
								});
						}}
					/>
				)
			})
		);
	};

	const handleReturnSent = () => {
		dispatch(
			openDialog({
				fullWidth: false,
				children: (
					<DialogConfirm
						message="Are you sure want to confirm the return ?"
						onConfirm={() => {
							agentConfirmReturnSent(deal.id, accessToken)
								.then((response) => {
									if (response.status === 'success') {
										dispatch(
											showMessage({
												message: 'Return was confirmed',
												variant: 'success'
											})
										);
										fetch(deal.id, accessToken);
									} else {
										dispatch(
											showMessage({
												message: response?.message ?? 'Failed to confirm the return',
												variant: 'error'
											})
										);
									}
								})
								.catch((err) =>
									dispatch(
										showMessage({
											message: err?.message ?? 'Failed to confirm the return',
											variant: 'error'
										})
									)
								);
						}}
					/>
				)
			})
		);
	};

	return (
		<div>
			<div className="mt-24 flex gap-12">
				<div className="w-1/2 flex flex-col gap-20 bg-gray-300 shadow-2 rounded p-20">
					<div>
						<div className="font-bold mb-6">Payment Account</div>
						<Controller
							control={control}
							name="company_account_id"
							render={({ field }) => (
								<TextField
									{...field}
									error={!!errors.company_account_id}
									helperText={errors?.company_account_id?.message}
									variant="outlined"
									required
									id="payer_account_id"
									fullWidth
									select
								>
									{companyAccounts.map((account) => (
										<MenuItem
											key={account.id}
											value={account.id}
										>
											{account.account_type === 'crypto'
												? account.label ??
													account.currency + '-' + account.network + '-' + account.account_no
												: account.label ?? account.bank_name + '-' + account.account_no}
										</MenuItem>
									))}
								</TextField>
							)}
						/>
					</div>
					<div>
						<div className="font-bold mb-6">Upload Documents</div>
						<Button
							variant="contained"
							color="primary"
							fullWidth
							onClick={() => uploadInputRef.current?.click()}
						>
							Upload
						</Button>
						<input
							ref={uploadInputRef}
							onChange={handleUploadFiles}
							type="file"
							accept="image/*,.pdf,.docx"
							multiple
							hidden
						/>
						{
							<div className="flex gap-8">
								{form.files.map((file, index) => (
									<div
										key={index}
										className="mt-12 flex items-center gap-12 text-sm border border-gray-500 p-8 rounded-lg"
									>
										<div>
											{file.length > 20 ? file.slice(0, 10) + '...' + file.slice(-10) : file}
										</div>
										<div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-lg cursor-pointer">
											<Delete
												className="hover:text-red-500"
												fontSize="small"
												onClick={() => handleRemoveFile(index)}
											/>
										</div>
									</div>
								))}
							</div>
						}
					</div>
				</div>
				<div className="w-1/2 flex flex-col gap-8 bg-gray-300 shadow-2 rounded p-12">
					<div className="font-bold">Payment Account Detail</div>
					{selectedPaymentAccount?.account_type === 'crypto' && (
						<div className="flex flex-col gap-8">
							<div className="flex gap-12">
								<span className="w-1/5 font-bold">Currency</span>
								<span>{selectedPaymentAccount.currency}</span>
							</div>
							<div className="flex gap-12">
								<span className="w-1/5 font-bold">Network</span>
								<span>{selectedPaymentAccount.network}</span>
							</div>
							<div className="flex gap-12">
								<span className="w-1/5 font-bold">Address</span>
								<span>{selectedPaymentAccount.account_no}</span>
							</div>
						</div>
					)}
					{selectedPaymentAccount?.account_type === 'fiat' && (
						<div className="flex flex-col gap-8">
							<div className="flex gap-12">
								<span className="w-1/5 font-bold">Bank Name</span>
								<span>{selectedPaymentAccount.bank_name}</span>
							</div>
							<div className="flex gap-12">
								<span className="w-1/5 font-bold">IBAN</span>
								<span>{selectedPaymentAccount.account_no}</span>
							</div>
							<div className="flex gap-12">
								<span className="w-1/5 font-bold">Bank Country</span>
								<span>{selectedPaymentAccount.bank_country}</span>
							</div>
							<div className="flex gap-12">
								<span className="w-1/5 font-bold">Bank SWIFT</span>
								<span>{selectedPaymentAccount.bank_swift_code}</span>
							</div>
							<div className="flex gap-12">
								<span className="w-1/5 font-bold">Bank Address</span>
								<span>{selectedPaymentAccount.bank_address}</span>
							</div>
						</div>
					)}
				</div>
			</div>
			<div className="mt-12 flex items-center justify-between gap-8 bg-gray-300 rounded p-20">
				<div className="w-3/4">Please make sure all the details are correct before proceeding.</div>
				<div className="w-1/4 flex flex-col gap-8">
					<div className="flex gap-6">
						<Button
							variant="contained"
							color="warning"
							fullWidth
							onClick={handleReturnSent}
						>
							Return Sent
						</Button>
					</div>
					<div className="flex gap-6">
						<Button
							variant="contained"
							color="success"
							fullWidth
							disabled={_.isEmpty(dirtyFields) || !isValid || submitting || uploading}
							onClick={handleSubmit(handleInvoicePayment)}
						>
							Invoice Paid
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
