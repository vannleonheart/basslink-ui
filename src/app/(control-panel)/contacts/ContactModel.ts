import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { ClientContact, ClientContactEmail, ClientContactPhone } from '@/types';

export const ContactPhoneModel = (data: PartialDeep<ClientContactPhone> | null): ClientContactPhone =>
	_.defaults(data || {}, {
		phone_code: '',
		phone_no: '',
		label: ''
	});

export const ContactEmailModel = (data: Partial<ClientContactEmail> | null): ContactEmail =>
	_.defaults(data || {}, {
		email: '',
		label: ''
	});

const ContactModel = (data: PartialDeep<ClientContact>): ClientContact =>
	_.defaults(data || {}, {
		id: '',
		image: '',
		background: '',
		name: '',
		emails: [ContactEmailModel(null)],
		phones: [ContactPhoneModel(null)],
		bank_country: '',
		bank_name: '',
		bank_swift_code: '',
		bank_account_no: '',
		bank_address: '',
		country: '',
		city: '',
		address: '',
		notes: ''
	});

export default ContactModel;
