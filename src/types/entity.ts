export type AllUser = AdminUser | AgentUser;

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

export type Sender = {
	id: string;
	sender_type: string;
	name: string;
	gender?: string;
	birthdate?: string;
	citizenship?: string;
	identity_type?: string;
	identity_no?: string;
	registered_country?: string;
	registered_region?: string;
	registered_city?: string;
	registered_address?: string;
	registered_zip_code?: string;
	country?: string;
	region?: string;
	city?: string;
	address?: string;
	zip_code?: string;
	contact: string;
	occupation?: string;
	pep_status?: string;
	notes?: string;
	created: number;
	created_by: string;
	updated?: number;
	updated_by?: string;
	documents?: SenderDocument[];
};

export type Remittance = {
	id: string;
	agent_id: string;
	sender_id?: string;
	from_currency: string;
	from_amount: number;
	from_sender_type: string;
	from_name: string;
	from_gender?: string;
	from_birthdate?: string;
	from_citizenship: string;
	from_identity_type: string;
	from_identity_no: string;
	from_occupation?: string;
	from_registered_country?: string;
	from_registered_region?: string;
	from_registered_city?: string;
	from_registered_address?: string;
	from_registered_zip_code?: string;
	from_country: string;
	from_region?: string;
	from_city?: string;
	from_address?: string;
	from_zip_code?: string;
	from_contact: string;
	from_pep_status?: string;
	from_notes?: string;
	recipient_id: string;
	to_currency: string;
	to_amount: number;
	to_recipient_type: string;
	to_relationship: string;
	to_name: string;
	to_country: string;
	to_region?: string;
	to_city?: string;
	to_address?: string;
	to_zip_code: string;
	to_contact?: string;
	to_pep_status?: string;
	to_bank_name: string;
	to_bank_code?: string;
	to_bank_account_no?: string;
	to_bank_account_owner?: string;
	to_notes?: string;
	rate_currency: string;
	rate: number;
	fee_currency: string;
	fee_amount_percent: number;
	fee_amount_fixed: number;
	fee_total: number;
	transfer_type: string;
	transfer_ref: string;
	transfer_on?: string;
	transfer_date?: string;
	fund_source?: string;
	purpose?: string;
	notes?: string;
	status: string;
	is_settled?: boolean;
	created: number;
	updated?: number;
	source_currency?: Currency;
	target_currency?: Currency;
	attachments?: RemittanceAttachment[];
};

export type UserType = AgentUser | AdminUser;

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

export type Recipient = {
	id: string;
	sender_id: string;
	recipient_type: string;
	relationship: string;
	name: string;
	country?: string;
	region?: string;
	city?: string;
	address?: string;
	zip_code?: string;
	contact?: string;
	pep_status?: string;
	account_type?: string;
	bank_name?: string;
	bank_code?: string;
	bank_account_no?: string;
	bank_account_owner?: string;
	notes?: string;
	is_verified: boolean;
	created: number;
	updated?: number;
	documents?: RecipientDocument[];
};

export type RecipientDocument = {
	id: string;
	recipient_id: string;
	document_type: string;
	document_data: string;
	notes?: string;
	is_verified: boolean;
	created: number;
	updated?: number;
};

export type RemittanceAttachment = {
	id: string;
	remittance_id: string;
	attachment: string;
	submit_by: string;
	submit_time: number;
};

export type SenderDocument = {
	id: string;
	sender_id: string;
	document_type: string;
	document_data: string;
	notes?: string;
	is_verified: boolean;
	created: number;
	updated?: number;
};

export type Appointment = {
	id: string;
	name: string;
	company?: string;
	email: string;
	phone: string;
	service_type: string;
	date: string;
	time: string;
	notes?: string;
	status: string;
	created: number;
	updated?: number;
};
