import { createSelector } from '@reduxjs/toolkit';
import { apiService as api } from 'src/store/apiService';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './contactsAppSlice';
import { ClientContact } from '@/types';

export const addTagTypes = ['contacts_item', 'contacts', 'contacts_tag', 'contacts_tags', 'countries'] as const;

const ContactsApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getContactsList: build.query<GetContactsListApiResponse, GetContactsListApiArg>({
				query: () => ({ url: `/api/mock/contacts/items` }),
				providesTags: ['contacts']
			}),
			createContactsItem: build.mutation<CreateContactsItemApiResponse, CreateContactsItemApiArg>({
				query: (queryArg) => ({
					url: `/api/mock/contacts/items`,
					method: 'POST',
					body: queryArg.contact
				}),
				invalidatesTags: ['contacts']
			}),
			getContactsItem: build.query<GetContactsItemApiResponse, GetContactsItemApiArg>({
				query: (contactId) => ({
					url: `/api/mock/contacts/items/${contactId}`
				}),
				providesTags: ['contacts_item']
			}),
			updateContactsItem: build.mutation<UpdateContactsItemApiResponse, UpdateContactsItemApiArg>({
				query: (contact) => ({
					url: `/api/mock/contacts/items/${contact.id}`,
					method: 'PUT',
					body: contact
				}),
				invalidatesTags: ['contacts_item', 'contacts']
			}),
			deleteContactsItem: build.mutation<DeleteContactsItemApiResponse, DeleteContactsItemApiArg>({
				query: (contactId) => ({
					url: `/api/mock/contacts/items/${contactId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['contacts']
			})
		}),
		overrideExisting: false
	});

export default ContactsApi;

export type GetContactsItemApiResponse = ClientContact;
export type GetContactsItemApiArg = string;

export type UpdateContactsItemApiResponse = /** status 200 Contact Updated */ ClientContact;
export type UpdateContactsItemApiArg = ClientContact;

export type DeleteContactsItemApiResponse = unknown;
export type DeleteContactsItemApiArg = string;

export type GetContactsListApiResponse = /** status 200 OK */ ClientContact[];
export type GetContactsListApiArg = void;

export type CreateContactsItemApiResponse = /** status 201 Created */ ClientContact;
export type CreateContactsItemApiArg = {
	contact: ClientContact;
};

export type GroupedContacts = {
	group: string;
	children?: ClientContact[];
};

export type AccumulatorType = Record<string, GroupedContacts>;

export const selectFilteredContactList = (contacts: ClientContact[]) =>
	createSelector([selectSearchText], (searchText) => {
		if (!contacts) {
			return [];
		}

		if (searchText.length === 0) {
			return contacts;
		}

		return FuseUtils.filterArrayByString<ClientContact>(contacts, searchText);
	});

export const selectGroupedFilteredContacts = (contacts: ClientContact[]) =>
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
