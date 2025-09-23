import { FileCopy } from '@mui/icons-material';
import { useState } from 'react';

export default function CopyButton({
	value,
	size,
	className
}: {
	value: string;
	className?: string;
	size?: 'small' | 'medium' | 'large' | 'inherit';
}) {
	const [color, setColor] = useState<'inherit' | 'primary'>('inherit');

	const copyToClipboard = () => {
		navigator.clipboard.writeText(value);
	};

	return (
		<div
			className={className + ' cursor-pointer'}
			onClick={copyToClipboard}
			onMouseDown={() => setColor('primary')}
			onMouseUp={() => setColor('inherit')}
		>
			<FileCopy
				color={color}
				fontSize={size || 'small'}
			/>
		</div>
	);
}
