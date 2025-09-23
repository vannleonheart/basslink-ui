import { Accordion, AccordionDetails, AccordionSummary, Container } from '@mui/material';

export default function FAQSContent() {
	const faqs = [
		{
			question: 'What currencies do you support ?',
			answer: 'We support almost all currencies around the world, such as USD, EUR, GBP, JPY, etc.'
		},
		{
			question: 'Do you support Cryptocurrency ?',
			answer: 'Yes, we accept most of the popular cryptocurrencies, especially stable coins like USDT, USDC, EURt, etc.'
		},
		{
			question: 'How long the transaction takes ?',
			answer: 'We process transactions as soon as possible, but it may take a few days depending on transfer method, bank, or country.'
		},
		{
			question: 'Do you have transfer limits ?',
			answer: 'We have no transfer limits, but we may ask for additional information for large transactions.'
		},
		{
			question: 'Do you accept transaction from all countries ?',
			answer: 'We accept transaction from almost all countries, but there are some restrictions for some countries.'
		}
	];

	return (
		<div
			id="faqs"
			className="bg-[#f1f1ed] py-120"
		>
			<Container maxWidth="lg">
				<div className="flex flex-col items-center justify-center">
					<h2 className="text-3xl uppercase text-gray-900 mb-28 drop-shadow-lg">FAQs</h2>
					<div className="w-full text-2xl grid gap-10">
						{faqs.map((faq, index) => (
							<FAQSItemContent
								key={index}
								question={faq.question}
								answer={faq.answer}
							/>
						))}
					</div>
				</div>
			</Container>
		</div>
	);
}

function FAQSItemContent({ question, answer }: { question: string; answer: string }) {
	return (
		<Accordion
			sx={{
				border: '1px solid #e0e0e0',
				boxShadow: 'none',
				borderRadius: '8px',
				'&:before': {
					display: 'none'
				},
				'&.Mui-expanded': {
					margin: '0',
					borderBottom: '1px solid #e0e0e0'
				}
			}}
		>
			<AccordionSummary>
				<h3 className="text-2xl text-gray-700 leading-7">{question}</h3>
			</AccordionSummary>
			<AccordionDetails>
				<p className="text-gray-700 leading-7">{answer}</p>
			</AccordionDetails>
		</Accordion>
	);
}
