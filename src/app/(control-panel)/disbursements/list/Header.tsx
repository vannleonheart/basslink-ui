import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Agent } from '@/types/entity';

function Header({ data, isLoading, fetch }: { data: Agent[]; isLoading: boolean; fetch: () => void }) {
	return (
		<div className="p-24 sm:p-32 w-full">
			<div className="flex flex-1 items-center mt-16 space-x-8">
				<Button
					variant="contained"
					color="secondary"
				>
					<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
					<span className="hidden sm:flex mx-8">New Disbursement</span>
				</Button>
			</div>
		</div>
	);
}

export default Header;
