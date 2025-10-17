import { motion } from 'motion/react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import FuseLoading from '@fuse/core/FuseLoading';
import { useAppSelector } from 'src/store/hooks';
import ListItem from './ListItem';
import { selectFilteredSenderList, selectGroupedFilteredSenders, GroupedSenders } from './Api';
import { Sender } from '@/types/entity';

function ListPage({ data, isLoading, fetch }: { data: Sender[]; isLoading: boolean; fetch: () => void }) {
	const filteredData = useAppSelector(selectFilteredSenderList(data));
	const groupedFilteredData = useAppSelector(selectGroupedFilteredSenders(filteredData));

	if (isLoading) {
		return <FuseLoading />;
	}

	if (filteredData.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There are no user!
				</Typography>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
			className="flex flex-col flex-auto w-full max-h-full border-x-1"
		>
			{Object.entries(groupedFilteredData).map(([key, group]: [string, GroupedSenders]) => {
				return (
					<div
						key={key}
						className="relative"
					>
						<Typography
							color="text.secondary"
							className="px-32 py-4 text-base font-medium bg-grey-300"
						>
							{key}
						</Typography>
						<Divider />
						<List className="w-full m-0 p-0">
							{group?.children?.map((item: Sender) => {
								return (
									<ListItem
										key={item.id}
										sender={item}
										fetch={fetch}
									/>
								);
							})}
						</List>
					</div>
				);
			})}
		</motion.div>
	);
}

export default ListPage;
