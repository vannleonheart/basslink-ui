'use client';

import NewContactForm from '@/components/forms/NewContactForm';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/PageHeader';

export default function NewContactPage() {
	return (
		<PageContainer
			header={<PageHeader title="New Contact" />}
			content={
				<div className="px-16 pb-28">
					<NewContactForm />
				</div>
			}
		/>
	);
}
