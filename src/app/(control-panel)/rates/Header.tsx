import apiService from '@/store/apiService';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Button } from '@mui/material';

export default function Header({ fetch }: { fetch: () => void }) {
	const [syncRates, { isLoading }] = apiService.useSyncRatesMutation();

	const handleSync = async () => {
		const { error } = await syncRates({});

		if (!error) {
			if (fetch) {
				fetch();
			}
		}
	};

	return (
		<div className="p-16 flex items-center justify-between gap-6">
			<div className="grow flex items-center gap-6">
				<FuseSvgIcon
					className="text-7xl"
					size={24}
					color="action"
				>
					heroicons-outline:currency-dollar
				</FuseSvgIcon>
				<h4>Rates</h4>
			</div>
			<div className="flex items-center justify-end gap-6">
				<Button
					variant="contained"
					color="primary"
					startIcon={<FuseSvgIcon>heroicons-outline:arrow-path</FuseSvgIcon>}
					onClick={handleSync}
					disabled={isLoading}
				>
					Sync
				</Button>
			</div>
		</div>
	);
}
