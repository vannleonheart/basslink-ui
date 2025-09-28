import t from '@/dict/t';
import apiService from '@/store/apiService';
import { useAppDispatch } from '@/store/hooks';
import { ApiResponse } from '@/types';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { Switch } from '@mui/material';
import { useState } from 'react';

type ToggleProps = {
	value: boolean;
	url?: string;
	accessToken?: string;
	color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default';
	message?: string;
	disabled?: boolean;
};

export default function Toggle({
	value,
	url,
	accessToken,
	color = 'default',
	message = '',
	disabled = false
}: ToggleProps) {
	const [isChecked, setIsChecked] = useState(value);
	const dispatch = useAppDispatch();
	const [postData, { isLoading }] = apiService.usePostDataMutation();

	const handleOnChange = async () => {
		if (!url || !url.length || isLoading || disabled) {
			return;
		}

		const { error } = await postData({
			path: url,
			accessToken
		});

		if (error) {
			const errorData = error as { data: ApiResponse };
			dispatch(
				showMessage({
					variant: 'error',
					message: t(errorData?.data?.message)
				})
			);
		}

		setIsChecked(!isChecked);

		if (message && message.length) {
			dispatch(
				showMessage({
					variant: 'success',
					message: t(message)
				})
			);
		}
	};

	return (
		<Switch
			color={color}
			checked={isChecked}
			onChange={() => handleOnChange()}
			disabled={disabled}
		/>
	);
}
