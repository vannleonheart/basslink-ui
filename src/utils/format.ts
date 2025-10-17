export function formatNumber(value: number, options?: Intl.NumberFormatOptions, locale = 'en-US'): string {
	options = {
		minimumFractionDigits: 0,
		maximumFractionDigits: 6,
		...options
	};

	return new Intl.NumberFormat(locale, options).format(value);
}

export function sanitizeNumber(value: string, fraction = 6, useFormat = false): string {
	const strValue = `${value}`.trim();
	const [before, after = ''] = strValue.split('.');

	let newBefore = before.replace(/[^\d]/g, '');

	if (useFormat) {
		newBefore = formatNumber(Number(newBefore), { maximumFractionDigits: 0 });
	}

	if (after && after.length > 0) {
		const newAfter = after.replace(/[^\d]/g, '');

		return `${newBefore}.${newAfter.slice(0, fraction)}`;
	}

	return newBefore;
}
