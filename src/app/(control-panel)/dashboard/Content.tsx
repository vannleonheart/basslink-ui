import Inbox from './Inbox';
import NotificationBox from './NotificationBox';
import RecentTransaction from './RecentTransaction';

export default function Content() {
	return (
		<div className="my-20 flex flex-col gap-20">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-20">
				<NotificationBox />
				<Inbox />
			</div>
			<RecentTransaction />
		</div>
	);
}
