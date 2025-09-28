import { Typography } from '@mui/material';
import CopyButton from './CopyButton';
import React from 'react';
import clsx from 'clsx';

type TextCopyProps = {
	text: string;
	copyText?: string;
	copyButton?: boolean;
	icon?: React.ReactNode | null;
	actionButton?: React.ReactNode | null;
	bgColor?: string;
	fontSize?: number;
};

export default function TextCopy({
	text,
	copyText,
	icon = null,
	copyButton = true,
	actionButton = null,
	bgColor = 'bg-grey-100',
	fontSize = 13
}: TextCopyProps) {
	if (!copyText || !copyText.length) {
		copyText = text;
	}

	return (
		<div className={clsx('w-full flex items-start justify-between gap-12 px-12 py-12 rounded', bgColor)}>
			<div className="h-full flex items-start gap-12 break-all">
				{icon}
				<Typography
					component="div"
					fontSize={fontSize}
				>
					{text}
				</Typography>
			</div>
			<div className="h-full">
				{copyButton && <CopyButton value={copyText} />}
				{actionButton}
			</div>
		</div>
	);
}
