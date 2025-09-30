import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import NavbarToggleButton from './theme-layouts/components/navbar/NavbarToggleButton';

type HeaderProps = {
	title?: string;
	titleRaw?: React.ReactNode;
	icon?: string;
	actions?: React.ReactNode;
};

export default function PageHeader({ title, titleRaw, icon, actions }: HeaderProps) {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	return (
		<div className="p-16 flex items-center justify-between gap-6">
			<div className="grow flex items-center gap-6">
				{icon && (
					<FuseSvgIcon
						className="text-7xl"
						size={24}
						color="action"
					>
						{icon}
					</FuseSvgIcon>
				)}
				{titleRaw ? titleRaw : <h4>{title}</h4>}
			</div>
			<div className="grow flex items-center justify-end gap-12 lg:gap-6">
				{actions}
				{isMobile && <NavbarToggleButton className="mx-0 h-40 w-40 p-0 sm:mx-8" />}
			</div>
		</div>
	);
}
