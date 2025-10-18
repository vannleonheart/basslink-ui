import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Paper, Typography } from '@mui/material';

export default function Inbox() {
	return (
		<Paper
			component="div"
			className="flex flex-col gap-6"
		>
			<div className="px-20 py-12 flex flex-row gap-6 bg-gray-50 items-center rounded-t-lg shadow">
				<FuseSvgIcon size={20}>heroicons-outline:inbox</FuseSvgIcon>
				<Typography
					fontWeight="medium"
					fontSize={14}
				>
					Inbox
				</Typography>
			</div>
			<div className="h-[150px] p-20">
				<div className="w-full h-full flex items-center justify-center text-gray-700">
					<Typography>Belum ada pesan baru</Typography>
				</div>
			</div>
			<div className="px-20 py-12 border-t border-gray-200 flex justify-center items-center cursor-pointer rounded-b-lg shadow">
				<Typography>Lihat semua pesan</Typography>
			</div>
		</Paper>
	);
}
