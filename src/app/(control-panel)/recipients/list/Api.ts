import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'src/store/apiService';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './AppSlice';
import { Recipient } from '@/types/entity';

export const addTagTypes = ['recipients_item', 'recipients', 'recipients_tag', 'recipients_tags', 'countries'] as const;

const RecipientsApi = api.enhanceEndpoints({
	addTagTypes
});

export default RecipientsApi;

export type GetRecipientsItemApiResponse = Recipient;
export type GetRecipientsItemApiArg = string;

export type UpdateRecipientsItemApiResponse = /** status 200 Recipients Updated */ Recipient;
export type UpdateRecipientsItemApiArg = Recipient;

export type DeleteRecipientsItemApiResponse = unknown;
export type DeleteRecipientsItemApiArg = string;

export type GetRecipientsListApiResponse = /** status 200 OK */ Recipient[];
export type GetRecipientsListApiArg = void;

export type CreateRecipientsItemApiResponse = /** status 201 Created */ Recipient;
export type CreateRecipientsItemApiArg = {
	recipient: Recipient;
};

export type GroupedRecipients = {
	group: string;
	children?: Recipient[];
};

export type AccumulatorType = Record<string, GroupedRecipients>;

export const selectFilteredRecipientList = (recipients: Recipient[]) =>
	createSelector([selectSearchText], (searchText) => {
		if (!recipients) {
			return [];
		}

		if (searchText.length === 0) {
			return recipients;
		}

		return FuseUtils.filterArrayByString<Recipient>(recipients, searchText);
	});

export const selectGroupedFilteredRecipients = (recipients: Recipient[]) =>
	createSelector([selectFilteredRecipientList(recipients)], (recipients) => {
		if (!recipients) {
			return [];
		}

		const sortedRecipients = [...recipients]?.sort((a, b) =>
			a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
		);

		const groupedObject: Record<string, GroupedRecipients> = sortedRecipients?.reduce<AccumulatorType>((r, e) => {
			const group = e.name[0];

			if (!r[group]) r[group] = { group, children: [e] };
			else {
				r[group]?.children?.push(e);
			}

			return r;
		}, {});

		return groupedObject;
	});
