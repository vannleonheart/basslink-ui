'use client';

import NewRecipientForm from '@/components/forms/NewRecipientForm';
import PageContainer from '@/components/PageContainer';

export default function NewRecipientPage() {
	return (
		<PageContainer
			title="Tambah Penerima"
			content={<NewRecipientForm />}
		/>
	);
}
