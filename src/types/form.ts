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

export type ResetPasswordFormData = {
	id: string;
	token: string;
	password: string;
	password_confirmation: string;
};

export type ResendEmailVerificationFormData = {
	email: string;
};

export type CreateDisbursementFormData = {
	from_currency: string;
	from_amount: string;
	to_currency: string;
	to_amount: string;
	from_customer: string;
	customer_type?: string;
	customer_name?: string;
	customer_gender?: string;
	customer_birthdate?: string;
	customer_citizenship?: string;
	customer_identity_type?: string;
	customer_identity_no?: string;
	customer_country?: string;
	customer_region?: string;
	customer_city?: string;
	customer_address?: string;
	customer_email?: string;
	customer_phone_code?: string;
	customer_phone_no?: string;
	customer_occupation?: string;
	customer_notes?: string;
	customer_update?: boolean;
	to_contact: string;
	beneficiary_type?: string;
	beneficiary_name?: string;
	beneficiary_gender?: string;
	beneficiary_birthdate?: string;
	beneficiary_citizenship?: string;
	beneficiary_identity_type?: string;
	beneficiary_identity_no?: string;
	beneficiary_country?: string;
	beneficiary_region?: string;
	beneficiary_city?: string;
	beneficiary_address?: string;
	beneficiary_email?: string;
	beneficiary_phone_code?: string;
	beneficiary_phone_no?: string;
	beneficiary_occupation?: string;
	beneficiary_relationship?: string;
	beneficiary_notes?: string;
	beneficiary_update?: boolean;
	to_account: string;
	bank_name?: string;
	bank_account_no?: string;
	bank_account_name?: string;
	bank_country?: string;
	bank_swift_code?: string;
	bank_code?: string;
	bank_address?: string;
	bank_email?: string;
	bank_phone_code?: string;
	bank_phone_no?: string;
	bank_website?: string;
	bank_notes?: string;
	bank_update?: boolean;
	transfer_type: string;
	transfer_date: string;
	transfer_reference?: string;
	rate?: string;
	fee?: string;
	purpose: string;
	fund_source: string;
	notes?: string;
	files: string[];
};

export type CreateCustomerFormData = {
	customer_type?: string;
	customer_name?: string;
	customer_gender?: string;
	customer_birthdate?: string;
	customer_citizenship?: string;
	customer_identity_type?: string;
	customer_identity_no?: string;
	customer_country?: string;
	customer_region?: string;
	customer_city?: string;
	customer_address?: string;
	customer_email?: string;
	customer_phone_code?: string;
	customer_phone_no?: string;
	customer_occupation?: string;
	customer_notes?: string;
	customer_documents?: CreateCustomerDocumentFormData[];
	username?: string;
	password?: string;
	password_confirmation?: string;
};

export type CreateCustomerDocumentFormData = {
	document_type: string;
	document_data: string;
	notes?: string;
	is_verified: boolean;
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

export type AcceptDealFormData = {
	company_id: string;
	due_date: string;
};

export type CreateContactFormData = {
	contact_type?: string;
	contact_name?: string;
	contact_gender?: string;
	contact_birthdate?: string;
	contact_citizenship?: string;
	contact_identity_type?: string;
	contact_identity_no?: string;
	contact_country?: string;
	contact_region?: string;
	contact_city?: string;
	contact_address?: string;
	contact_email?: string;
	contact_phone_code?: string;
	contact_phone_no?: string;
	contact_occupation?: string;
	contact_notes?: string;
	contact_documents?: CreateContactDocumentFormData[];
	contact_accounts?: CreateContactAccountFormData[];
};

export type CreateContactDocumentFormData = {
	document_type: string;
	document_data: string;
	notes?: string;
	is_verified: boolean;
};

export type CreateContactAccountFormData = {
	bank_name?: string;
	bank_account_no?: string;
	bank_account_name?: string;
	bank_country?: string;
	bank_swift_code?: string;
	bank_code?: string;
	bank_address?: string;
	bank_email?: string;
	bank_phone_code?: string;
	bank_phone_no?: string;
	bank_website?: string;
	bank_notes?: string;
};


export type DisbursementChatFormData = {};
