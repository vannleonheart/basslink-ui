'use client';

import { redirect, useParams } from 'next/navigation';
import CompanyForm from '../CompanyForm';

function Page() {
	const { companyId } = useParams<{ companyId: string }>();

	if (companyId === 'new') {
		return <CompanyForm isNew />;
	}

	redirect(`/companies/${companyId}/view`);

	return null;
}

export default Page;
