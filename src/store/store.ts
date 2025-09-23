import { Action, ThunkAction, configureStore, createSelector } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import apiService from 'src/store/apiService';
import rootReducer from './rootReducer';
import { dynamicMiddleware } from './middleware';

export type RootState = ReturnType<typeof rootReducer>;
export const makeStore = (preloadedState?: Partial<RootState>) => {
	const store = configureStore({
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware({
				serializableCheck: {
					ignoredActions: ['fuseDialog/openDialog'],
					ignoredPaths: ['fuseDialog']
				}
			}).concat([apiService.middleware, dynamicMiddleware]),
		preloadedState
	});

	setupListeners(store.dispatch);

	return store;
};
export const store = makeStore();
export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;
export type AppAction<R = Promise<void>> = Action<string> | ThunkAction<R, RootState, unknown, Action<string>>;
export const createAppSelector = createSelector.withTypes<RootState>();
export default store;
