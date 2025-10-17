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
	internal?: string;
};

export type ValidationError = {
	field: string;
	message: string;
};

export type RemittanceFilter = {
	status?: string;
	type?: string;
	start?: string;
	end?: string;
	min?: string;
	max?: string;
	search?: string;
};
