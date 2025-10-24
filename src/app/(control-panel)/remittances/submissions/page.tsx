'use client';

import Content from './Content';
import PageContainer from '@/components/PageContainer';

export default function App() {
	return (
		<PageContainer
			title="Daftar Pengajuan"
			content={<Content />}
		/>
	);
}
