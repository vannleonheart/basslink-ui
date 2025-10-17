'use client';

import NewRemittanceForm from '@/components/forms/NewRemittanceForm';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/PageHeader';

export default function NewRemittancePage() {
	return (
		<PageContainer
			header={<PageHeader title="Kirim Dana" />}
			content={
				<div className="px-16 pb-28">
					<NewRemittanceForm />
				</div>
			}
		/>
	);
}
