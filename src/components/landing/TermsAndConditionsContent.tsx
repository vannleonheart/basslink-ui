import { Container } from '@mui/material';

export default function TermsAndConditionsContent() {
	return (
		<div
			id="terms-and-conditions"
			className="bg-[#f1f1ed] py-120"
		>
			<Container maxWidth="lg">
				<div className="flex flex-col items-center justify-center">
					<h2 className="text-3xl uppercase text-gray-900 mb-28 drop-shadow-lg">Terms &amp; Conditions</h2>
					<div className="w-full text-2xl grid gap-10">
						<p className="text-gray-700 leading-8 mb-12">
							Welcome to our website. If you decide to use our platform, you are agreeing to comply with
							and be bound by the following terms and conditions of use, which together with our privacy
							policy govern our relationship with you in relation to our platform. If you disagree with
							any part of these terms and conditions, please do not use our platform.
						</p>
						<p className="text-gray-700 leading-8 mb-12">
							The term ‘us’ or ‘we’ refers to us as the owner of the platform. The term ‘you’ refers to
							the user or viewer of our website.
						</p>
						<p className="text-gray-700 leading-8 mb-12">
							The use of this website is subject to the following terms of use:
						</p>
						<p className="text-gray-700 leading-8 mb-12">
							The content of the pages of this website is for your general information and use only. It is
							subject to change without notice.
						</p>
						<p className="text-gray-700 leading-8 mb-12">
							This website uses cookies to monitor browsing preferences. If you do allow cookies to be
							used, the following personal information may be stored by us for use by third parties.
						</p>
						<p className="text-gray-700 leading-8 mb-12">
							Neither we nor any third parties provide any warranty or guarantee as to the accuracy,
							timeliness, performance, completeness or suitability of the information and materials found
							or offered on this website for any particular purpose. You acknowledge that such information
							and materials may contain inaccuracies or errors and we expressly exclude liability for any
							such inaccuracies or errors to the fullest extent permitted by law.
						</p>
						<p className="text-gray-700 leading-8 mb-12">
							Your use of any information or materials on this website is entirely at your own risk, for
							which we shall not be liable. It shall be your own responsibility to ensure that any
							products, services or information available through this website meet your specific
							requirements.
						</p>
						<p className="text-gray-700 leading-8 mb-12">
							This website contains material which is owned by or licensed to us. This material includes,
							but is not limited to, the design, layout, look, appearance and graphics. Reproduction is
							prohibited other than in accordance with the copyright notice.
						</p>
						<p className="text-gray-700 leading-8 mb-12">
							All trademarks reproduced in this website, which are not the property of, or licensed to the
							operator, are acknowledged on the website.
						</p>
						<p className="text-gray-700 leading-8 mb-12">
							Unauthorised use of this website may give rise to a claim for damages and/or be a criminal
							offence.
						</p>
						<p className="text-gray-700 leading-8 mb-12">
							From time to time, this website may also include links to other websites. These links are
							provided for your convenience to provide further information. They do not signify that we
							endorse the website(s). We have no responsibility for the content of the linked website(s).
						</p>
						<p className="text-gray-700 leading-8">
							Your use of this website and any dispute arising out of such use of the website is subject
							to the laws of England, Northern Ireland, Scotland and Wales.
						</p>
					</div>
				</div>
			</Container>
		</div>
	);
}
