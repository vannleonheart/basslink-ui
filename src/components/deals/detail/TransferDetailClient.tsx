import { Deal } from '@/types/entity';
import { Accordion, AccordionDetails, AccordionSummary, FilledInput, FormLabel } from '@mui/material';
import { CountryCodeList } from '@/data/country-code';
import { ExpandMoreRounded } from '@mui/icons-material';
import FormControl from '@mui/material/FormControl';
import CopyButton from '../../commons/CopyButton';
import { DateTime } from 'luxon';

export default function TransferDetailClient({ deal }: { deal: Deal }) {
	const countryName = CountryCodeList.find((country) => country.code === deal.receiver_bank_country)?.name;
	const receiverCountryName = CountryCodeList.find((country) => country.code === deal.receiver_country)?.name;
	const agentCountryName = CountryCodeList.find((country) => country.code === deal?.agent?.country)?.name;
	const companyCountryName = CountryCodeList.find((country) => country.code === deal?.agent_company?.country)?.name;
	return (
		<div className="flex flex-col gap-20">
			<div className="bg-gray-100 rounded-lg shadow-3 py-12 px-16">
				{deal.terms_submitted_at && (
					<div className="w-full flex items-center justify-between mb-24">
						<div className="w-1/5 flex flex-col gap-8 px-12">
							<div className="font-bold">Date</div>
							<div>{DateTime.fromISO(deal.due_date).toISODate()}</div>
						</div>
						<div className="w-1/5 flex flex-col gap-8 px-12">
							<div className="font-bold">Transaction rate</div>
							<div className="flex gap-6">
								<div>
									{new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(
										Number(deal.conversion_rate)
									)}
								</div>
								<div>{deal.conversion_type.split('_').join('/')}</div>
							</div>
						</div>
						<div className="w-1/5 flex flex-col gap-8 px-12">
							<div className="font-bold">Commission</div>
							<div className="flex gap-6">
								<div>
									{new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(
										Number(deal.commission_percentage)
									)}
									%
								</div>
								<div>+</div>
								<div className="flex gap-4">
									<span>
										{new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(
											Number(deal.commission_fixed)
										)}
									</span>
									<span>{deal.from_currency}</span>
								</div>
							</div>
						</div>
						<div className="w-1/5 flex flex-col gap-8 px-12">
							<div className="font-bold">Amount To Paid</div>
							<div className="flex gap-6">
								{deal?.from_currency}{' '}
								{new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(deal?.total)}
							</div>
						</div>
						<div className="w-1/5 flex flex-col gap-8 px-12">
							<div className="font-bold">Amount Received</div>
							<div className="flex gap-6">
								{deal?.to_currency}{' '}
								{new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(
									Number(deal?.to_amount)
								)}
							</div>
						</div>
					</div>
				)}
				<div className="w-full flex flex-row items-center justify-between bg-white px-20 py-16 rounded-xl">
					<div className="w-1/2 flex flex-col gap-6">
						<div className="font-bold text-lg">{deal?.agent?.name}</div>
						<div>{agentCountryName}</div>
					</div>
					{deal?.agent_company && (
						<div className="w-1/2 border-l-2 border-gray-200 text-right">
							<div className="font-bold text-lg">{deal?.agent_company?.name}</div>
							<div>{companyCountryName}</div>
						</div>
					)}
				</div>
			</div>
			<Accordion
				className="bg-gray-300 rounded-t-lg"
				sx={{
					marginY: '0 !important'
				}}
			>
				<AccordionSummary expandIcon={<ExpandMoreRounded />}>
					<div className="w-full flex items-center justify-between">
						<div className="w-1/4 flex flex-col gap-8 border-r-2 border-gray-400 px-12">
							<div className="font-bold text-sm">Name</div>
							<div className="">{deal.receiver_name}</div>
						</div>
						<div className="w-1/4 flex flex-col gap-8 border-r-2 border-gray-400 px-12">
							<div className="font-bold text-sm">Country</div>
							<div className="">{countryName}</div>
						</div>
						<div className="w-1/4 flex flex-col gap-8 border-r-2 border-gray-400 px-12">
							<div className="font-bold text-sm">Bank</div>
							<div className="">{deal.receiver_bank_name}</div>
						</div>
						<div className="w-1/4 flex flex-col gap-8 px-12">
							<div className="font-bold text-sm">IBAN</div>
							<div className="">{deal.receiver_bank_account_no}</div>
						</div>
					</div>
				</AccordionSummary>
				<AccordionDetails className="bg-white p-24">
					<div className="flex flex-col gap-24">
						<div className="flex items-center justify-between gap-12">
							<FormControl
								fullWidth
								className="w-1/3"
							>
								<FormLabel>Name</FormLabel>
								<FilledInput
									defaultValue={deal.receiver_name}
									readOnly
									endAdornment={<CopyButton value={deal.receiver_name} />}
								/>
							</FormControl>
							<FormControl
								fullWidth
								className="w-1/3"
							>
								<FormLabel>Address</FormLabel>
								<FilledInput
									defaultValue={
										deal?.receiver_address + ', ' + deal?.receiver_city + ', ' + receiverCountryName
									}
									readOnly
									endAdornment={
										<CopyButton
											value={
												deal?.receiver_address +
												', ' +
												deal?.receiver_city +
												', ' +
												receiverCountryName
											}
										/>
									}
								/>
							</FormControl>
							<FormControl
								fullWidth
								className="w-1/3"
							>
								<FormLabel>Country of registration</FormLabel>
								<FilledInput
									defaultValue={countryName}
									readOnly
									endAdornment={<CopyButton value={countryName} />}
								/>
							</FormControl>
						</div>
						<div className="flex items-center justify-between gap-12">
							<FormControl
								fullWidth
								className="w-1/2"
							>
								<FormLabel>Bank</FormLabel>
								<FilledInput
									defaultValue={deal.receiver_bank_name}
									readOnly
									endAdornment={<CopyButton value={deal.receiver_bank_name} />}
								/>
							</FormControl>
							<FormControl
								fullWidth
								className="w-1/2"
							>
								<FormLabel>Bank Address</FormLabel>
								<FilledInput
									defaultValue={deal.receiver_bank_address}
									readOnly
									endAdornment={<CopyButton value={deal.receiver_bank_address} />}
								/>
							</FormControl>
						</div>
						<div className="flex items-center justify-between gap-12">
							<FormControl
								fullWidth
								className="w-1/4"
							>
								<FormLabel>IBAN</FormLabel>
								<FilledInput
									defaultValue={deal.receiver_bank_account_no}
									readOnly
									endAdornment={<CopyButton value={deal.receiver_bank_account_no} />}
								/>
							</FormControl>
							<FormControl
								fullWidth
								className="w-1/4"
							>
								<FormLabel>SWIFT</FormLabel>
								<FilledInput
									defaultValue={deal.receiver_bank_swift_code}
									readOnly
									endAdornment={<CopyButton value={deal.receiver_bank_swift_code} />}
								/>
							</FormControl>
							<FormControl
								fullWidth
								className="w-1/4"
							>
								<FormLabel>Amount</FormLabel>
								<FilledInput
									defaultValue={new Intl.NumberFormat('en-US', {
										minimumFractionDigits: 0,
										maximumFractionDigits: 2
									}).format(deal.to_amount)}
									readOnly
									endAdornment={<CopyButton value={`${deal.to_amount}`} />}
								/>
							</FormControl>
							<FormControl
								fullWidth
								className="w-1/4"
							>
								<FormLabel>Currency</FormLabel>
								<FilledInput
									defaultValue={deal.to_currency}
									readOnly
									endAdornment={<CopyButton value={deal.to_currency} />}
								/>
							</FormControl>
						</div>
					</div>
				</AccordionDetails>
			</Accordion>
			<div className="w-full flex items-center justify-start flex-col">
				<FormControl fullWidth>
					<FormLabel>What is the payment for</FormLabel>
					<FilledInput
						defaultValue={deal.purpose}
						readOnly
						endAdornment={<CopyButton value={deal.purpose} />}
					/>
				</FormControl>
			</div>
			{deal?.agent_company_account?.id ? (
				<div className="bg-gray-300 rounded-lg shadow-2 p-12">
					<div className="flex flex-col mb-12 border bg-gray-100 py-12 px-8 rounded-lg">
						<div className="font-bold mb-8">Payer</div>
						<div>{deal?.agent_company?.name}</div>
					</div>
					{deal?.agent_company_account?.account_type === 'crypto' ? (
						<div className="flex items-center justify-between gap-8">
							<div className="grow border bg-gray-100 py-12 px-8 rounded-lg">
								<div className="font-bold mb-8">Currency</div>
								<div>{deal?.agent_company_account?.currency}</div>
							</div>
							<div className="grow border bg-gray-100 py-12 px-8 rounded-lg">
								<div className="font-bold mb-8">Currency</div>
								<div>{deal?.agent_company_account?.network}</div>
							</div>
							<div className="grow border bg-gray-100 py-12 px-8 rounded-lg">
								<div className="font-bold mb-8">Currency</div>
								<div>{deal?.agent_company_account?.account_no}</div>
							</div>
						</div>
					) : (
						<div className="flex items-center justify-between gap-8">
							<div className="grow border bg-gray-100 py-12 px-8 rounded-lg">
								<div className="font-bold mb-8">Bank Name</div>
								<div>{deal?.agent_company_account?.bank_name}</div>
							</div>
							<div className="grow border bg-gray-100 py-12 px-8 rounded-lg">
								<div className="font-bold mb-8">IBAN</div>
								<div>{deal?.agent_company_account?.account_no}</div>
							</div>
							<div className="grow border bg-gray-100 py-12 px-8 rounded-lg">
								<div className="font-bold mb-8">Bank Country</div>
								<div>
									{
										CountryCodeList.find(
											(country) => country.code === deal?.agent_company_account?.bank_country
										)?.name
									}
								</div>
							</div>
							<div className="grow border bg-gray-100 py-12 px-8 rounded-lg">
								<div className="font-bold mb-8">Bank SWIFT</div>
								<div>{deal?.agent_company_account?.bank_swift_code}</div>
							</div>
							<div className="grow border bg-gray-100 py-12 px-8 rounded-lg">
								<div className="font-bold mb-8">Bank Address</div>
								<div>{deal?.agent_company_account?.bank_address}</div>
							</div>
						</div>
					)}
				</div>
			) : (
				<></>
			)}
		</div>
	);
}
