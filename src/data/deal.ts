export const STATUS = {
	draft: 'Draft',
	cancel: 'Cancel',
	suggested: 'Suggested',
	approved: 'Approved',
	request_for_terms: 'Request for terms',
	waiting_for_payment: 'Waiting for payment',
	payment_made: 'Payment Made',
	payment_of_invoice: 'Payment of invoice',
	return_sent: 'Return sent',
	return: 'Return',
	completed: 'Completed'
};

export const ACCEPTED_STATUS = [
	STATUS.waiting_for_payment,
	STATUS.payment_made,
	STATUS.payment_of_invoice,
	STATUS.return_sent,
	STATUS.return,
	STATUS.completed
];
