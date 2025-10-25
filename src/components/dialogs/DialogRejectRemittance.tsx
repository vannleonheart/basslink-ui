import { Button, DialogContent, MenuItem, TextField } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { closeDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { Remittance } from '@/types/entity';
import apiService from '@/store/apiService';
import { RejectRemittanceFormData } from '@/types/form';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RejectionReasons } from '@/data/static-data';
import _ from 'lodash';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { ApiResponse, AuthComponentProps } from '@/types/component';
import { t } from 'i18next';
import useNavigate from '@fuse/hooks/useNavigate';

type DialogRejectRemittanceProps = AuthComponentProps & {
	message?: string;
	fieldLabel?: string;
	data: Remittance;
};

const schema = z.object({
	reason: z.string().min(1, 'Pilih alasan pembatalan/penolakan')
});

export default function DialogRejectRemittance({
	message,
	fieldLabel,
	data,
	accessToken,
	side
}: DialogRejectRemittanceProps) {
	const dispatch = useDispatch();
	const [rejectSubmittedRemittance] = apiService.useRejectSubmittedRemittanceMutation();
	const { control, formState, handleSubmit } = useForm<RejectRemittanceFormData>({
		mode: 'onChange',
		defaultValues: {
			reason: ''
		},
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	const navigate = useNavigate();

	if (!message || !message.length) {
		message = 'Apakah Anda yakin untuk membatalkan pengiriman dana ini?';
	}

	if (!fieldLabel || !fieldLabel.length) {
		fieldLabel = 'Alasan Pembatalan';
	}

	const handleReject = async (formData: RejectRemittanceFormData) => {
		const { error } = await rejectSubmittedRemittance({
			id: data.id,
			side,
			accessToken,
			data: formData
		});

		dispatch(closeDialog());

		if (error) {
			const errorData = error as { data: ApiResponse };
			dispatch(
				showMessage({
					variant: 'error',
					message: t(errorData?.data?.message)
				})
			);
			return;
		}

		navigate('/remittances/submissions');
	};

	return (
		<React.Fragment>
			<DialogContent>
				<div className="flex items-center justify-start">
					<div className="flex flex-col items-center justify-start">
						<div className="mb-12">{message}</div>
						<form
							name="reject-remittance-form"
							className="w-full gap-20"
							onSubmit={handleSubmit(handleReject)}
						>
							<Controller
								name="reason"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										error={!!errors.reason}
										helperText={errors?.reason?.message}
										margin="dense"
										id="reason"
										label={fieldLabel}
										fullWidth
										required
										className="mb-12"
										select
									>
										{Object.entries(RejectionReasons).map(([value, label]) => (
											<MenuItem
												key={value}
												value={value}
											>
												{label}
											</MenuItem>
										))}
									</TextField>
								)}
							/>
							<div className="w-full flex items-center justify-center gap-12">
								<Button
									variant="contained"
									color="primary"
									type="submit"
									disabled={_.isEmpty(dirtyFields) || !isValid}
								>
									Yes
								</Button>
								<Button
									variant="outlined"
									onClick={() => dispatch(closeDialog())}
								>
									No
								</Button>
							</div>
						</form>
					</div>
				</div>
			</DialogContent>
		</React.Fragment>
	);
}
