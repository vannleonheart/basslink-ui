import { CircularProgress, Typography } from '@mui/material';

type LoadingBarProps = {
	size?: 'tiny' | 'small' | 'medium' | 'large';
	text?: string;
	circularSize?: null | number;
	fontSize?: null | number;
};

export default function LoadingBar({
	size = 'medium',
	text = 'Loading...',
	circularSize = null,
	fontSize = null
}: LoadingBarProps) {
	let csize = 20;
	let fsize = 16;

	switch (size) {
		case 'tiny':
			csize = 16;
			fsize = 12;
			break;
		case 'small':
			csize = 18;
			fsize = 14;
			break;
		case 'large':
			csize = 24;
			fsize = 20;
			break;
	}

	if (circularSize) {
		csize = circularSize;
	}

	if (fontSize) {
		fsize = fontSize;
	}

	return (
		<div className="flex items-center justify-center w-full h-full min-h-[200px]">
			<div className="flex gap-6 items-center bg-white px-12 py-6 rounded-md opacity-70">
				<CircularProgress size={csize} />
				<Typography fontSize={fsize}>{text}</Typography>
			</div>
		</div>
	);
}
