import { Typography } from '@mui/material';

type EmptyProps = {
	text: string;
	fontSize?: number;
	color?: string;
	fontWeight?: string;
};

export default function Empty({ text, fontSize = 16, color = 'grey', fontWeight = 'bold' }: EmptyProps) {
	return (
		<div className="flex items-center justify-center min-h-full">
			<Typography
				fontWeight={fontWeight}
				fontSize={fontSize}
				color={color}
			>
				{text}
			</Typography>
		</div>
	);
}
