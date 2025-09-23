import { DialogContent } from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { ClientContact } from '@/types';
import { useSession } from 'next-auth/react';
import { clientGetContacts } from '@/utils/apiCall';
import { closeDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { useAppDispatch } from '@/store/hooks';

type ContactListDialogProps = {
	onSelect: (contact: ClientContact) => void;
};

export default function ContactListDialog({ onSelect }: ContactListDialogProps) {
	const {
		data: { accessToken }
	} = useSession();
	const [searchText, setSearchText] = useState('');
	const [contacts, setContacts] = useState<ClientContact[]>([]);
	const dispatch = useAppDispatch();
	const fetchContacts = () => {
		if (accessToken) {
			clientGetContacts(accessToken).then((resp) => {
				if (resp.status === 'success') {
					setContacts(resp.data as ClientContact[]);
				}
			});
		}
	};

	// Filter contacts based on search text, take max 10 contacts
	const filteredData = contacts
		.filter((item) => {
			if (searchText && searchText.length) {
				return item.name.toLowerCase().includes(searchText.toLowerCase());
			}

			return false;
		})
		.slice(0, 10);

	const handleSelectContact = (contact: ClientContact) => {
		onSelect(contact);
		dispatch(closeDialog());
	};

	useEffect(() => {
		fetchContacts();
	}, []);

	return (
		<React.Fragment>
			<DialogContent>
				<div>
					<h4 className="mb-12 font-bold">Select from your contact</h4>
					<TextField
						autoFocus
						className="w-full"
						size="medium"
						onChange={(e) => setSearchText(e.target.value)}
					/>
					<div className="max-h-[25vh] mt-12 overflow-y-auto">
						{filteredData.length > 0 ? (
							<div className="flex flex-col items-center gap-12">
								{contacts.map((contact) => (
									<div
										key={contact.id}
										className="w-full py-6 border-b cursor-pointer hover:bg-gray-100"
										onClick={() => handleSelectContact(contact)}
									>
										<h4 className="font-bold mb-2">{contact.name}</h4>
										<div className="capitalize text-sm">{contact.country}</div>
									</div>
								))}
							</div>
						) : searchText.length > 0 ? (
							<div>No contact found!</div>
						) : (
							<div>Type contact name to search!</div>
						)}
					</div>
				</div>
			</DialogContent>
		</React.Fragment>
	);
}
