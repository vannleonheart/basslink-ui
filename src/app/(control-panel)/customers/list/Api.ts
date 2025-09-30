import { createSelector } from '@reduxjs/toolkit';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './AppSlice';
import { User } from '@/types/entity';

export type GroupedUsers = {
	group: string;
	children?: User[];
};

export type AccumulatorType = Record<string, GroupedUsers>;

export const selectFilteredUserList = (users: User[]) =>
	createSelector([selectSearchText], (searchText) => {
		if (!users) {
			return [];
		}

		if (searchText.length === 0) {
			return users;
		}

		return FuseUtils.filterArrayByString<User>(users, searchText);
	});

export const selectGroupedFilteredUsers = (users: User[]) =>
	createSelector([selectFilteredUserList(users)], (filteredUsers) => {
		if (!filteredUsers) {
			return [];
		}

		const sortedUsers = [...filteredUsers]?.sort((a, b) =>
			a?.name?.localeCompare(b?.name, 'es', { sensitivity: 'base' })
		);

		const groupedObject: Record<string, GroupedUsers> = sortedUsers?.reduce<AccumulatorType>((r, e) => {
			const group = e.name[0];

			if (!r[group]) {
				r[group] = { group, children: [e] };
			} else {
				r[group]?.children?.push(e);
			}

			return r;
		}, {});

		return groupedObject;
	});
