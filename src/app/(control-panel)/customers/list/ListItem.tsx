import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { User } from '@/types/entity';
import { useMemo } from 'react';
import { UserTypes } from '@/data/static-data';
import { CountryCodeList } from '@/data/country-code';

type AgentUserListItemPropsType = {
	user: User;
	fetch: () => void;
};

function ListItem({ user }: AgentUserListItemPropsType) {
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
				href={'/customers/' + user.id}
			>
				<ListItemAvatar>
					<Avatar
						alt={user.name}
						src={user.image}
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-small leading-5 truncate' }}
					primary={user.name}
					secondary={
						<Typography
							className="inline capitalize"
							component="span"
							variant="body2"
							color="text.secondary"
						>
							{countryList[user?.country] || user?.country} -{' '}
							{userTypes[user?.user_type] || user?.user_type}
						</Typography>
					}
				/>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default ListItem;
