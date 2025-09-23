export default function StatusLabel({
	status,
	size,
	rounded,
	format
}: {
	status: string;
	size?: 'small' | 'medium' | 'large';
	rounded?: boolean;
	format?: 'uppercase' | 'lowercase' | 'capitalize';
}) {
	let bg = ' bg-gray-300 ';
	let sizeClass = ' py-6 px-12 ';
	let roundedClass = '';
	let formatClass = ' capitalize ';

	switch (status.toLowerCase()) {
		case 'payment_of_invoice':
			bg = 'bg-blue-300 text-white';
			break;
		case 'completed':
			bg = 'bg-green-300 text-white';
			break;
		case 'return':
			bg = 'bg-red-300 text-white';
			break;
	}

	switch (size) {
		case 'small':
			sizeClass = ' py-2 px-6 text-sm ';
			break;
		case 'medium':
			sizeClass = ' py-6 px-12 ';
			break;
		case 'large':
			sizeClass = ' py-6 px-16 text-xl ';
			break;
	}

	if (rounded) {
		roundedClass = ' rounded-lg ';
	}

	switch (format) {
		case 'uppercase':
			formatClass = ' uppercase ';
			break;
		case 'lowercase':
			formatClass = ' lowercase ';
			break;
		case 'capitalize':
			formatClass = ' capitalize ';
			break;
	}

	const statusText = status.toLowerCase().split('_').join(' ');
	switch (status.toLowerCase()) {
		default:
			return <span className={'text-center' + formatClass + roundedClass + sizeClass + bg}>{statusText}</span>;
	}
}
