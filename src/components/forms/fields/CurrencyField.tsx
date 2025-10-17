import { sanitizeNumber } from '@/utils/format';
import { TextField, TextFieldProps } from '@mui/material';
import { useEffect, useState } from 'react';

type CurrencyFieldProps = Partial<TextFieldProps> & {
	decimal?: number;
	value?: string;
};

const composeValue = (value: string, decimal?: number) => {
	const strValue = `${value}`.trim();
	const fraction = decimal ?? 6;

	let newValue = sanitizeNumber(strValue, fraction, true);

	if (strValue.endsWith('.')) {
		newValue = `${newValue}.`;
	}

	return newValue;
};

export default function CurrencyField({ value, onChange, decimal, ...rest }: CurrencyFieldProps) {
	const [fieldValue, setFieldValue] = useState<string>(value ?? '');

	useEffect(() => {
		setFieldValue(composeValue(value, decimal));
	}, [decimal, value]);

	return (
		<TextField
			{...rest}
			value={fieldValue}
			onBlur={(e) => {
				let val = composeValue(e.currentTarget.value, decimal);

				if (val.endsWith('.')) {
					val = val.slice(0, -1);
					val = val.replace(/,/g, '');

					e.currentTarget.value = val;

					onChange(e);
				}
			}}
			onChange={(e) => {
				let val = composeValue(e.currentTarget.value, decimal);

				val = val.replace(/,/g, '');

				e.currentTarget.value = val;

				onChange(e);
			}}
		/>
	);
}
