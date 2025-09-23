import { Container } from '@mui/material';

export default function SupportContent() {
	return (
		<div
			id="support"
			className="bg-white py-120 text-center"
		>
			<Container maxWidth="lg">
				<h2 className="text-3xl uppercase text-gray-900 mb-28 drop-shadow-lg">Support</h2>
				<p className="text-2xl text-gray-700 leading-7">
					If you have any questions or need help, please contact us at{' '}
					<a href="mailto:help@bricslink.io">help@bricslink.io</a>.
					<br />
					We will respond to your inquiry as soon as possible.
				</p>
			</Container>
		</div>
	);
}
