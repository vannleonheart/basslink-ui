'use client';

import NewSenderForm from '@/components/forms/NewSenderForm';
import PageContainer from '@/components/PageContainer';

export default function NewSenderPage() {
	return (
		<PageContainer
			title="Tambah Pengirim"
			content={
				<div className="px-16 pb-28">
					<NewSenderForm />
				</div>
			}
		/>
	);
}
