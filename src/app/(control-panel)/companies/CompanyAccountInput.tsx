import TextField from '@mui/material/TextField';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Controller, useForm } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AgentCompanyAccount } from '@/types';
import MenuItem from '@mui/material/MenuItem';
import { CountryCodeList } from '@/data/country-code';
import { CryptoCurrency, CryptoCurrencyNetworks } from '@/data/currency';

const schema = z
	.object({
		id: z.string().optional().nullable(),
		agent_id: z.string().optional().nullable(),
		agent_company_id: z.string().optional().nullable(),
		account_type: z.enum(['fiat', 'crypto']),
		account_no: z.string().min(1, { message: 'IBAN/Wallet address is required' }),
		bank_country: z.string(),
		bank_name: z.string(),
		bank_swift_code: z.string(),
		bank_address: z.string(),
		currency: z.string(),
		network: z.string(),
		label: z.string().optional().nullable()
	})
	.superRefine((data) => {
		if (data.account_type === 'fiat') {
			return data.bank_country && data.bank_name && data.bank_swift_code && data.bank_address;
		}

		if (data.account_type === 'crypto') {
			return data.currency && data.network;
		}

		return true;
	});

type CompanyAccountInputProps = {
	value: AgentCompanyAccount;
	onChange: (T: AgentCompanyAccount) => void;
	onRemove: (T: AgentCompanyAccount) => void;
	hideRemove?: boolean;
	error?: boolean;
};

function CompanyAccountInput(props: CompanyAccountInputProps) {
	const { value, hideRemove = false, onChange, onRemove, id } = props;
	const { control, formState, handleSubmit, watch } = useForm<AgentCompanyAccount>({
		mode: 'all',
		resolver: zodResolver(schema),
		defaultValues: {
			id: value?.id ?? null,
			agent_id: value?.agent_id ?? '',
			agent_company_id: value?.agent_company_id ?? '',
			account_type: value?.account_type ?? '',
			account_no: value?.account_no ?? '',
			bank_country: value?.bank_country ?? '',
			bank_name: value?.bank_name ?? '',
			bank_swift_code: value?.bank_swift_code ?? '',
			bank_address: value?.bank_address ?? '',
			currency: value?.currency ?? '',
			network: value?.network ?? '',
			label: value?.label ?? ''
		}
	});
	const form = watch();
	const { account_type } = form;
	const { errors } = formState;

	function onSubmit(data: AgentCompanyAccount) {
		onChange(data);
	}

	return (
		<form
			id={id}
			className="flex flex-col gap-16"
			onChange={handleSubmit(onSubmit)}
		>
			<Controller
				control={control}
				name="account_type"
				render={({ field }) => (
					<TextField
						{...field}
						label="Account Type"
						id="account_type"
						placeholder="Account Type"
						variant="outlined"
						fullWidth
						error={!!errors.account_type}
						helperText={errors?.account_type?.message}
						required
						autoFocus
						select
					>
						<MenuItem
							key="account_type_fiat"
							value="fiat"
						>
							Fiat
						</MenuItem>
						<MenuItem
							key="account_type_crypto"
							value="crypto"
						>
							Crypto
						</MenuItem>
					</TextField>
				)}
			/>
			{account_type === 'fiat' && (
				<div className="flex items-start justify-between gap-8">
					<Controller
						control={control}
						name="bank_country"
						render={({ field }) => (
							<TextField
								{...field}
								label="Bank Country"
								id="bank_country"
								placeholder="Bank Country"
								variant="outlined"
								fullWidth
								error={!!errors.bank_country}
								helperText={errors?.bank_country?.message}
								select
								required
							>
								{CountryCodeList.map((country) => (
									<MenuItem
										key={country.code}
										value={country.code}
									>
										{country.name}
									</MenuItem>
								))}
							</TextField>
						)}
					/>
					<Controller
						control={control}
						name="bank_swift_code"
						render={({ field }) => (
							<TextField
								{...field}
								label="Bank Swift Code"
								id="bank_swift_code"
								placeholder="Bank Swift Code"
								variant="outlined"
								fullWidth
								error={!!errors.bank_swift_code}
								helperText={errors?.bank_swift_code?.message}
								required
							/>
						)}
					/>
				</div>
			)}
			<div className="flex items-start justify-between gap-8">
				{account_type === 'fiat' && (
					<Controller
						control={control}
						name="bank_name"
						render={({ field }) => (
							<TextField
								{...field}
								label="Bank Name"
								id="bank_name"
								placeholder="Bank Name"
								variant="outlined"
								fullWidth
								error={!!errors.bank_name}
								helperText={errors?.bank_name?.message}
								required
							/>
						)}
					/>
				)}
				{account_type.length > 0 && (
					<Controller
						control={control}
						name="account_no"
						render={({ field }) => (
							<TextField
								{...field}
								label={account_type === 'crypto' ? 'Wallet Address' : 'IBAN'}
								id="account_no"
								variant="outlined"
								fullWidth
								error={!!errors.account_no}
								helperText={errors?.account_no?.message}
								required
							/>
						)}
					/>
				)}
			</div>
			{account_type === 'fiat' && (
				<Controller
					control={control}
					name="bank_address"
					render={({ field }) => (
						<TextField
							{...field}
							label="Bank Address"
							placeholder="Bank Address"
							id="bank_address"
							variant="outlined"
							fullWidth
							error={!!errors.bank_address}
							helperText={errors?.bank_address?.message}
							required
						/>
					)}
				/>
			)}
			{account_type === 'crypto' && (
				<div className="flex items-start justify-between gap-8">
					<Controller
						control={control}
						name="currency"
						render={({ field }) => (
							<TextField
								{...field}
								label="Currency"
								id="currency"
								placeholder="Currency"
								variant="outlined"
								fullWidth
								error={!!errors.currency}
								helperText={errors?.currency?.message}
								required
								select
							>
								{CryptoCurrency.map((currency) => (
									<MenuItem
										key={currency.code}
										value={currency.code}
									>
										{currency.name}
									</MenuItem>
								))}
							</TextField>
						)}
					/>
					<Controller
						control={control}
						name="network"
						render={({ field }) => (
							<TextField
								{...field}
								label="Network"
								id="network"
								placeholder="Network"
								variant="outlined"
								fullWidth
								error={!!errors.network}
								helperText={errors?.network?.message}
								select
								required
							>
								{CryptoCurrencyNetworks.map((network) => (
									<MenuItem
										key={network.code}
										value={network.code}
									>
										{network.name}
									</MenuItem>
								))}
							</TextField>
						)}
					/>
				</div>
			)}
			{account_type.length > 0 && (
				<Controller
					control={control}
					name="label"
					render={({ field }) => (
						<TextField
							{...field}
							label="Label"
							id="label"
							placeholder="Label"
							variant="outlined"
							fullWidth
							error={!!errors.label}
							helperText={errors?.label?.message}
						/>
					)}
				/>
			)}
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

export default CompanyAccountInput;
