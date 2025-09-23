import _ from 'lodash';
import React, { MouseEvent, useState } from 'react';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/system/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import clsx from 'clsx';
import { CountryCodeList } from '@/data/country-code';

type CountryCodeSelectorProps = {
	value: string;
	onChange: (T: string) => void;
	className?: string;
	ref?: React.Ref<HTMLDivElement>;
};

function CountryCodeSelector(props: CountryCodeSelectorProps) {
	const { value, onChange, className, ref } = props;
	const country = _.find(CountryCodeList, { dial_code: value });
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div ref={ref}>
			<Button
				className={clsx('flex items-center', className)}
				id="country-button"
				aria-controls={open ? 'country-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				disableElevation
				onClick={handleClick}
				endIcon={<KeyboardArrowDownIcon />}
				disableRipple
			>
				<span className="ml-8 font-medium">{country?.dial_code}</span>
			</Button>
			<Menu
				id="country-menu"
				MenuListProps={{
					'aria-labelledby': 'demo-customized-button'
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				{CountryCodeList?.map((item) => (
					<MenuItem
						onClick={() => {
							onChange(item?.dial_code);
							handleClose();
						}}
						disableRipple
						key={item.code}
					>
						<Box
							component="span"
							className="w-24 h-16 overflow-hidden"
						/>
						<span className="ml-8 font-medium">
							{item.name} ({item.dial_code})
						</span>
					</MenuItem>
				))}
			</Menu>
		</div>
	);
}

export default CountryCodeSelector;
