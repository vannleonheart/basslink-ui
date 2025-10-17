'use client';

import NewSenderForm from '@/components/forms/NewSenderForm';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/PageHeader';

export default function NewSenderPage() {
	return (
		<PageContainer
			header={<PageHeader title="Tambah Pengirim" />}
			content={
				<div className="px-16 pb-28">
					<NewSenderForm />
				</div>
			}
		/>
	);
}
