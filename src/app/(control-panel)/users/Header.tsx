import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { ChangeEvent, useEffect } from 'react';
import { setSearchText, resetSearchText, selectSearchText } from './AppSlice';
import { selectFilteredAgentUserList } from './Api';
import { AgentUser } from '@/types';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import DialogUserCreateOrEdit from '@/components/dialogs/DialogUserCreateOrEdit';

function Header({ data, isLoading, fetch }: { data: AgentUser[]; isLoading: boolean; fetch: () => void }) {
	const dispatch = useAppDispatch();
	const searchText = useAppSelector(selectSearchText);
	const filteredData = useAppSelector(selectFilteredAgentUserList(data));
	const handleNewUser = () => {
		dispatch(
			openDialog({
				children: <DialogUserCreateOrEdit callbackAction={fetch} />,
				fullWidth: true,
				disableBackdropClick: true,
				disableEscapeKeyDown: true
			})
		);
	};

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
			<div className="flex flex-col space-y-4">
				<motion.span
					initial={{ x: -20 }}
					animate={{ x: 0, transition: { delay: 0.2 } }}
				>
					<Typography className="text-4xl font-extrabold leading-none tracking-tight">Users</Typography>
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
						{`${filteredData?.length} users`}
					</Typography>
				</motion.span>
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
						placeholder="Search users"
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
				<Button
					variant="contained"
					color="secondary"
					onClick={handleNewUser}
				>
					<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
					<span className="hidden sm:flex mx-8">New User</span>
				</Button>
			</div>
		</div>
	);
}

export default Header;
