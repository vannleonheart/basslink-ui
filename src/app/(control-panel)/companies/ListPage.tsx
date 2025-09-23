import { motion } from 'motion/react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import FuseLoading from '@fuse/core/FuseLoading';
import { useAppSelector } from '@/store/hooks';
import ListItem from './ListItem';
import { GroupedCompanies, selectFilteredCompanyList, selectGroupedFilteredCompanies } from './Api';
import { AgentCompany } from '@/types';

function ListPage({ data, isLoading }: { data: AgentCompany[]; isLoading: boolean }) {
	const filteredData = useAppSelector(selectFilteredCompanyList(data));
	const groupedFilteredCompanies = useAppSelector(selectGroupedFilteredCompanies(filteredData));

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
					There are no payment company!
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
			{Object.entries(groupedFilteredCompanies).map(([key, group]: [string, GroupedCompanies]) => {
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
							{group?.children?.map((item: AgentCompany) => (
								<ListItem
									key={item.id}
									company={item}
								/>
							))}
						</List>
					</div>
				);
			})}
		</motion.div>
	);
}

export default ListPage;
