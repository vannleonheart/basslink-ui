'use client';

import PageContainer from '@/components/PageContainer';
import Content from './Content';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import apiService from '@/store/apiService';
import { Remittance } from '@/types/entity';
import { useMemo } from 'react';

export default function RemittanceDetailPage() {
	const {
		data: { accessToken, side }
	} = useSession();
	const { id } = useParams<{ id: string }>();
	const { data: remittanceData, isLoading } = apiService.useGetRemittanceByIdQuery(
		{
			side,
			accessToken,
			id
		},
		{
			skip: !id
		}
	);
	const remittance = useMemo(() => (remittanceData ?? {}) as Remittance, [remittanceData]);

	return (
		<PageContainer
			title="Detail Pengiriman Dana"
			content={
				<Content
					accessToken={accessToken}
					side={side}
					remittance={remittance}
					isLoading={isLoading}
				/>
			}
		/>
	);
}
