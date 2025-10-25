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

export type CreateRemittanceFormData = {
	from_currency: string;
	from_amount: string;
	to_currency: string;
	to_amount: string;
	sender_id?: string;
	sender_type: string;
	sender_name: string;
	sender_gender: string;
	sender_birthdate: string;
	sender_citizenship: string;
	sender_identity_type: string;
	sender_identity_no: string;
	sender_registered_country: string;
	sender_registered_region: string;
	sender_registered_city: string;
	sender_registered_address: string;
	sender_registered_zip_code: string;
	sender_country: string;
	sender_region: string;
	sender_city: string;
	sender_address: string;
	sender_zip_code: string;
	sender_contact: string;
	sender_occupation: string;
	sender_pep_status?: string;
	sender_notes?: string;
	sender_update?: boolean;
	recipient_id?: string;
	recipient_type: string;
	recipient_relationship: string;
	recipient_name: string;
	recipient_country: string;
	recipient_region: string;
	recipient_city: string;
	recipient_address: string;
	recipient_zip_code: string;
	recipient_contact: string;
	recipient_pep_status?: string;
	recipient_account_type: string;
	recipient_bank_name: string;
	recipient_bank_code: string;
	recipient_bank_account_no: string;
	recipient_bank_account_owner: string;
	recipient_notes?: string;
	recipient_update?: boolean;
	transfer_type: string;
	payment_method: string;
	transfer_reference?: string;
	rate?: string;
	fee_percent?: string;
	fee_fixed?: string;
	purpose: string;
	fund_source: string;
	notes?: string;
	files: string[];
};

export type CreateSenderFormData = {
	sender_type: string;
	sender_name: string;
	sender_gender: string;
	sender_birthdate: string;
	sender_citizenship: string;
	sender_identity_type: string;
	sender_identity_no: string;
	sender_registered_country: string;
	sender_registered_region: string;
	sender_registered_city: string;
	sender_registered_address: string;
	sender_registered_zip_code: string;
	sender_country: string;
	sender_region: string;
	sender_city: string;
	sender_address: string;
	sender_zip_code: string;
	sender_contact: string;
	sender_occupation: string;
	sender_pep_status: string;
	sender_notes: string;
	sender_documents: CreateSenderDocumentFormData[];
};

export type CreateSenderDocumentFormData = {
	id?: string;
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

export type CreateRecipientFormData = {
	recipient_sender_id?: string;
	recipient_type: string;
	recipient_relationship: string;
	recipient_name: string;
	recipient_country: string;
	recipient_region: string;
	recipient_city: string;
	recipient_address: string;
	recipient_zip_code: string;
	recipient_contact: string;
	recipient_pep_status?: string;
	recipient_account_type: string;
	recipient_bank_name: string;
	recipient_bank_code: string;
	recipient_bank_account_no: string;
	recipient_bank_account_owner: string;
	recipient_notes?: string;
	recipient_documents?: CreateRecipientDocumentFormData[];
};

export type CreateRecipientDocumentFormData = {
	id?: string;
	document_type: string;
	document_data: string;
	notes?: string;
	is_verified: boolean;
};

export type RejectRemittanceFormData = {
	reason: string;
};

export type CompleteRemittanceFormData = {
	date: string;
	reference: string;
	notes?: string;
	receipt: string;
};
