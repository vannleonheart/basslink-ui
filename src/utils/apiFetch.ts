export const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

type FetchOptions = RequestInit;
type ApiResponse = {
	status: string;
	code: string;
	message?: string;
	data?: unknown;
};
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
const apiFetch = async (endpoint: string, options: FetchOptions = {}, timeout = 10000) => {
	const { headers, ...restOptions } = options;
	let combinedHeaders = {
		...globalHeaders,
		...headers
	};
	combinedHeaders = Object.fromEntries(
		Object.entries(combinedHeaders).filter(([_, v]) => v !== undefined && v !== null && v !== '')
	);
	const config: FetchOptions = {
		headers: combinedHeaders,
		...restOptions
	};
	const controller = new AbortController();
	const timeoutId = setTimeout(() => {
		controller.abort();
	}, timeout);

	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...config,
		signal: controller.signal
	});

	clearTimeout(timeoutId);

	if (!response.ok) {
		const responseJson = await response.json();
		throw new FetchApiError(response.status, responseJson as ApiResponse);
	}

	return response;
};

export default apiFetch;
