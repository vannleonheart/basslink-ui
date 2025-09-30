'use client';

import DealDetailAgent from '@/components/deals/detail/DealDetailAgent';
import Container from '@/components/PageContainer';
import DealDetailClient from '@/components/deals/detail/DealDetailClient';
import DealDetailAdmin from '@/components/deals/detail/DealDetailAdmin';
import { useSession } from 'next-auth/react';

export default function ViewDeal() {
	const {
		data: { accessToken, side, db: user }
	} = useSession();

	return (
		<Container
			content={
				<div className="mt-24">
					{side === 'client' && (
						<DealDetailClient
							side={side}
							accessToken={accessToken}
							user={user}
						/>
					)}
					{side === 'agent' && (
						<DealDetailAgent
							side={side}
							accessToken={accessToken}
							user={user}
						/>
					)}
					{side === 'admin' && (
						<DealDetailAdmin
							side={side}
							accessToken={accessToken}
							user={user}
						/>
					)}
				</div>
			}
		></Container>
	);
}
