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
	citizenship?: string;
	identity_type?: string;
	identity_no?: string;
	country?: string;
	region?: string;
	city?: string;
	address?: string;
	email: string;
	phone_code: string;
	phone_no: string;
	occupation?: string;
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

export type Currency = {
	id: string;
	name: string;
	symbol: string;
	type: string;
	is_active: boolean;
};

export type Contact = {
	id: string;
	agent_id: string;
	contact_type: string;
	name: string;
	gender?: string;
	birthdate?: string;
	citizenship?: string;
	identity_type?: string;
	identity_no?: string;
	country?: string;
	region?: string;
	city?: string;
	address?: string;
	email?: string;
	phone_code?: string;
	phone_no?: string;
	occupation?: string;
	notes?: string;
	is_verified: boolean;
	created: number;
	updated?: number;
	documents?: ContactDocument[];
	accounts?: ContactAccount[];
	relations?: ContactRelation[];
};

export type ContactDocument = {
	id: string;
	contact_id: string;
	document_type: string;
	document_data: string;
	notes?: string;
	is_verified: boolean;
	created: number;
	updated?: number;
};

export type ContactAccount = {
	id: string;
	contact_id: string;
	account_type: string;
	bank_id: string;
	bank_name: string;
	bank_code?: string;
	bank_swift?: string;
	owner_name: string;
	no: string;
	country?: string;
	address?: string;
	email?: string;
	website?: string;
	phone_code?: string;
	phone_no?: string;
	notes?: string;
	created: number;
	updated?: number;
};

export type ContactRelation = {
	contact_id: string;
	user_id: string;
	relation: string;
	updated: number;
};