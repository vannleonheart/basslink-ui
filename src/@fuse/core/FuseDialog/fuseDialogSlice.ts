import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { ReactElement } from 'react';
import rootReducer from '@/store/rootReducer';

type InitialStateProps = {
	open: boolean;
	children: ReactElement | string;
	fullWidth?: boolean;
	maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
	disableEscapeKeyDown?: boolean;
	disableBackdropClick?: boolean;
};

const initialState: InitialStateProps = {
	open: false,
	children: '',
	fullWidth: false,
	maxWidth: 'sm',
	disableEscapeKeyDown: false,
	disableBackdropClick: false
};

export const fuseDialogSlice = createSlice({
	name: 'fuseDialog',
	initialState,
	reducers: {
		openDialog: (
			state,
			action: PayloadAction<{
				children: InitialStateProps['children'];
				fullWidth?: InitialStateProps['fullWidth'];
				maxWidth?: InitialStateProps['maxWidth'];
				disableEscapeKeyDown?: InitialStateProps['disableEscapeKeyDown'];
				disableBackdropClick?: InitialStateProps['disableBackdropClick'];
			}>
		) => {
			state.open = true;
			state.children = action.payload.children;
			state.fullWidth = action.payload.fullWidth || false;
			state.maxWidth = action.payload.maxWidth || 'sm';
			state.disableEscapeKeyDown = action.payload.disableEscapeKeyDown || false;
			state.disableBackdropClick = action.payload.disableBackdropClick || false;
		},
		closeDialog: () => initialState
	},
	selectors: {
		selectFuseDialogState: (fuseDialog) => fuseDialog.open,
		selectFuseDialogProps: (fuseDialog) => fuseDialog
	}
});

rootReducer.inject(fuseDialogSlice);

const injectedSlice = fuseDialogSlice.injectInto(rootReducer);

declare module '@/store/rootReducer' {
	export interface LazyLoadedSlices extends WithSlice<typeof fuseDialogSlice> {}
}

export const { closeDialog, openDialog } = fuseDialogSlice.actions;
export const { selectFuseDialogState, selectFuseDialogProps } = injectedSlice.selectors;
export type dialogSliceType = typeof fuseDialogSlice;
export default fuseDialogSlice.reducer;
