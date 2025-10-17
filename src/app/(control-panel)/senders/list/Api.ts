import { createSelector } from '@reduxjs/toolkit';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './AppSlice';
import { Sender } from '@/types/entity';

export type GroupedSenders = {
	group: string;
	children?: Sender[];
};

export type AccumulatorType = Record<string, GroupedSenders>;

export const selectFilteredSenderList = (senders: Sender[]) =>
	createSelector([selectSearchText], (searchText) => {
		if (!senders) {
			return [];
		}

		if (searchText.length === 0) {
			return senders;
		}

		return FuseUtils.filterArrayByString<Sender>(senders, searchText);
	});

export const selectGroupedFilteredSenders = (senders: Sender[]) =>
	createSelector([selectFilteredSenderList(senders)], (filteredSenders) => {
		if (!filteredSenders || filteredSenders.length === 0) {
			return [];
		}

		const sortedSenders = [...filteredSenders]?.sort((a, b) =>
			a?.name?.localeCompare(b?.name, 'es', { sensitivity: 'base' })
		);

		const groupedObject: Record<string, GroupedSenders> = sortedSenders?.reduce<AccumulatorType>((r, e) => {
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
