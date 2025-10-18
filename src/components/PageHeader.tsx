import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import NavbarToggleButton from './theme-layouts/components/navbar/NavbarToggleButton';
import { ReactNode } from 'react';

type HeaderProps = {
	title: string | ReactNode;
	icon?: string | ReactNode;
	actions?: ReactNode;
};

export default function PageHeader({ title, icon, actions }: HeaderProps) {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('md'));

	if (typeof title === 'string') {
		title = <h4>{title}</h4>;
	}

	if (icon && typeof icon === 'string') {
		icon = (
			<FuseSvgIcon
				className="text-7xl"
				size={24}
				color="action"
			>
				{icon}
			</FuseSvgIcon>
		);
	}

	return (
		<div className="py-16 px-24 flex items-center justify-between gap-6">
			<div className="grow flex items-center gap-6">
				{icon}
				{title}
			</div>
			<div className="grow flex items-center justify-end gap-12 lg:gap-6">
				{actions}
				{isMobile && <NavbarToggleButton className="mx-0 h-40 w-40 p-0 sm:mx-8" />}
			</div>
		</div>
	);
}
