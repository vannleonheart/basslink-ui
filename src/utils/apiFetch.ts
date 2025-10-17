import { ApiResponse } from '@/types/component';

export const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

type FetchOptions = RequestInit;

export class FetchApiError extends Error {
	status: number;
	data: ApiResponse;

	constructor(status: number, data: ApiResponse) {
		super(`FetchApiError: ${status}`);
		this.status = status;
		this.data = data;
	}
}

export const globalHeaders: Record<string, string> = {};

export const setGlobalHeaders = (newHeaders: Record<string, string>) => {
	Object.assign(globalHeaders, newHeaders);
};

export const removeGlobalHeaders = (headerKeys: string[]) => {
	headerKeys.forEach((key) => {
		delete globalHeaders[key];
	});
};

const apiFetch = async (endpoint: string, options: FetchOptions = {}, timeout?: number | undefined | null) => {
	const { headers, method, ...restOptions } = options;

	let combinedHeaders = {
		...globalHeaders,
		...headers
	};

	combinedHeaders = Object.fromEntries(
		Object.entries(combinedHeaders).filter(([_, v]) => v !== undefined && v !== null && v !== '')
	);

	let timeoutTimer;

	const config: FetchOptions = {
		method: method ?? 'GET',
		headers: combinedHeaders,
		...restOptions
	};

	if (timeout && timeout > 0) {
		const controller = new AbortController();

		timeoutTimer = setTimeout(() => {
			controller.abort();
		}, timeout);

		config.signal = controller.signal;
	}

	const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

	if (timeoutTimer) {
		clearTimeout(timeoutTimer);
	}

	if (!response.ok) {
		const responseJson = await response.json();

		throw new FetchApiError(response.status, responseJson as ApiResponse);
	}

	return response;
};

export default apiFetch;
