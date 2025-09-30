import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { Agent } from '@/types/entity';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import DialogAgentCreateOrEdit from '@/components/dialogs/DialogAgentCreateOrEdit';
import { useAppDispatch } from '@/store/hooks';
import { CountryCodeList } from '@/data/country-code';

type AgentListItemPropsType = {
	agent: Agent;
	fetch: () => void;
};

function ListItem(props: AgentListItemPropsType) {
	const { agent, fetch } = props;
	const dispatch = useAppDispatch();
	const handleEditAgent = (agent: Agent) => {
		dispatch(
			openDialog({
				children: (
					<DialogAgentCreateOrEdit
						agent={agent}
						callbackAction={fetch}
					/>
				),
				fullWidth: true,
				disableBackdropClick: true,
				disableEscapeKeyDown: true
			})
		);
	};
	const countryName = CountryCodeList.find((x) => x.code === agent?.country)?.name;

	return (
		<>
			<ListItemButton
				className="px-32 py-16"
				sx={{ bgcolor: 'background.paper' }}
				onClick={() => handleEditAgent(agent)}
			>
				<ListItemAvatar>
					<Avatar
						alt={agent.name}
						src={null}
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-small leading-5 truncate' }}
					primary={agent.name}
					secondary={
						<Typography
							className="inline capitalize"
							component="span"
							variant="body2"
							color="text.secondary"
						>
							{countryName}
						</Typography>
					}
				/>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default ListItem;
