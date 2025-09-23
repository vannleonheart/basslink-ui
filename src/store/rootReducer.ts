import { combineSlices } from '@reduxjs/toolkit';
import apiService from './apiService';
import { navigationSlice } from '@/components/theme-layouts/components/navigation/store/navigationSlice';

export interface LazyLoadedSlices {}
export const rootReducer = combineSlices(navigationSlice, {
	[apiService.reducerPath]: apiService.reducer
}).withLazyLoadedSlices<LazyLoadedSlices>();
export default rootReducer;
