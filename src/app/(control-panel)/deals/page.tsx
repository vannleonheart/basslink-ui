'use client';

import DealListAgent from '@/components/deals/list/DealListAgent';
import DealListClient from '@/components/deals/list/DealListClient';
import Container from '@/app/(control-panel)/deals/Container';
import DealListAdmin from '@/components/deals/list/DealListAdmin';
import { useSession } from 'next-auth/react';

function ListActiveDeals() {
	const {
		data: { accessToken, side }
	} = useSession();

	return (
		<Container
			content={
				<div className="mt-24">
					{side === 'client' && (
						<DealListClient
							side={side}
							accessToken={accessToken}
						/>
					)}
					{side === 'agent' && (
						<DealListAgent
							side={side}
							accessToken={accessToken}
						/>
					)}
					{side === 'admin' && (
						<DealListAdmin
							side={side}
							accessToken={accessToken}
						/>
					)}
				</div>
			}
		/>
	);
}

export default ListActiveDeals;
