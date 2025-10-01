'use client';

import NewCustomerForm from '@/components/forms/NewCustomerForm';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/PageHeader';

export default function NewCustomerPage() {
	return (
		<PageContainer
			header={<PageHeader title="Tambah Pengirim" />}
			content={
				<div className="px-16 pb-28">
					<NewCustomerForm />
				</div>
			}
		/>
	);
}
