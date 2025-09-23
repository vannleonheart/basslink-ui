import TextField, { TextFieldProps } from '@mui/material/TextField';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState } from 'react';

export default function PasswordField(props: TextFieldProps) {
	const [showPassword, setShowPassword] = useState(false);

	return (
		<TextField
			{...props}
			type={showPassword ? 'text' : 'password'}
			slotProps={{
				input: {
					endAdornment: (
						<PasswordToggle
							showPassword={showPassword}
							onClick={() => setShowPassword(!showPassword)}
						/>
					)
				}
			}}
		/>
	);
}

function PasswordToggle({ showPassword, onClick }: { showPassword: boolean; onClick: () => void }) {
	return (
		<div
			className="cursor-pointer"
			onClick={onClick}
		>
			<FuseSvgIcon>{showPassword ? 'heroicons-solid:eye' : 'heroicons-solid:eye-slash'}</FuseSvgIcon>
		</div>
	);
}
