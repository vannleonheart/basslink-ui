import TextField, { TextFieldProps } from '@mui/material/TextField';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Button, CircularProgress } from '@mui/material';
import styled from 'styled-components';
import { ChangeEvent, useRef, useState } from 'react';
import apiService from '@/store/apiService';
import { useSession } from 'next-auth/react';
import { ApiResponse } from '@/types';

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

type FileUploadInputProps = Partial<TextFieldProps> & {
	onChange?: (value: string) => Promise<void> | void;
	onError?: (message: string) => void;
	accept?: string;
	maxSize?: null | number;
	path?: string;
	defaultValue?: string;
	value?: string;
};

export default function FileUploadInput({
	accept,
	maxSize = null,
	path = '/upload',
	onError,
	onChange,
	defaultValue,
	value,
	...props
}: FileUploadInputProps) {
	const { data } = useSession();
	const { accessToken } = data ?? {};
	const uploadInput = useRef<HTMLInputElement>(null);
	const [uploadFile, { isLoading }] = apiService.useUploadFileMutation();
	const [fValue, setFValue] = useState<string>(value || defaultValue || '');

	const handleClickUpload = () => {
		uploadInput.current.click();
	};

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
			const value = result?.data as string[];

			setFValue(value.join(','));
			onChange?.(value.join(','));
		}
	};

	return (
		<TextField
			{...props}
			value={fValue}
			onChange={(e) => {
				setFValue(e.target.value);
				onChange?.(e.target.value);
			}}
			slotProps={{
				input: {
					sx: {
						paddingRight: 0
					},
					endAdornment: isLoading ? (
						<div className="px-6">
							<CircularProgress size={14} />
						</div>
					) : (
						<Button
							variant="contained"
							color="secondary"
							sx={{
								paddingX: '20px',
								borderRadius: '4px'
							}}
							startIcon={<FuseSvgIcon>heroicons-outline:arrow-up-circle</FuseSvgIcon>}
							onClick={handleClickUpload}
						>
							Upload
							<VisuallyHiddenInput
								accept={accept}
								ref={uploadInput}
								onChange={handleUploadFile}
								type="file"
							/>
						</Button>
					)
				}
			}}
		/>
	);
}
