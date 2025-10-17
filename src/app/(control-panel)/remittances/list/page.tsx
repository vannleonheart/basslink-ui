'use client';

import Content from './Content';
import PageHeader from '@/components/PageHeader';
import PageContainer from '@/components/PageContainer';

export default function App() {
	return (
		<PageContainer
			header={<PageHeader title="Daftar Pengiriman" />}
			content={<Content />}
		/>
	);
}
