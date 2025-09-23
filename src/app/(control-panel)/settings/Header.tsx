import _ from 'lodash';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import usePathname from '@fuse/hooks/usePathname';
import SettingsAppNavigation from './Navigation';

type SettingsAppHeaderProps = {
	className?: string;
	onSetSidebarOpen: (open: boolean) => void;
};

function SettingsAppHeader(props: SettingsAppHeaderProps) {
	const { className } = props;
	const pathname = usePathname();
	const currentNavigation = _.find(SettingsAppNavigation.children, { url: pathname });

	return (
		<div className={clsx('flex space-x-12', className)}>
			<div>
				<PageBreadcrumb className="mb-12" />

				<Typography className=" text-3xl font-bold leading-none tracking-tight lg:ml-0">
					{currentNavigation?.title} Settings
				</Typography>
			</div>
		</div>
	);
}

export default SettingsAppHeader;
