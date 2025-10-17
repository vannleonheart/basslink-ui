'use client';

import NewRecipientForm from '@/components/forms/NewRecipientForm';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/PageHeader';

export default function NewRecipientPage() {
	return (
		<PageContainer
			header={<PageHeader title="Tambah Penerima" />}
			content={
				<div className="px-16 pb-28">
					<NewRecipientForm />
				</div>
			}
		/>
	);
}
