export type AuthType =
	| undefined
	| null
	| boolean
	| string
	| string[]
	| {
			type: string;
			roles: UserRole[];
	  }[];
export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';

export type AuthComponentProps = {
	side: string;
	accessToken: string;
	user?: User;
	fetch?: () => void;
};

export type ApiResponse = {
	status: string;
	code: string;
	message?: string;
	data?: unknown;
};

export type UserMeta = {
	role: Record<string, UserMetaRole>;
};

export type UserMetaRole = {
	scope: UserMetaRoleScope;
};

export type UserMetaRoleScope = {
	clients: string[];
};

export type Agent = {
	id: string;
	name: string;
	country: string;
	email?: string;
	is_enabled: boolean;
	created: number;
	updated?: number;
	image?: string;
};

export type AgentUser = {
	id: string;
	agent_id: string;
	role: string;
	name: string;
	email: string;
	phone_code: string;
	phone_no: string;
	is_email_verified: boolean;
	last_signin?: number;
	is_enabled: boolean;
	meta: UserMeta;
	created: number;
	updated?: number;
	agent?: Agent;
	image?: string;
};

export type AgentCompany = {
	id: string;
	agent_id: string;
	name: string;
	country: string;
	city?: string;
	address?: string;
	created: number;
	accounts?: AgentCompanyAccount[];
};

export type AgentCompanyAccount = {
	id: string;
	agent_id: string;
	agent_company_id: string;
	account_type: string;
	account_no: string;
	bank_country?: string;
	bank_name?: string;
	bank_swift_code?: string;
	bank_address?: string;
	currency?: string;
	network?: string;
	label?: string;
};

export type Client = {
	id: string;
	code: string;
	name: string;
	country: string;
	city?: string;
	address?: string;
	email?: string;
	phone_code?: string;
	phone_no?: string;
	website?: string;
	image?: string;
	is_enabled: boolean;
	created: number;
	updated?: number;
};

export type ClientUser = {
	id: string;
	client_id: string;
	role: string;
	name: string;
	email: string;
	phone_code: string;
	phone_no: string;
	is_email_verified: boolean;
	last_signin?: number;
	is_enabled: boolean;
	created: number;
	updated?: number;
	client?: Client;
	image?: string;
};

export type Deal = {
	id: string;
	deal_type: string;
	client_id: string;
	agent_id?: string;
	agent_company_id?: string;
	agent_company_account_id?: string;
	sender_name?: string;
	sender_country?: string;
	sender_city?: string;
	sender_address?: string;
	sender_bank_name?: string;
	sender_bank_account_no?: string;
	sender_bank_swift_code?: string;
	sender_bank_country?: string;
	sender_bank_address?: string;
	sender_contact_name?: string;
	sender_contact_phone_code?: string;
	sender_contact_phone_no?: string;
	sender_contact_email?: string;
	receiver_name?: string;
	receiver_country?: string;
	receiver_city?: string;
	receiver_address?: string;
	receiver_bank_name?: string;
	receiver_bank_account_no?: string;
	receiver_bank_swift_code?: string;
	receiver_bank_country?: string;
	receiver_bank_address?: string;
	receiver_contact_name?: string;
	receiver_contact_phone_code?: string;
	receiver_contact_phone_no?: string;
	receiver_contact_email?: string;
	from_currency: string;
	from_amount?: number;
	to_currency: string;
	to_amount?: number;
	priority?: string;
	purpose?: string;
	due_date?: string;
	conversion_type?: string;
	conversion_rate?: number;
	commission_percentage?: number;
	commission_fixed?: number;
	commission_total?: number;
	subtotal?: number;
	total?: number;
	is_published: boolean;
	is_enabled: boolean;
	status: string;
	suggested_at?: number;
	accepted_at?: number;
	confirmed_at?: number;
	terms_submitted_at?: number;
	assigned_at?: number;
	payment_made_at?: number;
	fund_received_at?: number;
	completed_at?: number;
	returned_at?: number;
	unread_message_agent: number;
	unread_message_client: number;
	created: number;
	updated?: number;
	client?: Client;
	agent?: Agent;
	agent_company?: AgentCompany;
	agent_company_account?: AgentCompanyAccount;
	files: DealFile[];
	wallet?: Wallet;
};

export type DealFile = {
	deal_id: string;
	client_id?: string;
	client_user_id?: string;
	agent_id?: string;
	agent_user_id?: string;
	filename: string;
	label?: string;
	created: number;
};

export type DealLog = {
	deal_id: string;
	status_before: string;
	status_after: string;
	activity: string;
	detail?: Record<string, unknown>;
	timestamp: number;
};

export type DealMessage = {
	deal_id: string;
	side: string;
	client_id?: string;
	client_user_id?: string;
	agent_id?: string;
	agent_user_id?: string;
	message_data: DealMessageData;
	is_read: boolean;
	created: number;
	client?: Client;
	client_user?: ClientUser;
	agent?: Agent;
	agent_user?: AgentUser;
};

export type DealMessageData = {
	message: string;
	files?: string[];
};

export type ClientContactEmail = {
	client_contact_id: string;
	email: string;
	label?: string;
};

export type ClientContactPhone = {
	client_contact_id: string;
	phone_code: string;
	phone_no: string;
	label?: string;
};

export type ClientContact = {
	id: string;
	client_id: string;
	name: string;
	country?: string;
	city?: string;
	address?: string;
	notes?: string;
	image?: string;
	bank_country?: string;
	bank_name?: string;
	bank_swift_code?: string;
	bank_account_no?: string;
	bank_address?: string;
	created: number;
	updated?: number;
	emails?: ClientContactEmail[];
	phones?: ClientContactPhone[];
	background?: string;
};

export type TelegramConnect = {
	chat_id: number;
	agent_id?: string;
	client_id?: string;
	chat_type: string;
	username: string;
	first_name: string;
	last_name: string;
};

export type Currency = {
	id: string;
	name: string;
	symbol: string;
	category: string;
	rate: number;
	currency_data: Record<string, string>;
	is_enable: boolean;
};

export type Wallet = {
	id: number;
	wallet_type: string;
	currency: string;
	network?: string;
	account_no: string;
	bank_name?: string;
	bank_country?: string;
	bank_swift_code?: string;
	bank_address?: string;
	is_enabled: boolean;
};

export type AdminUser = {
	id: string;
	username: string;
	role: string;
	name: string;
	email: string;
	phone_code: string;
	phone_no: string;
	last_signin?: number;
	is_enabled: boolean;
	created: number;
	updated?: number;
	image?: string;
};

export type User = AgentUser | ClientUser | AdminUser;

export type ValidationError = {
	field: string;
	message: string;
};

export type CreateOrEditClientFormData = {
	code?: string;
	name: string;
	country: string;
	email: string;
	password: string;
	password_confirmation: string;
};

export type CreateOrEditAgentFormData = {
	name: string;
	email: string;
	country: string;
	password: string;
	password_confirmation: string;
};

export type CreateOrEditAgentUserFormData = {
	name: string;
	email: string;
	role: string;
	client_scope?: string[];
	password: string;
	password_confirmation: string;
};

export type SignInFormData = {
	email: string;
	password: string;
	remember?: boolean;
};

export type SigninResponse = {
	type: string;
	token: string;
	expires_in: number;
};

export type ForgotPasswordFormData = {
	email: string;
};

export type ResetPasswordFormData = {
	id: string;
	token: string;
	password: string;
	password_confirmation: string;
};

export type ResendEmailVerificationFormData = {
	email: string;
};

export type CreateDealSendMoneyFormData = {
	from_currency: string;
	to_currency: string;
	to_amount: string;
	receiver_name: string;
	receiver_country: string;
	receiver_address: string;
	receiver_bank_country: string;
	receiver_bank_address: string;
	receiver_bank_name: string;
	receiver_bank_account_no: string;
	receiver_bank_swift_code: string;
	purpose: string;
	files: string[];
};

export type ProfileSettings = {
	name: string;
	phone_code: string;
	phone_no: string;
};

export type SecuritySettings = {
	current_password: string;
	new_password: string;
	new_password_confirmation: string;
};

export type AcceptDealFormData = {
	company_id: string;
	due_date: string;
};

export type DealFilter = {
	state: string;
	status: string;
	search: string;
	country: string;
	currency: string;
	min: number | undefined;
	max: number | undefined;
	start: string | null;
	end: string | null;
};

export type DownloadOptions = {
	format: 'csv' | 'xlsx';
	state: string;
	status: string;
	search: string;
	country: string;
	currency: string;
	min: number | undefined;
	max: number | undefined;
	start: string | null;
	end: string | null;
};

export type PaymentInvoiceRequest = {
	company_id: string;
	company_account_id: string;
	files: string[];
};

export type CalculateRequest = {
	direction: '0' | '1';
	conversion_type: string;
	conversion_rate: string;
	commission_percentage: string;
	commission_fixed: string;
	total_received: string;
};

export type DealPropose = {
	date: string;
	company_id: string;
	direction: '0' | '1';
	conversion_type: string;
	conversion_rate: string;
	commission_percentage: string;
	commission_fixed: string;
	total_received: string;
};

export type Rate = {
	source: string;
	from: string;
	to: string;
	rate_buy: number;
	rate_sell: number;
	spread_percentage: number;
	spread_fixed: number;
	auto: boolean;
	updated: number;
};

export type UpdateRatesFormData = {
	source: string;
	from: string;
	to: string;
	rate_buy: number;
	rate_sell: number;
	spread_percentage: number;
	spread_fixed: number;
};
