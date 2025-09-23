'use client';

import NewDealSendMoneyForm from '@/components/forms/NewDealSendMoneyForm';
import Header from './Header';
import Container from '@/app/(control-panel)/deals/Container';

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
