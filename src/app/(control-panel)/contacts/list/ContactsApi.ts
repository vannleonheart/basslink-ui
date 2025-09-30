import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'src/store/apiService';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './contactsAppSlice';
import { Contact } from '@/types/entity';

export const addTagTypes = ['contacts_item', 'contacts', 'contacts_tag', 'contacts_tags', 'countries'] as const;

const ContactsApi = api.enhanceEndpoints({
	addTagTypes
});

export default ContactsApi;

export type GetContactsItemApiResponse = Contact;
export type GetContactsItemApiArg = string;

export type UpdateContactsItemApiResponse = /** status 200 Contact Updated */ Contact;
export type UpdateContactsItemApiArg = Contact;

export type DeleteContactsItemApiResponse = unknown;
export type DeleteContactsItemApiArg = string;

export type GetContactsListApiResponse = /** status 200 OK */ Contact[];
export type GetContactsListApiArg = void;

export type CreateContactsItemApiResponse = /** status 201 Created */ Contact;
export type CreateContactsItemApiArg = {
	contact: Contact;
};

export type GroupedContacts = {
	group: string;
	children?: Contact[];
};

export type AccumulatorType = Record<string, GroupedContacts>;

export const selectFilteredContactList = (contacts: Contact[]) =>
	createSelector([selectSearchText], (searchText) => {
		if (!contacts) {
			return [];
		}

		if (searchText.length === 0) {
			return contacts;
		}

		return FuseUtils.filterArrayByString<Contact>(contacts, searchText);
	});

export const selectGroupedFilteredContacts = (contacts: Contact[]) =>
	createSelector([selectFilteredContactList(contacts)], (contacts) => {
		if (!contacts) {
			return [];
		}

		const sortedContacts = [...contacts]?.sort((a, b) =>
			a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
		);

		const groupedObject: Record<string, GroupedContacts> = sortedContacts?.reduce<AccumulatorType>((r, e) => {
			const group = e.name[0];

			if (!r[group]) r[group] = { group, children: [e] };
			else {
				r[group]?.children?.push(e);
			}

			return r;
		}, {});

		return groupedObject;
	});
