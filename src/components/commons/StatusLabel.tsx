import { Typography } from '@mui/material';
import clsx from 'clsx';
import _ from 'lodash';

type StatusLabelProps = {
	text?: string;
	status: string;
	size?: 'tiny' | 'mini' | 'small' | 'medium' | 'large';
	title?: string;
};

export default function StatusLabel({ status, text = '', size = 'medium', title }: StatusLabelProps) {
	let bgClass = 'bg-black text-white';

	switch (status) {
		case 'new':
		case 'submitted':
			bgClass = 'bg-grey-700 text-white';
			break;
		case 'wait':
		case 'pending':
			bgClass = 'bg-cyan-900 text-white';
			break;
		case 'payment_confirmed':
			bgClass = 'bg-blue-900 text-white';
			break;
		case 'paid':
			bgClass = 'bg-indigo-900 text-white';
			break;
		case 'processed':
			bgClass = 'bg-purple-900 text-white';
			break;
		case 'returned':
			bgClass = 'bg-yellow-900 text-white';
			break;
		case 'refunded':
			bgClass = 'bg-orange-900 text-white';
			break;
		case 'failed':
		case 'cancelled':
			bgClass = 'bg-red-900 text-white';
			break;
		case 'completed':
			bgClass = 'bg-green-900 text-white';
			break;
	}

	if (text.length <= 0) {
		text = status;
	}

	let fontSize = 14;
	let padding = 'px-12 py-1';

	switch (size) {
		case 'tiny':
			fontSize = 8;
			padding = 'px-4 py-1';
			break;
		case 'mini':
			fontSize = 10;
			padding = 'px-6 py-1';
			break;
		case 'small':
			padding = 'px-8 py-1';
			fontSize = 12;
			break;
		case 'large':
			padding = 'px-16 py-1';
			fontSize = 18;
			break;
	}

	text = text.split('_').join(' ');

	return (
		<div className={clsx(padding, 'rounded', bgClass, 'inline-block', 'text-center')}>
			<Typography
				component="div"
				fontSize={fontSize}
				className="capitalize"
				title={title}
			>
				{_.capitalize(text)}
			</Typography>
		</div>
	);
}
