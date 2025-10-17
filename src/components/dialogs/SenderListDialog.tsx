import { DialogContent, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { closeDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { useAppDispatch } from '@/store/hooks';
import { Sender } from '@/types/entity';
import apiService from '@/store/apiService';
import { IdentityTypes, UserTypes } from '@/data/static-data';
import { CountryCodeList } from '@/data/country-code';

type SenderListDialogProps = {
	onSelect: (user: Sender) => void;
};

export default function SenderListDialog({ onSelect }: SenderListDialogProps) {
	const {
		data: { accessToken }
	} = useSession();
	const [searchText, setSearchText] = useState('');
	const dispatch = useAppDispatch();
	const { data: sendersData, refetch } = apiService.useGetSendersQuery({ accessToken });
	const senders = useMemo(() => (sendersData ?? []) as Sender[], [sendersData]);

	// Filter senders based on search text, take max 10 senders
	const filteredData = senders
		.filter((item) => {
			if (searchText && searchText.length) {
				if (item.name.toLowerCase().includes(searchText.toLowerCase())) {
					return true;
				}

				if (item.identity_no && item.identity_no.toLowerCase().includes(searchText.toLowerCase())) {
					return true;
				}
			}

			return false;
		})
		.slice(0, 10);

	const handleSelectSender = (sender: Sender) => {
		onSelect(sender);
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

	const countryList = useMemo(() => {
		const countries: Record<string, string> = {};
		Object.keys(CountryCodeList).map((key) => {
			const country = CountryCodeList[key];
			countries[country.code] = country.name;
		});
		return countries;
	}, []);

	const identityTypes = useMemo(() => {
		const types: Record<string, string> = {};
		Object.keys(IdentityTypes).forEach((key) => {
			types[key] = IdentityTypes[key];
		});
		return types;
	}, []);

	return (
		<React.Fragment>
			<DialogContent>
				<div>
					<h4 className="mb-12 font-bold">Pilih dari daftar pengirim</h4>
					<TextField
						autoFocus
						className="w-full"
						size="medium"
						onChange={(e) => setSearchText(e.target.value)}
					/>
					<div className="max-h-[25vh] mt-12 overflow-y-auto">
						{filteredData.length > 0 ? (
							<div className="flex flex-col items-center gap-12">
								{senders.map((sender) => (
									<div
										key={sender.id}
										className="w-full py-6 px-12 border-b cursor-pointer hover:bg-gray-100 flex flex-col gap-4"
										onClick={() => handleSelectSender(sender)}
									>
										<div className="flex justify-between md:items-center md:flex-row flex-col">
											<h4 className="font-bold mb-2">{sender.name}</h4>
											<Typography>
												{userTypes[sender.sender_type] || sender.sender_type}
											</Typography>
										</div>
										<Typography>{countryList[sender.citizenship] || sender.citizenship}</Typography>
										<Typography>
											{identityTypes[sender.identity_type] || sender.identity_type}:{' '}
											{sender.identity_no}
										</Typography>
									</div>
								))}
							</div>
						) : searchText.length > 0 ? (
							<div>Data pengirim tidak ditemukan!</div>
						) : (
							<div>Ketik nama pengirim atau nomor identitas untuk mencari!</div>
						)}
					</div>
				</div>
			</DialogContent>
		</React.Fragment>
	);
}
