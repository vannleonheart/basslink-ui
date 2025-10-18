import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Button, Paper, Typography } from '@mui/material';

export default function RecentTransaction() {
	return (
		<Paper
			component="div"
			className="flex flex-col gap-6"
		>
			<div className="px-20 py-12 flex flex-col md:flex-row items-center md:justify-between gap-6 bg-gray-50 rounded-t-lg shadow">
				<div className="flex items-center gap-6">
					<FuseSvgIcon size={20}>heroicons-outline:document-text</FuseSvgIcon>
					<Typography
						fontWeight="medium"
						fontSize={14}
					>
						Transaksi Terbaru
					</Typography>
				</div>
				<Button
					variant="text"
					color="primary"
					className="mt-4 md:mt-0"
					size="small"
					href="/remittances/list"
				>
					Lihat Semua Transaksi
				</Button>
			</div>
			<div className="min-h-[345px] p-20">
				<div className="w-full h-full flex items-center justify-center text-gray-700">
					<Typography>Belum ada transaksi baru</Typography>
				</div>
			</div>
		</Paper>
	);
}
