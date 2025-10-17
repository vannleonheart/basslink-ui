import { DialogContent, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { closeDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { useAppDispatch } from '@/store/hooks';
import { Recipient } from '@/types/entity';
import apiService from '@/store/apiService';
import { UserTypes } from '@/data/static-data';

type RecipientListDialogProps = {
	onSelect: (recipient: Recipient) => void;
};

export default function RecipientListDialog({ onSelect }: RecipientListDialogProps) {
	const {
		data: { accessToken }
	} = useSession();
	const [searchText, setSearchText] = useState('');
	const { data: recipientsData, refetch } = apiService.useGetRecipientsQuery({ accessToken });
	const recipients = useMemo(() => (recipientsData ?? []) as Recipient[], [recipientsData]);
	const dispatch = useAppDispatch();

	// Filter recipients based on search text, take max 10 recipients
	const filteredData = recipients
		.filter((item) => {
			if (searchText && searchText.length) {
				if (item.name.toLowerCase().includes(searchText.toLowerCase())) {
					return true;
				}
			}

			return false;
		})
		.slice(0, 10);

	const handleSelectRecipient = (recipient: Recipient) => {
		onSelect(recipient);
		dispatch(closeDialog());
	};

	useEffect(() => {
		refetch();
	}, []);

	const userTypes = useMemo(() => {
		const types: Record<string, string> = {};
		Object.keys(UserTypes).forEach((key) => {
			types[key] = UserTypes[key];
		});
		return types;
	}, []);

	return (
		<React.Fragment>
			<DialogContent>
				<div>
					<h4 className="mb-12 font-bold">Pilih dari daftar penerima</h4>
					<TextField
						autoFocus
						className="w-full"
						size="medium"
						onChange={(e) => setSearchText(e.target.value)}
					/>
					<div className="max-h-[25vh] mt-12 overflow-y-auto">
						{filteredData.length > 0 ? (
							<div className="flex flex-col items-center gap-12">
								{recipients.map((recipient) => (
									<div
										key={recipient.id}
										className="w-full py-6 px-12 border-b cursor-pointer hover:bg-gray-100 flex flex-col gap-4"
										onClick={() => handleSelectRecipient(recipient)}
									>
										<div className="flex justify-between md:items-center md:flex-row flex-col">
											<h4 className="font-bold mb-2">{recipient.name}</h4>
											<Typography>
												{userTypes[recipient.recipient_type] || recipient.recipient_type}
											</Typography>
										</div>
									</div>
								))}
							</div>
						) : searchText.length > 0 ? (
							<div>Data penerima tidak ditemukan!</div>
						) : (
							<div>Ketik nama penerima atau nomor identitas untuk mencari!</div>
						)}
					</div>
				</div>
			</DialogContent>
		</React.Fragment>
	);
}
