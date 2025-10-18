import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { ChangeEvent, useEffect } from 'react';
import { setSearchText, resetSearchText, selectSearchText } from './AppSlice';
import { selectFilteredSenderList } from './Api';
import { Sender } from '@/types/entity';
import { useThemeMediaQuery } from '@fuse/hooks';
import NavbarToggleButton from '@/components/theme-layouts/components/navbar/NavbarToggleButton';

function Header({ data, isLoading }: { data: Sender[]; isLoading: boolean }) {
	const dispatch = useAppDispatch();
	const searchText = useAppSelector(selectSearchText);
	const filteredData = useAppSelector(selectFilteredSenderList(data));
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('md'));

	useEffect(() => {
		return () => {
			dispatch(resetSearchText());
		};
	}, [dispatch]);

	if (isLoading) {
		return null;
	}

	return (
		<div className="p-24 sm:p-32 w-full">
			<div className="flex flex-row items-start justify-between">
				<div className="flex flex-col space-y-4">
					<motion.span
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.2 } }}
					>
						<Typography className="text-4xl font-extrabold leading-none tracking-tight">
							Daftar Pengirim
						</Typography>
					</motion.span>
					<motion.span
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					>
						<Typography
							component={motion.span}
							className="text-base font-medium ml-2"
							color="text.secondary"
						>
							{`${filteredData?.length} pengirim`}
						</Typography>
					</motion.span>
				</div>
				{isMobile && <NavbarToggleButton className="mx-0 h-40 w-40 p-0 sm:mx-8" />}
			</div>
			<div className="flex flex-1 items-center mt-16 space-x-8">
				<Box
					component={motion.div}
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					className="flex flex-1 w-full sm:w-auto items-center px-12 border-1 rounded-lg h-36"
				>
					<FuseSvgIcon color="action">heroicons-outline:magnifying-glass</FuseSvgIcon>

					<Input
						placeholder="Cari pengirim"
						className="flex flex-1"
						disableUnderline
						fullWidth
						value={searchText}
						inputProps={{
							'aria-label': 'Search'
						}}
						onChange={(ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearchText(ev))}
					/>
				</Box>
			</div>
		</div>
	);
}

export default Header;
