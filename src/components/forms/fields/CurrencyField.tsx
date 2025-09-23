import { TextField, TextFieldProps } from '@mui/material';

type CurrencyFieldProps = Partial<TextFieldProps> & {
	decimal?: number;
};

export default function CurrencyField({ value, onChange, decimal, ...rest }: CurrencyFieldProps) {
	const strValue = `${value}`;
	const [before, after] = strValue.split('.');
	const fraction = decimal ?? 2;

	value = before.replace(/,/g, '');

	if (!isNaN(Number(value))) {
		value = new Intl.NumberFormat('en-US', {
			minimumFractionDigits: 0,
			maximumFractionDigits: fraction
		}).format(Number(value));
	}

	if (!isNaN(Number(after))) {
		value = `${value}.${after.slice(0, fraction)}`;
	}

	return (
		<TextField
			{...rest}
			value={value}
			onChange={(e) => {
				let val = e.currentTarget.value;

				val = val.replace(/,/g, '');

				e.currentTarget.value = val;

				onChange(e);
			}}
		/>
	);
}
