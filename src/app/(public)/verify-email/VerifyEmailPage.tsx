import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { clientAuthVerifyEmail } from '@/utils/apiCall';

export default function VerifyEmailPage() {
	const query = useSearchParams();
	const id = query.get('id');
	const token = query.get('token');
	const router = useRouter();

	useEffect(() => {
		clientAuthVerifyEmail(id, token)
			.then((resp) => {
				if (resp.status === 'success') {
					router.push('/signin');
				} else {
					router.push('/resend-verification');
				}
			})
			.catch(() => {
				router.push('/resend-verification');
			});
	}, [id, token]);

	return <></>;
}
