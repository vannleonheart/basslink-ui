'use client';

import { redirect, useParams } from 'next/navigation';
import ContactForm from '../ContactForm';

function ContactPage() {
	const { contactId } = useParams<{ contactId: string }>();

	if (contactId === 'new') {
		return <ContactForm isNew />;
	}

	redirect(`/contacts/${contactId}/view`);

	return null;
}

export default ContactPage;
