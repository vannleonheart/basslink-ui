import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Link from '@fuse/core/Link';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { darken } from '@mui/material/styles';
import { alpha } from '@mui/system/colorManipulator';
import clsx from 'clsx';
import Popover, { PopoverProps } from '@mui/material/Popover/Popover';
import useUser from '@auth/useUser';
import { AdminUser, AgentUser, ClientUser } from '@/types';

type UserMenuProps = {
	className?: string;
	popoverProps?: Partial<PopoverProps>;
	arrowIcon?: string;
};

function UserMenu(props: UserMenuProps) {
	const { className, popoverProps, arrowIcon = 'heroicons-outline:chevron-up' } = props;
	const { data: user, side, signOut } = useUser();
	const [userMenu, setUserMenu] = useState<HTMLElement | null>(null);
	const userMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		setUserMenu(event.currentTarget);
	};
	const userMenuClose = () => {
		setUserMenu(null);
	};

	if (!user) {
		return null;
	}

	return (
		<>
			<Button
				className={clsx(
					'user-menu flex justify-start shrink-0  min-h-56 h-56 rounded-lg p-8 space-x-12',
					className
				)}
				sx={(theme) => ({
					borderColor: theme.palette.divider,
					'&:hover, &:focus': {
						backgroundColor: alpha(theme.palette.divider, 0.6),
						...theme.applyStyles('dark', {
							backgroundColor: alpha(theme.palette.divider, 0.1)
						})
					}
				})}
				onClick={userMenuClick}
				color="inherit"
			>
				{user?.image ? (
					<Avatar
						sx={(theme) => ({
							background: theme.palette.background.default,
							color: theme.palette.text.secondary
						})}
						className="avatar w-40 h-40 rounded-lg"
						alt="user photo"
						src={user?.image}
						variant="rounded"
					/>
				) : (
					<Avatar
						sx={(theme) => ({
							background: (theme) => darken(theme.palette.background.default, 0.05),
							color: theme.palette.text.secondary
						})}
						className="avatar md:mx-4"
					>
						{user?.name?.[0]}
					</Avatar>
				)}
				<div className="flex flex-col flex-auto space-y-8">
					<Typography
						component="span"
						className="title flex font-semibold text-base capitalize truncate  tracking-tight leading-none"
					>
						{user?.name}
					</Typography>
					<Typography
						className="subtitle flex text-md font-medium tracking-tighter leading-none"
						color="text.secondary"
					>
						{side === 'admin'
							? (user as AdminUser)?.username
							: side === 'agent'
								? (user as AgentUser)?.agent?.name
								: (user as ClientUser)?.client?.name}
					</Typography>
				</div>
				<div className="flex flex-shrink-0 items-center space-x-8">
					<FuseSvgIcon
						className="arrow"
						size={13}
					>
						{arrowIcon}
					</FuseSvgIcon>
				</div>
			</Button>
			<Popover
				open={Boolean(userMenu)}
				anchorEl={userMenu}
				onClose={userMenuClose}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				classes={{
					paper: 'py-8 min-w-256'
				}}
				{...popoverProps}
			>
				{!user ? (
					<>
						<MenuItem
							component={Link}
							to="/sign-in"
							role="button"
						>
							<ListItemIcon className="min-w-36">
								<FuseSvgIcon>heroicons-outline:lock-closed</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Sign In" />
						</MenuItem>
						<MenuItem
							component={Link}
							to="/sign-up"
							role="button"
						>
							<ListItemIcon className="min-w-36">
								<FuseSvgIcon>heroicons-outline:user-plus</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Sign up" />
						</MenuItem>
					</>
				) : (
					<>
						<MenuItem
							onClick={() => {
								signOut();
							}}
						>
							<ListItemIcon className="min-w-36">
								<FuseSvgIcon>heroicons-outline:arrow-right-on-rectangle</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Sign out" />
						</MenuItem>
					</>
				)}
			</Popover>
		</>
	);
}

export default UserMenu;
