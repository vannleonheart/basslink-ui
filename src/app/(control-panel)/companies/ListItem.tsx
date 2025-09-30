import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { AgentCompany } from '@/types/entity';
import { CountryCodeList } from '@/data/country-code';

type CompanyListItemPropsType = {
	company: AgentCompany;
};

function ListItem(props: CompanyListItemPropsType) {
	const { company } = props;
	const countryName = CountryCodeList.find((x) => x.code === company?.country)?.name;

	return (
		<>
			<ListItemButton
				className="px-32 py-16"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`/companies/${company.id}/view`}
			>
				<ListItemAvatar>
					<Avatar
						alt={company.name}
						src={company.image}
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-small leading-5 truncate' }}
					primary={company.name}
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
