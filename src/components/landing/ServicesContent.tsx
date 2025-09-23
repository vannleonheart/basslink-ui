import { Container } from '@mui/material';
import { AttachMoneyRounded, CurrencyExchangeRounded, SendRounded } from '@mui/icons-material';

export default function ServicesContent() {
	return (
		<div
			id="services"
			className="bg-[#f1f1ed] py-120"
		>
			<Container maxWidth="lg">
				<div className="flex flex-col items-center justify-center gap-32">
					<h2>Our Services</h2>
					<div className="flex flex-col gap-16 md:flex-row">
						<div className="w-full md:w-1/3">
							<div className="bg-white p-16 rounded-lg shadow-2">
								<div className="flex items-center justify-center">
									<CurrencyExchangeRounded className="text-7xl" />
								</div>
								<h3 className="text-24 font-bold mt-16 text-center">OTC Platform</h3>
								<p className="mt-8">
									Manage your money with ease, send funds to anyone, anywhere in the world.
								</p>
							</div>
						</div>
						<div className="w-full md:w-1/3">
							<div className="bg-white p-16 rounded-lg shadow-2">
								<div className="flex items-center justify-center">
									<SendRounded className="text-7xl" />
								</div>
								<h3 className="text-24 font-bold mt-16 text-center">Send Funds</h3>
								<p className="mt-8">
									Exchange your money to any currency of your choice, at the best rate.
								</p>
							</div>
						</div>
						<div className="w-full md:w-1/3">
							<div className="bg-white p-16 rounded-lg shadow-2">
								<div className="flex items-center justify-center">
									<AttachMoneyRounded className="text-7xl" />
								</div>
								<h3 className="text-24 font-bold mt-16 text-center">Accept Funds</h3>
								<p className="mt-12">Accept payments from anywhere in the world, in any currency.</p>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</div>
	);
}
