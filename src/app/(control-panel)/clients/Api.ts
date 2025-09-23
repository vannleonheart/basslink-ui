import { createSelector } from '@reduxjs/toolkit';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './AppSlice';
import { Client } from '@/types';

export type GroupedClients = {
	group: string;
	children?: Client[];
};

export type AccumulatorType = Record<string, GroupedClients>;

export const selectFilteredClientList = (clients: Client[]) =>
	createSelector([selectSearchText], (searchText) => {
		if (!clients) {
			return [];
		}

		if (searchText.length === 0) {
			return clients;
		}

		return FuseUtils.filterArrayByString<Client>(clients, searchText);
	});

export const selectGroupedFilteredClients = (clients: Client[]) =>
	createSelector([selectFilteredClientList(clients)], (clients) => {
		if (!clients) {
			return [];
		}

		const sortedClients = [...clients]?.sort((a, b) =>
			a?.name?.localeCompare(b?.name, 'es', { sensitivity: 'base' })
		);

		const groupedObject: Record<string, GroupedClients> = sortedClients?.reduce<AccumulatorType>((r, e) => {
			const group = e.name[0];

			if (!r[group]) {
				r[group] = { group, children: [e] };
			} else {
				r[group]?.children?.push(e);
			}

			// return accumulator
			return r;
		}, {});

		return groupedObject;
	});
