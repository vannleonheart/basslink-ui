import CopyButton from '@/components/commons/CopyButton';
import StatusLabel from '@/components/commons/StatusLabel';
import { CountryCodeList } from '@/data/country-code';
import {
	FundSources,
	IdentityTypes,
	Occupations,
	RelationshipTypes,
	TransferPurposes,
	UserTypes
} from '@/data/static-data';
import { Remittance } from '@/types/entity';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { useMemo } from 'react';

type ContentProps = {
	remittance: Remittance;
	isLoading?: boolean;
};

export default function Content({ remittance, isLoading }: ContentProps) {
	const userTypes = useMemo(() => {
		const types: Record<string, string> = {};
		Object.keys(UserTypes).forEach((key) => {
			types[key] = UserTypes[key];
		});
		return types;
	}, []);

	const purposeTypes = useMemo(() => {
		const types: Record<string, string> = {};
		Object.keys(TransferPurposes).forEach((key) => {
			types[key] = TransferPurposes[key];
		});
		return types;
	}, []);

	const fundSourceTypes = useMemo(() => {
		const types: Record<string, string> = {};
		Object.keys(FundSources).forEach((key) => {
			types[key] = FundSources[key];
		});
		return types;
	}, []);

	const countryList = useMemo(() => {
		const types: Record<string, string> = {};
		CountryCodeList.forEach((item) => {
			types[item.code] = item.name;
		});
		return types;
	}, []);

	const identityTypeList = useMemo(() => {
		const types: Record<string, string> = {};
		Object.keys(IdentityTypes).forEach((key) => {
			types[key] = IdentityTypes[key];
		});
		return types;
	}, []);

	const occupationList = useMemo(() => {
		const types: Record<string, string> = {};
		Object.keys(Occupations).forEach((key) => {
			types[key] = Occupations[key];
		});
		return types;
	}, []);

	const relationshipList = useMemo(() => {
		const types: Record<string, string> = {};
		Object.keys(RelationshipTypes).forEach((key) => {
			types[key] = RelationshipTypes[key];
		});
		return types;
	}, []);

	return (
		!isLoading &&
		remittance && (
			<div className="mt-28 flex flex-col gap-6 bg-white p-12 rounded shadow">
				<div className="flex flex-col md:flex-row md:justify-between gap-8 bg-gray-100 p-4 rounded border-1 border-gray-300">
					<div className="flex gap-4 items-center">
						<FuseSvgIcon size={18}>heroicons-outline:bookmark</FuseSvgIcon>
						<Typography>{remittance.id}</Typography>
					</div>
					<div className="flex gap-4 items-center">
						<FuseSvgIcon size={18}>heroicons-outline:clock</FuseSvgIcon>
						<Typography>
							{DateTime.fromSeconds(remittance.created).toFormat('LLL dd, yyyy hh:mm a')}
						</Typography>
					</div>
				</div>
				<div className="flex flex-col md:flex-row md:justify-between gap-4">
					<div className="w-full md:w-1/3 bg-gray-100 p-6 rounded border-1 border-gray-300">
						<div className="h-full flex flex-col gap-4 justify-center items-center">
							<Typography
								className="font-bold"
								fontSize={14}
							>
								{remittance?.to_bank_name}
							</Typography>
							<div className="flex gap-8 items-center">
								<Typography
									className="font-medium"
									fontSize={12}
								>
									{remittance?.to_bank_account_no}
								</Typography>
								<CopyButton value={remittance?.to_bank_account_no || ''} />
							</div>
							<Typography
								className="font-medium"
								fontSize={12}
							>
								{remittance?.to_bank_name}
							</Typography>
						</div>
					</div>
					<div className="w-full md:w-1/3 bg-gray-100 p-6	 rounded flex flex-col gap-8 justify-center items-center border-1 border-gray-300">
						<div className="flex flex-col gap-8 justify-center items-center">
							<Typography
								className="font-medium"
								fontSize={10}
							>
								STATUS
							</Typography>
							<StatusLabel
								status={remittance.status}
								size="medium"
							/>
						</div>
					</div>
					<div className="w-full md:w-1/3 bg-gray-100 p-6 rounded flex flex-col gap-12 justify-center items-center border-1 border-gray-300">
						<div className="w-full bg-gray-200 p-4 rounded flex flex-col gap-4 justify-center items-center">
							<Typography
								className="font-medium"
								fontSize={12}
							>
								{remittance?.target_currency?.name} ({remittance?.target_currency?.symbol})
							</Typography>
						</div>
						<div className="flex gap-8 justify-center items-center">
							<Typography
								className="font-bold"
								fontSize={20}
							>
								{new Intl.NumberFormat('en-US', {
									minimumFractionDigits: 0,
									maximumFractionDigits: 2
								}).format(remittance.to_amount)}
							</Typography>
							<CopyButton value={remittance.to_amount.toString()} />
						</div>
					</div>
				</div>
				<Accordion
					square
					disableGutters
					className="bg-gray-50"
					expanded
					sx={{
						boxShadow: 'none',
						border: '1px solid',
						borderColor: 'grey.300',
						'&:before': {
							display: 'none'
						}
					}}
				>
					<AccordionSummary>
						<div className="flex flex-row gap-6 items-center">
							<FuseSvgIcon size={20}>heroicons-outline:information-circle</FuseSvgIcon>
							<Typography className="font-bold">Detail Pengiriman</Typography>
						</div>
					</AccordionSummary>
					<AccordionDetails>
						<div className="flex flex-col gap-16">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-16">
								<div className="bg-gray-200 p-12 rounded flex flex-col gap-12">
									<div className="flex gap-6 items-center">
										<FuseSvgIcon size={16}>heroicons-outline:paper-airplane</FuseSvgIcon>
										<Typography className="font-bold">Pengirim</Typography>
									</div>
									<div className="flex flex-col gap-4">
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Jenis Pengirim</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{userTypes[remittance.from_sender_type] || remittance.from_sender_type}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">
												Nama Pengirim Sesuai Identitas
											</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{remittance.from_name}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Kewarganegaraan</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{countryList[remittance.from_citizenship] ||
													remittance.from_citizenship}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Jenis Identitas</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{identityTypeList[remittance.from_identity_type] ||
													remittance.from_identity_type}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Nomor Identitas</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{remittance.from_identity_no}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Pekerjaan</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{occupationList[remittance.from_occupation] ||
													remittance.from_occupation}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">No. Telepon/Email</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{remittance.from_contact}
											</Typography>
										</div>
										<div className="flex gap-4 items-center justify-between items-start">
											<Typography className="w-full md:w-1/2">Alamat Sesuai Identitas</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{remittance.from_registered_address}, {remittance.from_registered_city},{' '}
												{remittance.from_registered_region},{' '}
												{countryList[remittance.from_registered_country] ||
													remittance.from_registered_country}
												, {remittance.from_registered_zip_code}
											</Typography>
										</div>
										<div className="flex gap-4 items-center justify-between items-start">
											<Typography className="w-full md:w-1/2">Alamat Domisili</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{remittance.from_address}, {remittance.from_city},{' '}
												{remittance.from_region},{' '}
												{countryList[remittance.from_country] || remittance.from_country},{' '}
												{remittance.from_zip_code}
											</Typography>
										</div>
									</div>
								</div>
								<div className="bg-gray-200 p-12 rounded flex flex-col gap-12">
									<div className="flex gap-6 items-center">
										<FuseSvgIcon size={16}>heroicons-outline:gift-top</FuseSvgIcon>
										<Typography className="font-bold">Penerima</Typography>
									</div>
									<div className="flex flex-col gap-4">
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Jenis Penerima</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{userTypes[remittance.to_recipient_type] ||
													remittance.to_recipient_type}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Nama Penerima</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{remittance.to_name}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">No. Telepon/Email</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{remittance.to_contact}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Alamat</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{remittance.to_address}, {remittance.to_city}, {remittance.to_region},{' '}
												{countryList[remittance.to_country] || remittance.to_country}
											</Typography>
										</div>
										<div className="flex gap-4 items-center items-center justify-between">
											<Typography className="w-full md:w-1/2">Hubungan</Typography>
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{relationshipList[remittance.to_relationship] ||
													remittance.to_relationship}
											</Typography>
										</div>
									</div>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-16">
								<div className="bg-gray-200 p-12 rounded flex flex-row gap-4 justify-between items-center">
									<Typography className="font-bold">Mata Uang Pengirim:</Typography>
									<Typography>
										{remittance?.source_currency?.name} ({remittance?.source_currency?.symbol})
									</Typography>
								</div>
								<div className="bg-gray-200 p-12 rounded flex flex-row gap-4 justify-between items-center">
									<Typography className="font-bold">Jumlah Dikirim:</Typography>
									<Typography>
										{new Intl.NumberFormat('en-US', {
											minimumFractionDigits: 0,
											maximumFractionDigits: 2
										}).format(remittance.from_amount)}
									</Typography>
								</div>
							</div>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-16">
								<div className="bg-gray-200 p-12 rounded flex flex-row gap-4 justify-between items-center">
									<Typography className="font-bold">Rate:</Typography>
									<Typography>{remittance.rate}</Typography>
								</div>
								<div className="bg-gray-200 p-12 rounded flex flex-row gap-4 justify-between items-center">
									<Typography className="font-bold">Biaya Persentase:</Typography>
									<Typography>{remittance.fee_amount_percent} %</Typography>
								</div>
								<div className="bg-gray-200 p-12 rounded flex flex-row gap-4 justify-between items-center">
									<Typography className="font-bold">Biaya Tetap:</Typography>
									<Typography>
										{remittance?.source_currency?.symbol}{' '}
										{new Intl.NumberFormat('en-US', {
											minimumFractionDigits: 0,
											maximumFractionDigits: 2
										}).format(remittance.fee_amount_fixed)}
									</Typography>
								</div>
								<div className="bg-gray-200 p-12 rounded flex flex-row gap-4 justify-between items-center">
									<Typography className="font-bold">Biaya Total:</Typography>
									<Typography>
										{remittance?.source_currency?.symbol}{' '}
										{new Intl.NumberFormat('en-US', {
											minimumFractionDigits: 0,
											maximumFractionDigits: 2
										}).format(remittance.fee_total)}
									</Typography>
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-16">
								<div className="bg-gray-200 p-12 rounded flex flex-col gap-8">
									<Typography className="font-bold">Tujuan Pengiriman:</Typography>
									<Typography>{purposeTypes[remittance.purpose] || remittance.purpose}</Typography>
								</div>
								<div className="bg-gray-200 p-12 rounded flex flex-col gap-8">
									<Typography className="font-bold">Sumber Dana:</Typography>
									<Typography>
										{fundSourceTypes[remittance.fund_source] || remittance.fund_source}
									</Typography>
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-16">
								<div className="bg-gray-200 p-12 rounded flex flex-col gap-8">
									<Typography className="font-bold">Detail Bank</Typography>
									<div className="flex gap-4 items-center items-center justify-between">
										<Typography className="w-full md:w-1/2">Nama Bank</Typography>
										<Typography className="w-full md:w-1/2 font-medium text-right">
											{remittance.to_bank_name}
										</Typography>
									</div>
									<div className="flex gap-4 items-center items-center justify-between">
										<Typography className="w-full md:w-1/2">Nomor Rekening</Typography>
										<div className="flex gap-8 items-center justify-end w-full md:w-1/2">
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{remittance.to_bank_account_no}
											</Typography>
											<CopyButton value={remittance?.to_bank_account_no || ''} />
										</div>
									</div>
									<div className="flex gap-4 items-center items-center justify-between">
										<Typography className="w-full md:w-1/2">Pemilik Rekening</Typography>
										<Typography className="w-full md:w-1/2 font-medium text-right">
											{remittance.to_bank_account_owner}
										</Typography>
									</div>
									<div className="flex gap-4 items-center items-center justify-between">
										<Typography className="w-full md:w-1/2">Kode Bank</Typography>
										<div className="flex gap-8 items-center justify-end w-full md:w-1/2">
											<Typography className="w-full md:w-1/2 font-medium text-right">
												{remittance.to_bank_code}
											</Typography>
											<CopyButton value={remittance?.to_bank_code || ''} />
										</div>
									</div>
								</div>
								{remittance.attachments && remittance.attachments.length > 0 && (
									<div className="w-full bg-gray-200 p-12 rounded flex flex-col gap-8">
										<Typography className="font-bold">Lampiran:</Typography>
										{remittance.attachments.map((attachment) => (
											<a
												key={attachment.id}
												href={attachment.attachment}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 hover:underline break-all p-12"
											>
												<FuseSvgIcon
													className="inline-block mr-4"
													size={16}
												>
													heroicons-outline:paper-clip
												</FuseSvgIcon>
												{attachment.attachment.split('/').pop()}
											</a>
										))}
									</div>
								)}
							</div>
						</div>
					</AccordionDetails>
					<AccordionActions>
						<Typography className="text-xs text-gray-500 italic">
							* Informasi berdasarkan data yang diberikan oleh pengguna saat melakukan pengiriman dana
						</Typography>
					</AccordionActions>
				</Accordion>
			</div>
		)
	);
}
