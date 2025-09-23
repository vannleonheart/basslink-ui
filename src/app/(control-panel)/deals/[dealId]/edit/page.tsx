'use client';

import NewDealSendMoneyForm from '@/components/forms/NewDealSendMoneyForm';
import Header from './Header';
import { useEffect } from 'react';
import { Deal } from '@/types';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import useNavigate from '@fuse/hooks/useNavigate';
import { useDispatch } from 'react-redux';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import Container from '@/app/(control-panel)/deals/Container';
import apiService from '@/store/apiService';

function EditDealPage() {
	const {
		data: { accessToken, side }
	} = useSession();
	const params = useParams();
	const dealId = params.dealId.toString();
	const {
		data: deal,
		isLoading,
		refetch
	} = apiService.useGetDealByIdQuery({
		side,
		accessToken,
		id: dealId
	});
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (!isLoading && !deal) {
			dispatch(showMessage({ message: err?.message ?? 'Error when fetch data', variant: 'error' }));
			navigate('/deals');
		}
	}, [isLoading]);

	return (
		<Container
			header={<Header />}
			content={
				<div className="pb-28">
					{!isLoading && deal && (
						<NewDealSendMoneyForm
							deal={deal as Deal}
							fetch={refetch}
						/>
					)}
				</div>
			}
		/>
	);
}

export default EditDealPage;
