import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { User } from '@/types/entity';

type AgentUserListItemPropsType = {
	user: User;
	fetch: () => void;
};

function ListItem({ user }: AgentUserListItemPropsType) {
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
							{user.email}
						</Typography>
					}
				/>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default ListItem;
