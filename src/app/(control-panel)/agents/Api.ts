import { createSelector } from '@reduxjs/toolkit';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './AppSlice';
import { Agent } from '@/types';

export type GroupedAgents = {
	group: string;
	children?: Agent[];
};

export type AccumulatorType = Record<string, GroupedAgents>;

export const selectFilteredAgentList = (agents: Agent[]) =>
	createSelector([selectSearchText], (searchText) => {
		if (!agents) {
			return [];
		}

		if (searchText.length === 0) {
			return agents;
		}

		return FuseUtils.filterArrayByString<Agent>(agents, searchText);
	});

export const selectGroupedFilteredAgents = (agents: Agent[]) =>
	createSelector([selectFilteredAgentList(agents)], (agents) => {
		if (!agents) {
			return [];
		}

		const sortedAgents = [...agents]?.sort((a, b) =>
			a?.name?.localeCompare(b?.name, 'es', { sensitivity: 'base' })
		);

		const groupedObject: Record<string, GroupedAgents> = sortedAgents?.reduce<AccumulatorType>((r, e) => {
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
