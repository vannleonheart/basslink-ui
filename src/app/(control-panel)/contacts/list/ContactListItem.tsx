import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { Contact } from '@/types/entity';
import { useMemo } from 'react';
import { UserTypes } from '@/data/static-data';
import { CountryCodeList } from '@/data/country-code';

type ContactListItemPropsType = {
	contact: Contact;
};

function ContactListItem(props: ContactListItemPropsType) {
	const { contact } = props;

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
				component={NavLinkAdapter}
				to={`/contacts/${contact.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={contact.name}
						src={null}
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-small leading-5 truncate' }}
					primary={contact.name}
					secondary={
						<Typography
							className="inline capitalize"
							component="span"
							variant="body2"
							color="text.secondary"
						>
							{countryList[contact?.country] || contact?.country} -{' '}
							{userTypes[contact?.contact_type] || contact?.contact_type}
						</Typography>
					}
				/>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default ContactListItem;
