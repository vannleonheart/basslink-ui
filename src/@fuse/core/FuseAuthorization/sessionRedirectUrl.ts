const sessionStorageKey = 'basslinkRedirectUrl';

export const getSessionRedirectUrl = () => {
	return window.sessionStorage.getItem(sessionStorageKey);
};

export const setSessionRedirectUrl = (url: string) => {
	window.sessionStorage.setItem(sessionStorageKey, url);
};

export const resetSessionRedirectUrl = () => {
	window.sessionStorage.removeItem(sessionStorageKey);
};
