import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { Client } from '@/types';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import DialogClientCreateOrEdit from '@/components/dialogs/DialogClientCreateOrEdit';
import { useAppDispatch } from '@/store/hooks';
import { CountryCodeList } from '@/data/country-code';

type ClientListItemPropsType = {
	client: Client;
	fetch: () => void;
	allowUpdate?: boolean;
};

function ListItem(props: ClientListItemPropsType) {
	const { client, fetch, allowUpdate } = props;
	const dispatch = useAppDispatch();
	const handleEditClient = (client: Client) => {
		dispatch(
			openDialog({
				children: (
					<DialogClientCreateOrEdit
						client={client}
						callbackAction={fetch}
					/>
				),
				fullWidth: true,
				disableBackdropClick: true,
				disableEscapeKeyDown: true
			})
		);
	};
	const countryName = CountryCodeList.find((x) => x.code === client?.country)?.name;

	return (
		<>
			<ListItemButton
				className="px-32 py-16"
				sx={{ bgcolor: 'background.paper' }}
				onClick={() => {
					if (allowUpdate) {
						handleEditClient(client);
					}
				}}
			>
				<ListItemAvatar>
					<Avatar
						alt={client.name}
						src={client.image}
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-small leading-5 truncate' }}
					primary={client.name}
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
