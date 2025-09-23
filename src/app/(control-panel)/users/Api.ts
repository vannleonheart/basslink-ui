import { createSelector } from '@reduxjs/toolkit';
import FuseUtils from '@fuse/utils';
import { selectSearchText } from './AppSlice';
import { AgentUser } from '@/types';

export type GroupedAgentUsers = {
	group: string;
	children?: AgentUser[];
};

export type AccumulatorType = Record<string, GroupedAgentUsers>;

export const selectFilteredAgentUserList = (agentUsers: AgentUser[]) =>
	createSelector([selectSearchText], (searchText) => {
		if (!agentUsers) {
			return [];
		}

		if (searchText.length === 0) {
			return agentUsers;
		}

		return FuseUtils.filterArrayByString<AgentUser>(agentUsers, searchText);
	});

export const selectGroupedFilteredAgentUsers = (agentUsers: AgentUser[]) =>
	createSelector([selectFilteredAgentUserList(agentUsers)], (agentUsers) => {
		if (!agentUsers) {
			return [];
		}

		const sortedAgentUsers = [...agentUsers]?.sort((a, b) =>
			a?.name?.localeCompare(b?.name, 'es', { sensitivity: 'base' })
		);

		const groupedObject: Record<string, GroupedAgentUsers> = sortedAgentUsers?.reduce<AccumulatorType>((r, e) => {
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
