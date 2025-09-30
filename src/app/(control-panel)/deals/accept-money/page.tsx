'use client';

import NewDealSendMoneyForm from '@/components/forms/NewDisbursementForm';
import Header from './Header';
import Container from '@/components/PageContainer';

function NewDealPage() {
	return (
		<Container
			header={<Header />}
			content={
				<div className="px-24 pb-28">
					<NewDealSendMoneyForm />
				</div>
			}
		/>
	);
}

export default NewDealPage;
