import { Container } from '@mui/material';

export default function PrivacyPolicyContent() {
	return (
		<div
			id="privacy-policy"
			className="bg-white py-120"
		>
			<Container maxWidth="lg">
				<div className="flex flex-col items-center justify-center">
					<h2 className="text-3xl uppercase text-gray-900 mb-28 drop-shadow-lg">Privacy Policy</h2>
					<div className="w-full text-2xl grid gap-10">
						<p className="text-gray-700 leading-8 mb-12">
							Your privacy is important to us. It is our policy to respect your privacy regarding any
							information we may collect from you across our website.
						</p>
						<p className="text-gray-700 leading-8 mb-12">
							We only ask for personal information when we truly need it to provide a service to you. We
							collect it by fair and lawful means, with your knowledge and consent. We also let you know
							why we’re collecting it and how it will be used.
						</p>
						<p className="text-gray-700 leading-8 mb-12">
							We only retain collected information for as long as necessary to provide you with your
							requested service. What data we store, we’ll protect within commercially acceptable means to
							prevent loss and theft, as well as unauthorized access, disclosure, copying, use or
							modification.
						</p>
						<p className="text-gray-700 leading-8 mb-12">
							We don’t share any personally identifying information publicly or with third-parties, except
							when required to by law.
						</p>
						<p className="text-gray-700 leading-8 mb-12">
							Our website may link to external sites that are not operated by us. Please be aware that we
							have no control over the content and practices of these sites, and cannot accept
							responsibility or liability for their respective privacy policies.
						</p>
						<p className="text-gray-700 leading-8 mb-12">
							You are free to refuse our request for your personal information, with the understanding
							that we may be unable to provide you with some of your desired services.
						</p>
						<p className="text-gray-700 leading-8">
							Your continued use of our website will be regarded as acceptance of our practices around
							privacy and personal information. If you have any questions about how we handle user data
							and personal information, feel free to contact us.
						</p>
					</div>
				</div>
			</Container>
		</div>
	);
}
