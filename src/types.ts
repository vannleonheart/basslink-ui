export type AuthType = undefined | null | boolean | string | string[];

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

export type Agent = {
	id: string;
	name: string;
	country?: string;
	region?: string;
	city?: string;
	address?: string;
	phone_code?: string;
	phone_no?: string;
	email?: string;
	website?: string;
	timezone?: number;
	is_verified: boolean;
	is_enable: boolean;
	created: number;
	updated?: number;
};

export type AgentUser = {
	id: string;
	agent_id: string;
	role: string;
	username: string;
	name: string;
	email?: string;
	phone_code?: string;
	phone_no?: string;
	is_enable: boolean;
	created: number;
	updated?: number;
	agent?: Agent;
	image?: string;
	as?: string;
};

export type User = {
	id: string;
	agent_id: string;
	username: string;
	name: string;
	gender?: string;
	birthdate?: string;
	country?: string;
	region?: string;
	city?: string;
	address?: string;
	email: string;
	phone_code: string;
	phone_no: string;
	identity_type?: string;
	identity_no?: string;
	occupation?: string;
	portrait_image?: string;
	identity_image?: string;
	notes?: string;
	is_verified: boolean;
	email_verified: boolean;
	phone_verified: boolean;
	is_enable: boolean;
	created: number;
	updated?: number;
	agent?: Agent;
	image?: string;
	as?: string;
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
	as?: string;
};

export type Disbursement = {
	id: string;
	agent_id: string;
	user_id?: string;
	from_contact: string;
	from_currency: string;
	from_amount: number;
	to_contact: string;
	to_currency: string;
	to_amount: number;
	to_account: string;
	rate_currency: string;
	rate: number;
	fee_currency: string;
	fee_amount: number;
	transfer_type: string;
	transfer_ref: string;
	transfer_date?: string;
	fund_source?: string;
	purpose?: string;
	notes?: string;
	status: string;
	is_settled?: boolean;
	created: number;
	updated?: number;
};

export type UserType = User | AgentUser | AdminUser;

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
	agent_name: string;
	country: string;
	region?: string;
	city?: string;
	address?: string;
	phone_code?: string;
	phone_no?: string;
	email: string;
	website?: string;
	name: string;
	username?: string;
	password?: string;
	password_confirmation?: string;
};

export type CreateOrEditUserFormData = {
	username: string;
	name: string;
	gender?: string;
	birthdate?: string;
	country?: string;
	region?: string;
	city?: string;
	address?: string;
	email: string;
	phone_code: string;
	phone_no: string;
	identity_type?: string;
	identity_no?: string;
	occupation?: string;
	portrait_image?: string;
	identity_image?: string;
	notes?: string;
	password: string;
	password_confirmation: string;
};

export type SignInFormData = {
	username: string;
	password: string;
	remember?: boolean;
};

export type SigninResponse = {
	token: string;
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
