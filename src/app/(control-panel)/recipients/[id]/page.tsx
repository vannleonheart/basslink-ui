'use client';

import Empty from '@/components/commons/Empty';
import LoadingBar from '@/components/commons/LoadingBar';
import NewRecipientForm from '@/components/forms/NewRecipientForm';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/PageHeader';
import apiService from '@/store/apiService';
import { Recipient } from '@/types/entity';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export default function RecipientDetailPage() {
	const { id: recipientId } = useParams();
	const {
		data: { accessToken, side }
	} = useSession();
	const { data: recipientData, isLoading } = apiService.useGetRecipientQuery({
		id: recipientId!,
		side,
		accessToken
	});
	const recipient: Recipient | null = useMemo(() => recipientData as Recipient, [recipientData]);

	return (
		<PageContainer
			header={<PageHeader title="Informasi Penerima" />}
			content={
				<div className="px-16 pb-28 h-full">
					{isLoading ? (
						<LoadingBar />
					) : recipient ? (
						<NewRecipientForm recipient={recipient} />
					) : (
						<Empty text="Data penerima tidak ditemukan" />
					)}
				</div>
			}
		/>
	);
}
