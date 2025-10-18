'use client';

import NewRemittanceForm from '@/components/forms/NewRemittanceForm';
import PageContainer from '@/components/PageContainer';

export default function NewRemittancePage() {
	return (
		<PageContainer
			title="Kirim Dana"
			content={<NewRemittanceForm />}
		/>
	);
}
