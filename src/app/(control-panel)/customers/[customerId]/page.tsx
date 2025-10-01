'use client';

import Empty from '@/components/commons/Empty';
import LoadingBar from '@/components/commons/LoadingBar';
import NewCustomerForm from '@/components/forms/NewCustomerForm';
import PageContainer from '@/components/PageContainer';
import PageHeader from '@/components/PageHeader';
import apiService from '@/store/apiService';
import { User } from '@/types/entity';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

export default function CustomerDetailPage() {
	const { customerId } = useParams();
	const {
		data: { accessToken, side }
	} = useSession();
	const { data: customerData, isLoading } = apiService.useGetCustomerQuery({
		id: customerId!,
		side,
		accessToken
	});
	const customer: User | null = useMemo(() => customerData as User, [customerData]);

	return (
		<PageContainer
			header={<PageHeader title="Informasi Pengirim" />}
			content={
				<div className="px-16 pb-28 h-full">
					{isLoading ? (
						<LoadingBar />
					) : customer ? (
						<NewCustomerForm customer={customer} />
					) : (
						<Empty text="Data pengirim tidak ditemukan" />
					)}
				</div>
			}
		/>
	);
}
