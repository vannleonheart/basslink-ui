import { DialogContent, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { closeDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { useAppDispatch } from '@/store/hooks';
import { ContactAccount } from '@/types/entity';
import apiService from '@/store/apiService';
import { CountryCodeList } from '@/data/country-code';

type ContactBankAccountListDialogProps = {
	id: string;
	onSelect: (account: ContactAccount) => void;
};

export default function ContactBankAccountListDialog({ id, onSelect }: ContactBankAccountListDialogProps) {
	const {
		data: { accessToken }
	} = useSession();
	const [searchText, setSearchText] = useState('');
	const { data: contactAccountsData, refetch } = apiService.useGetContactAccountsQuery({ accessToken, id });
	const accounts = useMemo(() => (contactAccountsData ?? []) as ContactAccount[], [contactAccountsData]);
	const dispatch = useAppDispatch();

	// Filter accounts based on search text, take max 10 accounts
	const filteredData = accounts
		.filter((item) => {
			if (searchText && searchText.length) {
				if (item.bank_name.toLowerCase().includes(searchText.toLowerCase())) {
					return true;
				}

				if (item.owner_name.toLowerCase().includes(searchText.toLowerCase())) {
					return true;
				}

				if (item.no.includes(searchText)) {
					return true;
				}
			}

			return false;
		})
		.slice(0, 10);

	const handleSelectAccount = (account: ContactAccount) => {
		onSelect(account);
		dispatch(closeDialog());
	};

	useEffect(() => {
		refetch();
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
		<React.Fragment>
			<DialogContent>
				<div>
					<h4 className="mb-12 font-bold">Pilih dari rekening penerima</h4>
					<TextField
						autoFocus
						className="w-full"
						size="medium"
						onChange={(e) => setSearchText(e.target.value)}
					/>
					<div className="max-h-[25vh] mt-12 overflow-y-auto">
						{filteredData.length > 0 ? (
							<div className="flex flex-col items-center gap-12">
								{accounts.map((account) => (
									<div
										key={account.id}
										className="w-full py-6 px-12 border-b cursor-pointer hover:bg-gray-100 flex flex-col gap-4"
										onClick={() => handleSelectAccount(account)}
									>
										<h4 className="font-bold mb-2">{account.bank_name}</h4>
										<Typography>
											{account.no} - {account.owner_name}
										</Typography>
										<Typography>{countryList[account.country] || account.country}</Typography>
									</div>
								))}
							</div>
						) : searchText.length > 0 ? (
							<div>Tidak ada rekening penerima yang ditemukan!</div>
						) : (
							<div>Ketik nama atau nomor rekening untuk mencari!</div>
						)}
					</div>
				</div>
			</DialogContent>
		</React.Fragment>
	);
}
