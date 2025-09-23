import { Container } from '@mui/material';
import Button from '@mui/material/Button';

export default function BannerContent() {
	return (
		<div className="bg-white py-12 pb-48">
			<Container maxWidth="lg">
				<div className="flex flex-wrap border rounded-lg shadow-2">
					<div className="w-full py-20 px-24 md:w-2/3">
						<div className="max-w-640">
							<h1 className="text-48 font-light">Digital Solution</h1>
							<p className="text-18 mt-16 mb-28 leading-7">
								We provide digital solutions to help you grow your business, sending money to anywhere
								in the world or accept payments from anywhere in the world, we have you covered. One
								platform, endless possibilities.
							</p>
							<Button
								href="/signin"
								variant="contained"
								color="primary"
								size="large"
							>
								Start Now
							</Button>
						</div>
					</div>
					<div className="w-full flex items-center justify-end md:w-1/3">
						<div className="max-w-400">
							<img
								className="rounded-r-lg"
								src="/assets/images/banner.png"
								alt="banner"
							/>
						</div>
					</div>
				</div>
			</Container>
		</div>
	);
}
