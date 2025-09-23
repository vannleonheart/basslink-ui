import { AuthComponentProps, Rate } from '@/types';
import React from 'react';
import UpdateRatesForm from '../forms/UpdateRatesForm';

type RatesUpdateDialogProps = Partial<AuthComponentProps> & {
	rate: Rate;
};

export default function RatesUpdateDialog({ rate, accessToken, fetch }: RatesUpdateDialogProps) {
	return (
		<React.Fragment>
			<UpdateRatesForm
				rate={rate}
				accessToken={accessToken}
				fetch={fetch}
			/>
		</React.Fragment>
	);
}
