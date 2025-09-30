import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import { API_BASE_URL, globalHeaders } from '@/utils/apiFetch';
import { ApiResponse } from '@/types/component';
import { jsonify } from '@/utils/apiCall';

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, object, FetchBaseQueryMeta> = async (
	args,
	api,
	extraOptions
) => {
	return fetchBaseQuery({
		baseUrl: API_BASE_URL,
		prepareHeaders: (headers) => {
			Object.entries(globalHeaders).forEach(([key, value]) => {
				if (!headers.has(key)) {
					headers.set(key, value);
				}
			});

			headers.forEach((value, key) => {
				if (value === undefined || value === null || value === '') {
					headers.delete(key);
				}
			});

			return headers;
		}
	})(args, api, extraOptions);
};

const transformResponse = (response: ApiResponse) => {
	if (response?.status === 'success') {
		return response.data;
	}

	return [];
};

export const apiService = createApi({
	baseQuery,
	endpoints: (build) => ({
		getAgents: build.query({
			query: (args) => {
				const { side, accessToken } = args;
				return {
					url: `/${side}/agents`,
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				};
			},
			transformResponse
		}),
		getClients: build.query({
			query: (args) => {
				const { side, accessToken } = args;
				return {
					url: `/${side}/clients`,
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				};
			},
			transformResponse
		}),
		getDeals: build.query({
			query: (args) => {
				const { side, accessToken, filter } = args;
				return {
					url: `/${side}/deals`,
					params: filter,
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				};
			},
			transformResponse
		}),
		getDealById: build.query({
			query: (args) => {
				const { side, accessToken, id } = args;
				return {
					url: `/${side}/deals/${id}`,
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				};
			},
			transformResponse
		}),
		getDealMessagesByDealId: build.query({
			query: (args) => {
				const { side, accessToken, id } = args;
				return {
					url: `/${side}/deals/${id}/messages`,
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				};
			},
			transformResponse
		}),
		getUsers: build.query({
			query: (args) => {
				const { side, accessToken } = args;
				return {
					url: `/${side}/users`,
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				};
			},
			transformResponse
		}),
		getUserById: build.query({
			query: (args) => {
				const { side, accessToken, id } = args;
				return {
					url: `/${side}/users/${id}`,
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				};
			},
			transformResponse
		}),
		createUser: build.mutation({
			query: (args) => {
				const { side, accessToken, data } = args;
				return {
					url: `/${side}/users`,
					method: 'POST',
					body: data,
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				};
			}
		}),
		updateUser: build.mutation({
			query: (args) => {
				const { side, accessToken, id, data } = args;
				return {
					url: `/${side}/users/${id}/update`,
					method: 'POST',
					body: data,
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				};
			}
		}),
		deleteUserById: build.mutation({
			query: (args) => {
				const { side, accessToken, id } = args;
				return {
					url: `/${side}/users/${id}/delete`,
					method: 'POST',
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				};
			}
		}),
		getCurrencies: build.query({
			query: () => '/currencies',
			transformResponse
		}),
		syncRates: build.mutation({
			query: () => {
				return {
					url: `/rates/sync`,
					method: 'POST'
				};
			}
		}),
		getRates: build.query({
			query: (args) => {
				const { accessToken } = args;
				return {
					url: `/admin/rates`,
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				};
			},
			transformResponse
		}),
		updateRates: build.mutation({
			query: (args) => {
				const { accessToken, data } = args;
				return {
					url: `/admin/rates/update`,
					method: 'POST',
					body: jsonify(data),
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				};
			}
		}),
		uploadFile: build.mutation({
			query: (args) => {
				const { accessToken, data = {}, path = '/upload' } = args;

				return {
					url: path,
					method: 'POST',
					body: data,
					headers: {
						'Content-Type': '',
						Authorization: `Bearer ${accessToken}`
					}
				};
			}
		}),
		createDisbursement: build.mutation({
			query: (args) => {
				const { accessToken, data = {} } = args;

				return {
					url: '/agent/disbursements',
					method: 'POST',
					body: jsonify(data),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`
					}
				};
			}
		}),
		createCustomer: build.mutation({
			query: (args) => {
				const { accessToken, data = {} } = args;

				return {
					url: '/agent/users',
					method: 'POST',
					body: jsonify(data),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`
					}
				};
			}
		}),
		getCustomers: build.query({
			query: (args) => {
				const { accessToken } = args;
				return {
					url: `/agent/users`,
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				};
			},
			transformResponse
		}),
		createContact: build.mutation({
			query: (args) => {
				const { accessToken, data = {} } = args;

				return {
					url: '/agent/contacts',
					method: 'POST',
					body: jsonify(data),
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`
					}
				};
			}
		}),
		getContacts: build.query({
			query: (args) => {
				const { accessToken } = args;
				return {
					url: `/agent/contacts`,
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				};
			},
			transformResponse
		}),
		getContactAccounts: build.query({
			query: (args) => {
				const { accessToken, id } = args;
				return {
					url: `/agent/contacts/${id}/accounts`,
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				};
			},
			transformResponse
		})
	}),
	reducerPath: 'apiService'
});

export default apiService;
