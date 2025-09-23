export default function Alert({ message, className }: { message: string; className?: string }) {
	return (
		<div className={'mt-24 rounded-b-lg py-20 text-center ' + className}>
			<span className="font-bold">{message}</span>
		</div>
	);
}
