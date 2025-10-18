'use client';

import PageContainer from '@/components/PageContainer';
import Content from './Content';

function Dashboard() {
	return (
		<PageContainer
			title="Dashboard"
			content={<Content />}
		/>
	);
}

export default Dashboard;
