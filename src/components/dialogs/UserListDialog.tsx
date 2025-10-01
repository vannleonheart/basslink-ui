import { DialogContent, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { closeDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import { useAppDispatch } from '@/store/hooks';
import { User } from '@/types/entity';
import apiService from '@/store/apiService';
import { IdentityTypes, UserTypes } from '@/data/static-data';
import { CountryCodeList } from '@/data/country-code';

type UserListDialogProps = {
	onSelect: (user: User) => void;
};

export default function UserListDialog({ onSelect }: UserListDialogProps) {
	const {
		data: { accessToken }
	} = useSession();
	const [searchText, setSearchText] = useState('');
	const dispatch = useAppDispatch();
	const { data: customers, refetch } = apiService.useGetCustomersQuery({ accessToken });
	const users = useMemo(() => (customers ?? []) as User[], [customers]);

	// Filter users based on search text, take max 10 users
	const filteredData = users
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

	const handleSelectUser = (user: User) => {
		onSelect(user);
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
								{users.map((user) => (
									<div
										key={user.id}
										className="w-full py-6 px-12 border-b cursor-pointer hover:bg-gray-100 flex flex-col gap-4"
										onClick={() => handleSelectUser(user)}
									>
										<div className="flex justify-between md:items-center md:flex-row flex-col">
											<h4 className="font-bold mb-2">{user.name}</h4>
											<Typography>{userTypes[user.user_type] || user.user_type}</Typography>
										</div>
										<Typography>{countryList[user.citizenship] || user.citizenship}</Typography>
										<Typography>
											{identityTypes[user.identity_type] || user.identity_type}:{' '}
											{user.identity_no}
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
