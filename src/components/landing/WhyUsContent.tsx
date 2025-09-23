import { Container } from '@mui/material';
import { CurrencyBitcoinRounded, LockRounded, MonetizationOnRounded, Support } from '@mui/icons-material';

export default function WhyChooseUsContent() {
	return (
		<div id="why-choose-us" className="bg-white py-120">
			<Container maxWidth="lg">
				<div className="flex flex-col items-center justify-center">
					<h2 className="text-3xl uppercase text-gray-900 mb-28 drop-shadow-lg">Why Choose Us</h2>
					<div className="text-2xl w-full flex flex-col gap-96">
						<div className="w-full flex flex-col items-center justify-between gap-96 md:flex-row">
							<div className="w-full md:w-1/2 p-16 text-center">
								<div className="flex items-center justify-center">
									<CurrencyBitcoinRounded className="text-7xl" />
								</div>
								<h3 className="text-24 font-bold mt-16">Any Currency</h3>
								<p className="mt-16">
									We support all currencies, you can send or receive money in any currency around the
									world.
								</p>
							</div>
							<div className="w-full md:w-1/2 p-16 text-center">
								<div className="flex items-center justify-center">
									<MonetizationOnRounded className="text-7xl" />
								</div>
								<h3 className="text-24 font-bold mt-16">Best Rate</h3>
								<p className="mt-16">
									We offer the best exchange rate for your money, no hidden charges.
								</p>
							</div>
						</div>
						<div className="w-full flex flex-col items-center justify-between gap-96 md:flex-row">
							<div className="w-full md:w-1/2 p-16 text-center">
								<div className="flex items-center justify-center">
									<LockRounded className="text-7xl" />
								</div>
								<h3 className="text-24 font-bold mt-16">Fast & Secure</h3>
								<p className="mt-16">
									We ensure your money gets to its destination as fast as possible, securely.
								</p>
							</div>
							<div className="w-full md:w-1/2 p-16 text-center">
								<div className="flex items-center justify-center">
									<Support className="text-7xl" />
								</div>
								<h3 className="text-24 font-bold mt-16">24/7 Support</h3>
								<p className="mt-16">Our support team is available 24/7 to help you with any issues.</p>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</div>
	);
}
