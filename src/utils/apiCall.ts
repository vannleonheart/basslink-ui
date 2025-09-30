import { ApiResponse, DownloadOptions, ProfileSettings, SecuritySettings } from '@/types/component';
import {
	CreateOrEditAgentFormData,
	CreateOrEditClientFormData,
	DisbursementChatFormData,
	SignInFormData
} from '@/types/form';
import apiFetch, { setGlobalHeaders } from '@/utils/apiFetch';

setGlobalHeaders({ 'Content-Type': 'application/json' });

export const jsonify = (data: unknown) => {
	return JSON.stringify(data, (_key, value) => {
		if (value) {
			return value;
		}
	});
};

export async function post(url: string, data: unknown, accessToken?: string): Promise<Response> {
	const headers = {};

	if (accessToken && accessToken.length) {
		headers['Authorization'] = `Bearer ${accessToken}`;
	}

	return apiFetch(url, {
		method: 'POST',
		body: jsonify(data),
		headers
	});
}

export async function put(url: string, data: unknown, accessToken?: string): Promise<Response> {
	const headers = {};

	if (accessToken && accessToken.length) {
		headers['Authorization'] = `Bearer ${accessToken}`;
	}

	return apiFetch(url, {
		method: 'PUT',
		body: jsonify(data),
		headers
	});
}

export async function del(url: string, data: unknown, accessToken?: string): Promise<Response> {
	const headers = {};

	if (accessToken && accessToken.length) {
		headers['Authorization'] = `Bearer ${accessToken}`;
	}

	return apiFetch(url, {
		method: 'DELETE',
		body: jsonify(data),
		headers
	});
}

export async function postJson(url: string, data: unknown, accessToken?: string): Promise<ApiResponse> {
	const resp = await post(url, data, accessToken);

	return await resp.json();
}

export async function putJson(url: string, data: unknown, accessToken?: string): Promise<ApiResponse> {
	const resp = await put(url, data, accessToken);

	return await resp.json();
}

export async function deleteJson(url: string, data: unknown, accessToken?: string): Promise<ApiResponse> {
	const resp = await del(url, data, accessToken);

	return await resp.json();
}

export async function getJson(url: string, accessToken?: string): Promise<ApiResponse> {
	const headers = {};

	if (accessToken && accessToken.length) {
		headers['Authorization'] = `Bearer ${accessToken}`;
	}

	const resp = await apiFetch(url, {
		headers
	});

	return await resp.json();
}

export async function getRates(
	from: string,
	to: string,
	amount?: number,
	through?: string,
	source?: string
): Promise<ApiResponse> {
	let qs = `from=${from}&to=${to}`;

	if (amount) {
		qs += `&amount=${amount}`;
	}

	if (through) {
		qs += `&through=${through}`;
	}

	if (source) {
		qs += `&source=${source}`;
	}

	return await getJson(`/rates?${qs}`);
}

/** Agent Endpoints **/

export async function agentAuthSignin(data: SignInFormData): Promise<ApiResponse> {
	return await postJson('/agent/auth/signin', data);
}

export async function agentGetProfile(accessToken: string): Promise<ApiResponse> {
	return await getJson('/agent/account/profile', accessToken);
}

export async function agentUpdateProfile(data: ProfileSettings, accessToken: string): Promise<ApiResponse> {
	return await postJson('/agent/account/profile/update', data, accessToken);
}

export async function agentUpdatePassword(data: SecuritySettings, accessToken: string): Promise<ApiResponse> {
	return await postJson('/agent/account/profile/update_password', data, accessToken);
}

export async function agentGetTelegramConnects(accessToken: string): Promise<ApiResponse> {
	return await getJson('/agent/account/telegramconnects', accessToken);
}

export async function agentCreateClient(data: CreateOrEditClientFormData, accessToken: string): Promise<ApiResponse> {
	return await postJson('/agent/clients', data, accessToken);
}

export async function agentUpdateClientById(
	clientId: string,
	data: CreateOrEditClientFormData,
	accessToken: string
): Promise<ApiResponse> {
	return await postJson(`/agent/clients/${clientId}/update`, data, accessToken);
}

export async function agentDeleteClientById(clientId: string, accessToken: string): Promise<ApiResponse> {
	return await postJson(`/agent/clients/${clientId}/delete`, {}, accessToken);
}

export async function agentGetCompanies(accessToken: string): Promise<ApiResponse> {
	return await getJson('/agent/companies', accessToken);
}

export async function agentGetCompanyById(companyId: string, accessToken: string): Promise<ApiResponse> {
	return await getJson(`/agent/companies/${companyId}`, accessToken);
}

export async function agentDeleteCompanyById(companyId: string, accessToken: string): Promise<ApiResponse> {
	return await postJson(`/agent/companies/${companyId}/delete`, {}, accessToken);
}

export async function agentGetCompanyAccounts(companyId: string, accessToken: string): Promise<ApiResponse> {
	return await getJson(`/agent/companies/${companyId}/accounts`, accessToken);
}

export async function agentRejectDeal(dealId: string, accessToken: string): Promise<ApiResponse> {
	return await postJson(`/agent/deals/${dealId}/reject`, {}, accessToken);
}

export async function agentSubmitTerms(dealId: string, data: unknown, accessToken: string): Promise<ApiResponse> {
	return await postJson(`/agent/deals/${dealId}/propose`, data, accessToken);
}

export async function agentConfirmReceiveFund(dealId: string, accessToken: string): Promise<ApiResponse> {
	return await postJson(`/agent/deals/${dealId}/receiveFund`, {}, accessToken);
}

export async function agentConfirmReturnSent(dealId: string, accessToken: string): Promise<ApiResponse> {
	return await postJson(`/agent/deals/${dealId}/sendReturn`, {}, accessToken);
}

export async function agentSendChat(
	dealId: string,
	data: DisbursementChatFormData,
	accessToken: string
): Promise<ApiResponse> {
	return await postJson(`/agent/deals/${dealId}/message`, data, accessToken);
}

export async function agentDownloadDeals(accessToken: string, options?: DownloadOptions) {
	return await post(`/agent/deals/download`, options, accessToken);
}

export async function agentUploadFiles(files: File[], accessToken: string): Promise<ApiResponse> {
	const formData = new FormData();

	files.forEach((file) => {
		formData.append('files', file);
	});

	const resp = await apiFetch(
		'/agent/files/upload',
		{
			method: 'POST',
			headers: {
				'Content-Type': '',
				Authorization: `Bearer ${accessToken}`
			},
			body: formData
		},
		300000
	);

	return await resp.json();
}

/** Client Endpoints **/

export async function clientAuthSignin(data: SignInFormData): Promise<ApiResponse> {
	return await postJson('/user/auth/signin', data);
}

export async function clientAuthVerifyEmail(id: string, token: string): Promise<ApiResponse> {
	return await postJson('/user/auth/verify/email', { id, token });
}

export async function clientGetProfile(accessToken: string): Promise<ApiResponse> {
	return await getJson('/user/account/profile', accessToken);
}

export async function clientUpdateProfile(data: ProfileSettings, accessToken: string): Promise<ApiResponse> {
	return await postJson('/user/account/profile/update', data, accessToken);
}

export async function clientUpdatePassword(data: SecuritySettings, accessToken: string): Promise<ApiResponse> {
	return await postJson('/user/account/profile/update_password', data, accessToken);
}

export async function clientGetContacts(accessToken: string): Promise<ApiResponse> {
	return await getJson('/client/contacts', accessToken);
}

export async function clientDeleteContactById(contactId: string, accessToken: string): Promise<ApiResponse> {
	return await postJson(`/client/contacts/${contactId}/delete`, {}, accessToken);
}

export async function clientGetContactById(contactId: string, accessToken: string): Promise<ApiResponse> {
	return await getJson(`/client/contacts/${contactId}`, accessToken);
}

export async function clientDeleteDealById(dealId: string, accessToken: string): Promise<ApiResponse> {
	return await postJson(`/client/deals/${dealId}/delete`, {}, accessToken);
}

export async function clientPublishDeal(dealId: string, accessToken: string): Promise<ApiResponse> {
	return await postJson(`/client/deals/${dealId}/publish`, {}, accessToken);
}

export async function clientConfirmDeal(dealId: string, accessToken: string): Promise<ApiResponse> {
	return await postJson(`/client/deals/${dealId}/approve`, {}, accessToken);
}

export async function clientAssignDeal(dealId: string, accessToken: string): Promise<ApiResponse> {
	return await postJson(`/client/deals/${dealId}/assign`, {}, accessToken);
}

export async function clientCancelDeal(dealId: string, accessToken: string): Promise<ApiResponse> {
	return await postJson(`/client/deals/${dealId}/cancel`, {}, accessToken);
}

export async function clientMakeDealPayment(dealId: string, accessToken: string): Promise<ApiResponse> {
	return await postJson(`/client/deals/${dealId}/makePayment`, {}, accessToken);
}

export async function clientConfirmReturn(dealId: string, accessToken: string): Promise<ApiResponse> {
	return await postJson(`/client/deals/${dealId}/confirmReturn`, {}, accessToken);
}

export async function clientSendChat(
	dealId: string,
	data: DisbursementChatFormData,
	accessToken: string
): Promise<ApiResponse> {
	return await postJson(`/client/deals/${dealId}/message`, data, accessToken);
}

export async function clientUploadFiles(files: File[], accessToken: string): Promise<ApiResponse> {
	const formData = new FormData();

	files.forEach((file) => {
		formData.append('files', file);
	});

	const resp = await apiFetch(
		'/client/files/upload',
		{
			method: 'POST',
			headers: {
				'Content-Type': '',
				Authorization: `Bearer ${accessToken}`
			},
			body: formData
		},
		300000
	);

	return await resp.json();
}

export async function disconnectTelegram(chat_id: string, accessToken: string): Promise<ApiResponse> {
	return await postJson(`/client/account/telegramconnects/${chat_id}/delete`, accessToken);
}

export async function clientDownloadDeals(accessToken: string, options?: DownloadOptions) {
	return await post(`/client/deals/download`, options, accessToken);
}

/** Admin Endpoints **/

export async function adminAuthSignin(data: SignInFormData): Promise<ApiResponse> {
	return await postJson('/admin/auth/signin', data);
}

export async function adminGetProfile(accessToken: string): Promise<ApiResponse> {
	return await getJson('/admin/account/profile', accessToken);
}

export async function adminCreateAgent(data: CreateOrEditAgentFormData, accessToken: string): Promise<ApiResponse> {
	return await postJson('/admin/agents', data, accessToken);
}

export async function adminUpdateAgentById(
	agentId: string,
	data: CreateOrEditAgentFormData,
	accessToken: string
): Promise<ApiResponse> {
	return await putJson(`/admin/agents/${agentId}`, data, accessToken);
}

export async function adminDeleteAgentById(agentId: string, accessToken: string): Promise<ApiResponse> {
	return await deleteJson(`/admin/agents/${agentId}`, accessToken);
}
