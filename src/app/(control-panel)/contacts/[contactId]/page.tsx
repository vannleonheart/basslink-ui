'use client';

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
	const contact = useMemo(() => contactData as Contact, [contactData]);

	return (
		<PageContainer
			header={<PageHeader title="Contact Detail" />}
			content={
				<div className="px-16 pb-28 h-full">
					{isLoading ? <LoadingBar /> : <NewContactForm contact={contact} />}
				</div>
			}
		/>
	);
}
