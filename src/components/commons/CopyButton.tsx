import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState } from 'react';

export default function CopyButton({
	value,
	size,
	className
}: {
	value: string;
	className?: string;
	size?: number | 'small' | 'medium' | 'large' | 'inherit';
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
			<FuseSvgIcon
				color={color}
				fontSize={size || 'small'}
			>
				heroicons-outline:document-duplicate
			</FuseSvgIcon>
		</div>
	);
}
