'use client';

import NewDisbursementForm from '@/components/forms/NewDisbursementForm';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/PageHeader';

export default function NewDisbursementPage() {
	return (
		<PageContainer
			header={<PageHeader title="Kirim Dana" />}
			content={
				<div className="px-16 pb-28">
					<NewDisbursementForm />
				</div>
			}
		/>
	);
}
