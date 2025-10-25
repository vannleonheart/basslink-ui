import { Button, DialogContent, TextField } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { closeDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { Remittance } from '@/types/entity';
import apiService from '@/store/apiService';
import { CompleteRemittanceFormData } from '@/types/form';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from 'lodash';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { ApiResponse, AuthComponentProps } from '@/types/component';
import { t } from 'i18next';
import useNavigate from '@fuse/hooks/useNavigate';
import FileUploadInput from '../forms/fields/FileUploadInput';

type DialogCompleteRemittanceProps = AuthComponentProps & {
	data: Remittance;
};

const schema = z.object({
	date: z.string().min(1, 'Tanggal wajib diisi'),
	reference: z.string().min(1, 'Referensi wajib diisi'),
	notes: z.optional(z.string().or(z.literal(''))),
	receipt: z.string().min(1, 'Bukti penerimaan wajib diisi')
});

export default function DialogCompleteRemittance({ data, accessToken, side }: DialogCompleteRemittanceProps) {
	const dispatch = useDispatch();
	const [completeRemittance] = apiService.useCompleteRemittanceMutation();
	const { control, formState, handleSubmit, setValue } = useForm<CompleteRemittanceFormData>({
		mode: 'onChange',
		defaultValues: {
			date: '',
			reference: '',
			notes: '',
			receipt: ''
		},
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	const navigate = useNavigate();

	const handleComplete = async (formData: CompleteRemittanceFormData) => {
		const { error } = await completeRemittance({
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

		navigate('/remittances/list');
	};

	return (
		<React.Fragment>
			<DialogContent>
				<div className="flex items-center justify-start">
					<div className="flex flex-col items-center justify-start">
						<div className="mb-12">Apakah Anda yakin untuk menyelesaikan pengiriman dana ini?</div>
						<form
							name="complete-remittance-form"
							className="w-full gap-12"
							onSubmit={handleSubmit(handleComplete)}
						>
							<Controller
								name="date"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										error={!!errors.date}
										helperText={errors?.date?.message}
										margin="dense"
										id="date"
										label="Tanggal Pengiriman Dana"
										fullWidth
										required
										type="date"
										slotProps={{
											inputLabel: { shrink: true }
										}}
									/>
								)}
							/>
							<div className="my-12">
								<Controller
									name="receipt"
									control={control}
									render={({ field }) => (
										<FileUploadInput
											{...field}
											error={!!errors.receipt}
											helperText={errors?.receipt?.message}
											autoFocus
											id="receipt"
											label="Bukti Pengiriman Dana"
											variant="outlined"
											fullWidth
											required
											onChange={(value) => setValue('receipt', value)}
											accept="image/*"
										/>
									)}
								/>
							</div>
							<Controller
								name="reference"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										error={!!errors.reference}
										helperText={errors?.reference?.message}
										margin="dense"
										id="reference"
										label="No Referensi"
										fullWidth
										required
									/>
								)}
							/>
							<Controller
								name="notes"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										error={!!errors.notes}
										helperText={errors?.notes?.message}
										margin="dense"
										id="notes"
										label="Catatan"
										fullWidth
										multiline
										minRows={3}
										maxRows={5}
									/>
								)}
							/>

							<div className="w-full flex items-center justify-center gap-12 mt-24">
								<Button
									variant="contained"
									color="success"
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
