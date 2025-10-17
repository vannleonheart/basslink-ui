'use client';

import Empty from '@/components/commons/Empty';
import LoadingBar from '@/components/commons/LoadingBar';
import NewSenderForm from '@/components/forms/NewSenderForm';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/PageHeader';
import apiService from '@/store/apiService';
import { Sender } from '@/types/entity';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export default function SenderDetailPage() {
	const { id: senderId } = useParams();
	const {
		data: { accessToken, side }
	} = useSession();
	const { data: senderData, isLoading } = apiService.useGetSenderQuery({
		id: senderId!,
		side,
		accessToken
	});
	const sender: Sender | null = useMemo(() => senderData as Sender, [senderData]);

	return (
		<PageContainer
			header={<PageHeader title="Informasi Pengirim" />}
			content={
				<div className="px-16 pb-28 h-full">
					{isLoading ? (
						<LoadingBar />
					) : sender ? (
						<NewSenderForm sender={sender} />
					) : (
						<Empty text="Data pengirim tidak ditemukan" />
					)}
				</div>
			}
		/>
	);
}
