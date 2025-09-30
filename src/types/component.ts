import { User } from './entity';

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

export type ValidationError = {
	field: string;
	message: string;
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
