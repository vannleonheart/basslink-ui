import { WithSlice, createSlice } from '@reduxjs/toolkit';
import rootReducer from '@/store/rootReducer';
import React from 'react';

const initialState = { searchText: '' };

export const appSlice = createSlice({
	name: 'agents',
	initialState,
	reducers: {
		setSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload as string;
			},
			prepare: (event: React.ChangeEvent<HTMLInputElement>) => ({
				payload: `${event?.target?.value}` || '',
				meta: undefined,
				error: null
			})
		},
		resetSearchText: (state) => {
			state.searchText = initialState.searchText;
		}
	},
	selectors: {
		selectSearchText: (state) => state.searchText
	}
});

rootReducer.inject(appSlice);

const injectedSlice = appSlice.injectInto(rootReducer);

declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof appSlice> {}
}

export const { setSearchText, resetSearchText } = appSlice.actions;
export const { selectSearchText } = injectedSlice.selectors;

const searchTextReducer = appSlice.reducer;

export default searchTextReducer;
