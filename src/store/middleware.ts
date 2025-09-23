import { createDynamicMiddleware } from '@reduxjs/toolkit/react';
import type { AppDispatch, RootState } from './store';

type Config = {
	state: RootState;
	dispatch: AppDispatch;
};

const dynamicInstance = createDynamicMiddleware();

export const { middleware: dynamicMiddleware } = dynamicInstance;
export const addAppMiddleware = dynamicInstance.addMiddleware.withTypes<Config>();
export const withAppMiddleware = dynamicInstance.withMiddleware.withTypes<Config>();
export const createAppDispatchWithMiddlewareHook = dynamicInstance.createDispatchWithMiddlewareHook.withTypes<Config>();
