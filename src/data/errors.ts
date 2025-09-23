const errorMessages: Record<string, string> = {
	ERR_USER_EXIST: 'User already exists',
	ERR_AUTH_SIGNIN: 'An error occurred while signing in',
	ERR_AUTHENTICATION_FAILED: 'Invalid email or password',
	ERR_AUTH_REQUIRED: 'Please sign in to continue',
	ERR_PASSWORD_NOT_MATCH: 'Password not match',
	ERR_NOT_FOUND: 'Not found'
};

export default function getErrorMessage(error: string): string {
	if (errorMessages[error]) {
		return errorMessages[error];
	}

	return error;
}
