import { Disbursement } from '@/types/entity';

export default function Content({
	data,
	isLoading,
	fetch
}: {
	data: Disbursement[];
	isLoading: boolean;
	fetch: () => void;
}) {
	return <div className="p-24 sm:p-32 w-full">Disbursements Content</div>;
}
