import { createSelector } from '@reduxjs/toolkit';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './AppSlice';
import { AgentCompany } from '@/types';

export type GroupedCompanies = {
	group: string;
	children?: AgentCompany[];
};

export type AccumulatorType = Record<string, GroupedCompanies>;

export const selectFilteredCompanyList = (companies: AgentCompany[]) =>
	createSelector([selectSearchText], (searchText) => {
		if (!companies) {
			return [];
		}

		if (searchText.length === 0) {
			return companies;
		}

		return FuseUtils.filterArrayByString<AgentCompany>(companies, searchText);
	});

export const selectGroupedFilteredCompanies = (companies: AgentCompany[]) =>
	createSelector([selectFilteredCompanyList(companies)], (companies) => {
		if (!companies) {
			return [];
		}

		const sortedCompanies = [...companies]?.sort((a, b) =>
			a?.name?.localeCompare(b?.name, 'es', { sensitivity: 'base' })
		);

		const groupedObject: Record<string, GroupedCompanies> = sortedCompanies?.reduce<AccumulatorType>((r, e) => {
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
