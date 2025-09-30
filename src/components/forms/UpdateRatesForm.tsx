import apiService from '@/store/apiService';
import { useAppDispatch } from '@/store/hooks';
import { ApiResponse, AuthComponentProps, Rate, UpdateRatesFormData } from '@/types/entity';
import { closeDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Alert, Button, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

type UpdateRatesFormProps = Partial<AuthComponentProps> & {
	rate: Rate;
};

export default function UpdateRatesForm({ rate, accessToken, fetch }: UpdateRatesFormProps) {
	const dispatch = useAppDispatch();
	const { control, formState, handleSubmit, setError } = useForm<UpdateRatesFormData>({
		defaultValues: {
			source: rate.source,
			from: rate.from,
			to: rate.to,
			rate_buy: rate.rate_buy,
			rate_sell: rate.rate_sell,
			spread_percentage: rate.spread_percentage,
			spread_fixed: rate.spread_fixed
		}
	});
	const { isValid, dirtyFields, errors } = formState;
	const [updateRates, { isLoading }] = apiService.useUpdateRatesMutation();

	const onSubmit = async (data: UpdateRatesFormData) => {
		const { error } = await updateRates({
			accessToken,
			data
		});

		if (error) {
			const errorData = error as { data: ApiResponse };
			setError('root', {
				type: 'manual',
				message: errorData?.data?.message
			});
			return false;
		}

		if (fetch) {
			fetch();
		}

		dispatch(closeDialog());
	};

	return (
		<form
			id="ratesUpdateForm"
			onSubmit={handleSubmit(onSubmit)}
		>
			<DialogTitle>
				<div className="flex items-center gap-6">
					<FuseSvgIcon size={16}>heroicons-outline:pencil-square</FuseSvgIcon>
					<Typography>Update Rates</Typography>
				</div>
			</DialogTitle>
			<DialogContent>
				{errors?.root?.message && (
					<Alert
						className="my-16"
						severity="error"
						sx={(theme) => ({
							backgroundColor: theme.palette.error.light,
							color: theme.palette.error.dark
						})}
					>
						{errors?.root?.message}
					</Alert>
				)}
				<div className="mt-6 mb-20 flex items-center justify-between gap-6">
					<TextField
						label="From"
						fullWidth
						defaultValue={rate.from.toUpperCase()}
						slotProps={{
							input: {
								readOnly: true
							}
						}}
					/>
					<TextField
						label="To"
						fullWidth
						defaultValue={rate.to.toUpperCase()}
						slotProps={{
							input: {
								readOnly: true
							}
						}}
					/>
				</div>
				<div className="mb-20 flex items-center justify-between gap-6">
					<Controller
						name="rate_buy"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								error={!!errors.rate_buy}
								helperText={errors?.rate_buy?.message}
								autoFocus
								id="rate_buy"
								label="Rate Buy"
								fullWidth
								required
							/>
						)}
					/>
					<Controller
						name="rate_sell"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								error={!!errors.rate_sell}
								helperText={errors?.rate_sell?.message}
								id="rate_sell"
								label="Rate Sell"
								fullWidth
								required
							/>
						)}
					/>
				</div>
				<div className="flex items-center justify-between gap-6">
					<Controller
						name="spread_percentage"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								error={!!errors.spread_percentage}
								helperText={errors?.spread_percentage?.message}
								id="spread_percentage"
								label="Spread Percentage"
								fullWidth
								required
							/>
						)}
					/>
					<Controller
						name="spread_fixed"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								error={!!errors.spread_fixed}
								helperText={errors?.spread_fixed?.message}
								id="spread_fixed"
								label="Spread Fixed"
								fullWidth
								required
							/>
						)}
					/>
				</div>
			</DialogContent>
			<DialogActions>
				<Button
					color="primary"
					variant="contained"
					disabled={_.isEmpty(dirtyFields) || !isValid || isLoading}
					type="submit"
				>
					Save
				</Button>
			</DialogActions>
		</form>
	);
}
