import apiService from '@/store/apiService';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Box, lighten, styled } from '@mui/material';
import { ApiResponse } from '@/types/component';
import { useSession } from 'next-auth/react';
import { ChangeEvent } from 'react';
import UploadedFileItem from './UploadedFileItem';

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1
});

type FileUploadBarProps = {
	onChange?: (value: string[]) => Promise<void> | void;
	onError?: (message: string) => void;
	accept?: string;
	maxSize?: null | number;
	path?: string;
	value?: string[];
};

export default function FileUploadBar({
	accept,
	maxSize = null,
	path = '/upload',
	onError,
	onChange,
	value
}: FileUploadBarProps) {
	const { data } = useSession();
	const { accessToken } = data ?? {};
	const [uploadFile] = apiService.useUploadFileMutation();

	const handleUploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
		const files = e?.currentTarget?.files;

		if (!files || !files.length) {
			return;
		}

		const formData = new FormData();

		for (const file of files) {
			if (maxSize !== null && !isNaN(maxSize) && maxSize > 0) {
				if (file.size > maxSize) {
					if (onError) {
						onError(`Maximum file size allowed is ${maxSize} bytes`);
					}

					return;
				}
			}

			formData.append('files[]', file);
		}

		const { error, data } = await uploadFile({ accessToken, data: formData, path });

		if (!error && data) {
			const result = data as ApiResponse;
			const newValue = result?.data as string[];

			onChange?.(newValue ? [...(value || []), ...newValue] : [...(value || [])]);
		}
	};

	return (
		<div className="w-full flex flex-col">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
				{value?.map((file, index) => {
					return (
						<UploadedFileItem
							key={`file_${index}`}
							filename={file}
							onRemove={() => {
								const newFiles = value.filter((_, i) => i !== index);
								onChange?.(newFiles);
							}}
						/>
					);
				})}
			</div>
			<Box
				sx={(theme) => ({
					backgroundColor: lighten(theme.palette.background.default, 0.02),
					...theme.applyStyles('light', {
						backgroundColor: lighten(theme.palette.background.default, 0.2)
					})
				})}
				component="label"
				htmlFor="button-file"
				className="productImageUpload flex items-center justify-center relative w-full h-128 rounded-lg mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
			>
				<VisuallyHiddenInput
					accept={accept}
					multiple
					onChange={handleUploadFile}
					type="file"
					id="button-file"
				/>
				<div className="flex flex-col items-center gap-4">
					<FuseSvgIcon
						size={32}
						color="action"
					>
						heroicons-outline:arrow-up-on-square
					</FuseSvgIcon>
					Upload Files
				</div>
			</Box>
		</div>
	);
}
