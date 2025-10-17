import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { Sender } from '@/types/entity';
import { useMemo } from 'react';
import { UserTypes } from '@/data/static-data';
import { CountryCodeList } from '@/data/country-code';

type AgentSenderListItemPropsType = {
	sender: Sender;
	fetch: () => void;
};

function ListItem({ sender }: AgentSenderListItemPropsType) {
	const userTypes = useMemo(() => {
		const types: Record<string, string> = {};
		Object.keys(UserTypes).forEach((key) => {
			types[key] = UserTypes[key];
		});
		return types;
	}, []);

	const countryList = useMemo(() => {
		const countries: Record<string, string> = {};
		Object.keys(CountryCodeList).map((key) => {
			const country = CountryCodeList[key];
			countries[country.code] = country.name;
		});
		return countries;
	}, []);

	return (
		<>
			<ListItemButton
				className="px-32 py-16"
				sx={{ bgcolor: 'background.paper' }}
				href={'/customers/' + sender.id}
			>
				<ListItemAvatar>
					<Avatar
						alt={sender.name}
						src={null}
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-small leading-5 truncate' }}
					primary={sender.name}
					secondary={
						<Typography
							className="inline capitalize"
							component="span"
							variant="body2"
							color="text.secondary"
						>
							{countryList[sender?.country] || sender?.country} -{' '}
							{userTypes[sender?.sender_type] || sender?.sender_type}
						</Typography>
					}
				/>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default ListItem;
