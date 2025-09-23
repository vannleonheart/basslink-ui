import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState } from 'react';

export default function UploadedFileItem({ filename, onRemove }: { filename: string; onRemove: () => void }) {
	const [color, setColor] = useState<'inherit' | 'primary'>('inherit');
	const name = filename.split('/').pop();
	const fileType = filename.split('.').pop();
	return (
		<div className="text-sm flex items-center justify-between rounded-lg border border-gray-700 gap-12 py-6">
			<div className="w-2/12 text-center font-bold">{fileType.toUpperCase()}</div>
			<div className="w-9/12 bg-white text-gray-700">
				{name.length > 40 ? name.slice(0, 30) + '...' + name.slice(-10) : name}
			</div>
			<div
				className="w-1/12 flex items-center justify-center"
				onMouseEnter={() => setColor('primary')}
				onMouseLeave={() => setColor('inherit')}
			>
				<FuseSvgIcon
					size={16}
					color={color}
					className="cursor-pointer"
					onClick={onRemove}
				>
					heroicons-solid:trash
				</FuseSvgIcon>
			</div>
		</div>
	);
}
