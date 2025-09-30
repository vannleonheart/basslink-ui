'use client';

import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useParams } from 'next/navigation';
import FuseLoading from '@fuse/core/FuseLoading';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/system/Box';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from 'src/store/hooks';
import useNavigate from '@fuse/hooks/useNavigate';
import { useEffect, useState } from 'react';
import { AgentCompany } from '@/types/entity';
import { agentGetCompanyById } from '@/utils/apiCall';
import { useSession } from 'next-auth/react';
import { CountryCodeList } from '@/data/country-code';

export default function Page() {
	const {
		data: { accessToken }
	} = useSession();
	const routeParams = useParams<{ companyId: string }>();
	const { companyId } = routeParams;
	const [company, setCompany] = useState<AgentCompany | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (!companyId) {
			setIsLoading(false);
			setIsError(true);
			return;
		}

		agentGetCompanyById(companyId, accessToken)
			.then((resp) => {
				if (resp.status === 'success') {
					setCompany(resp.data as AgentCompany);
					setIsError(false);
					setIsLoading(false);
				}
			})
			.catch((err) => {
				dispatch(showMessage({ message: err.message }));
				setIsError(true);
				setIsError(true);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [accessToken, companyId]);

	if (isLoading) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (isError) {
		setTimeout(() => {
			navigate('/companies');
			dispatch(showMessage({ message: 'NOT FOUND' }));
		}, 0);

		return null;
	}

	if (!company) {
		return null;
	}

	const companyCountry = CountryCodeList.find((c) => c.code === company?.country) || null;

	return (
		<>
			<Box
				className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
				sx={{
					backgroundColor: 'background.default'
				}}
			>
				{company?.background && (
					<img
						className="absolute inset-0 object-cover w-full h-full"
						src={company?.background}
						alt="user background"
					/>
				)}
			</Box>
			<div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
				<div className="w-full max-w-3xl">
					<div className="flex flex-auto items-end -mt-64">
						<Avatar
							sx={{
								borderWidth: 4,
								borderStyle: 'solid',
								borderColor: 'background.paper',
								backgroundColor: 'background.default',
								color: 'text.secondary'
							}}
							className="w-128 h-128 text-64 font-bold"
							src={company?.image}
							alt={company?.name}
						>
							{company?.name?.charAt(0)}
						</Avatar>
						<div className="flex items-center ml-auto mb-4">
							<Button
								variant="contained"
								color="secondary"
								component={NavLinkAdapter}
								to={`/companies/${companyId}/edit`}
							>
								<FuseSvgIcon size={20}>heroicons-outline:pencil-square</FuseSvgIcon>
								<span className="mx-8">Edit</span>
							</Button>
						</div>
					</div>

					<Typography className="mt-12 text-4xl font-bold truncate">{company.name}</Typography>
					<Divider className="mt-16 mb-24" />
					<div className="flex flex-col space-y-32">
						{(company?.address || company?.city || companyCountry) && (
							<div className="flex items-center gap-24">
								<FuseSvgIcon size={36}>heroicons-solid:building-office-2</FuseSvgIcon>
								<div className="flex flex-grow flex-col gap-8">
									{company?.address && <div>{company?.address}</div>}
									<div className="flex items-center gap-8">
										{company?.city && <div className="font-bold">{company?.city}</div>}
										{companyCountry && <div className="font-bold">{companyCountry?.name}</div>}
									</div>
								</div>
							</div>
						)}

						{company?.accounts?.map((account, index) => {
							const country = CountryCodeList.find((c) => c.code === account?.bank_country) || null;
							return (
								<div
									key={index}
									className="w-full flex items-start gap-24"
								>
									<FuseSvgIcon size={36}>heroicons-solid:document-currency-dollar</FuseSvgIcon>
									<div className="w-full flex flex-col gap-8">
										{account?.label && <div className="font-bold">{account?.label}</div>}
										{account.account_type === 'crypto' && (
											<div className="w-full flex flex-col gap-8">
												<div className="w-full flex items-center justify-start gap-12">
													<div className="font-bold">Currency</div>
													<div>{account?.currency}</div>
												</div>
												<div className="w-full flex items-center justify-start gap-12">
													<div className="font-bold">Network</div>
													<div>{account?.network}</div>
												</div>
												<div className="w-full flex items-center justify-start gap-12">
													<div className="font-bold">Address</div>
													<div>{account.account_no}</div>
												</div>
											</div>
										)}
										{account.account_type === 'fiat' && (
											<div className="w-full flex flex-col gap-8">
												<div className="w-full flex items-center justify-start gap-12">
													<div className="font-bold">Bank</div>
													<div>{account?.bank_name}</div>
												</div>
												<div className="w-full flex items-center justify-start gap-12">
													<div className="font-bold">IBAN</div>
													<div>{account?.account_no}</div>
												</div>
												<div className="w-full flex items-center justify-start gap-12">
													<div className="font-bold">Country</div>
													<div>{country?.name}</div>
												</div>
												<div className="w-full flex items-center justify-start gap-12">
													<div className="font-bold">Address</div>
													<div>{account?.bank_address}</div>
												</div>
												<div className="w-full flex items-center justify-start gap-12">
													<div className="font-bold">Swift</div>
													<div>{account?.bank_swift_code}</div>
												</div>
											</div>
										)}
									</div>
								</div>
							);
						})}

						{company?.notes ? (
							<div className="flex items-start gap-24">
								<FuseSvgIcon size={36}>heroicons-outline:bars-3-bottom-left</FuseSvgIcon>
								<div
									className="max-w-none prose dark:prose-invert"
									dangerouslySetInnerHTML={{ __html: company?.notes }}
								/>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</>
	);
}
