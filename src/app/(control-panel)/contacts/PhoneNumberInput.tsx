import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Controller, useForm } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CountryCodeSelector from './CountryCodeSelector';
import { ClientContactPhone } from '@/types';

const schema = z.object({
	phone_code: z.string().optional(),
	phone_no: z.string().optional(),
	label: z.string().optional()
});

const defaultValues = {
	phone_code: '',
	phone_no: '',
	label: ''
};

type PhoneNumberInputProps = {
	value: ClientContactPhone;
	onChange: (T: ClientContactPhone) => void;
	onRemove: (T: ClientContactPhone) => void;
	hideRemove?: boolean;
	error?: boolean;
};

function PhoneNumberInput(props: PhoneNumberInputProps) {
	const { value, hideRemove = false, onChange, onRemove } = props;
	const { control, formState, handleSubmit, reset } = useForm<ClientContactPhone>({
		mode: 'all',
		defaultValues,
		resolver: zodResolver(schema)
	});
	const { errors } = formState;

	useEffect(() => {
		reset(value);
	}, [reset, value]);

	function onSubmit(data: ClientContactPhone) {
		onChange(data);
	}

	return (
		<form
			className="flex space-x-16 mb-16"
			onChange={handleSubmit(onSubmit)}
		>
			<Controller
				control={control}
				name="phone_no"
				render={({ field }) => (
					<TextField
						{...field}
						label="Phone Number"
						placeholder="Phone Number"
						variant="outlined"
						fullWidth
						error={!!errors.phone_no}
						helperText={errors?.phone_no?.message}
						InputProps={{
							startAdornment: (
								<Controller
									control={control}
									name="phone_code"
									render={({ field: _field }) => (
										<InputAdornment position="start">
											<CountryCodeSelector {..._field} />
										</InputAdornment>
									)}
								/>
							)
						}}
					/>
				)}
			/>
			<Controller
				control={control}
				name="label"
				render={({ field }) => (
					<TextField
						{...field}
						label="Label"
						placeholder="Label"
						variant="outlined"
						fullWidth
						error={!!errors.label}
						helperText={errors?.label?.message}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<FuseSvgIcon size={20}>heroicons-solid:tag</FuseSvgIcon>
								</InputAdornment>
							)
						}}
					/>
				)}
			/>
			{!hideRemove && (
				<IconButton
					onClick={(ev) => {
						ev.stopPropagation();
						onRemove(value);
					}}
				>
					<FuseSvgIcon size={20}>heroicons-solid:trash</FuseSvgIcon>
				</IconButton>
			)}
		</form>
	);
}

export default PhoneNumberInput;
