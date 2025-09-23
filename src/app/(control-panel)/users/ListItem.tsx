import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { AgentUser } from '@/types';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { useAppDispatch } from '@/store/hooks';
import DialogAgentUserCreateOrEdit from '@/components/dialogs/DialogAgentUserCreateOrEdit';

type AgentUserListItemPropsType = {
	agentUser: AgentUser;
	fetch: () => void;
};

function ListItem(props: AgentUserListItemPropsType) {
	const { agentUser, fetch } = props;
	const dispatch = useAppDispatch();
	const handleEditAgent = (agentUser: AgentUser) => {
		dispatch(
			openDialog({
				children: (
					<DialogAgentUserCreateOrEdit
						agentUser={agentUser}
						callbackAction={fetch}
					/>
				),
				fullWidth: true,
				disableBackdropClick: true,
				disableEscapeKeyDown: true
			})
		);
	};

	return (
		<>
			<ListItemButton
				className="px-32 py-16"
				sx={{ bgcolor: 'background.paper' }}
				onClick={() => handleEditAgent(agentUser)}
			>
				<ListItemAvatar>
					<Avatar
						alt={agentUser.name}
						src={agentUser.image}
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-small leading-5 truncate' }}
					primary={agentUser.name}
					secondary={
						<Typography
							className="inline capitalize"
							component="span"
							variant="body2"
							color="text.secondary"
						>
							{agentUser.email}
						</Typography>
					}
				/>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default ListItem;
