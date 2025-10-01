'use client';

import Empty from '@/components/commons/Empty';
import LoadingBar from '@/components/commons/LoadingBar';
import NewContactForm from '@/components/forms/NewContactForm';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/PageHeader';
import apiService from '@/store/apiService';
import { Contact } from '@/types/entity';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export default function ContactDetailPage() {
	const { contactId } = useParams();
	const {
		data: { accessToken, side }
	} = useSession();
	const { data: contactData, isLoading } = apiService.useGetContactQuery({
		id: contactId!,
		side,
		accessToken
	});
	const contact: Contact | null = useMemo(() => contactData as Contact, [contactData]);

	return (
		<PageContainer
			header={<PageHeader title="Informasi Penerima" />}
			content={
				<div className="px-16 pb-28 h-full">
					{isLoading ? (
						<LoadingBar />
					) : contact ? (
						<NewContactForm contact={contact} />
					) : (
						<Empty text="Data penerima tidak ditemukan" />
					)}
				</div>
			}
		/>
	);
}
