'use client';

import PageContainer from '@/components/PageContainer';
import Content from './Content';

function Page() {
	return (
		<PageContainer
			title="Janji Temu"
			content={<Content />}
		/>
	);
}

export default Page;
