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
import { clientGetContactById } from '@/utils/apiCall';
import { useSession } from 'next-auth/react';
import { ClientContact } from '@/types';

function ContactView() {
	const {
		data: { accessToken }
	} = useSession();
	const routeParams = useParams<{ contactId: string }>();
	const { contactId } = routeParams;
	const [contact, setContact] = useState<ClientContact | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isError, setIsError] = useState(false);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (!contactId) {
			setIsLoading(false);
			setIsError(true);
			return;
		}

		clientGetContactById(contactId, accessToken)
			.then((resp) => {
				if (resp.status === 'success') {
					setContact(resp.data);
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
	}, [accessToken, contactId]);

	if (isLoading) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (isError) {
		setTimeout(() => {
			navigate('/contacts');
			dispatch(showMessage({ message: 'NOT FOUND' }));
		}, 0);

		return null;
	}

	if (!contact) {
		return null;
	}

	return (
		<>
			<Box
				className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
				sx={{
					backgroundColor: 'background.default'
				}}
			>
				{contact.background && (
					<img
						className="absolute inset-0 object-cover w-full h-full"
						src={contact.background}
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
							src={contact.image}
							alt={contact.name}
						>
							{contact?.name?.charAt(0)}
						</Avatar>
						<div className="flex items-center ml-auto mb-4">
							<Button
								variant="contained"
								color="secondary"
								component={NavLinkAdapter}
								to={`/contacts/${contactId}/edit`}
							>
								<FuseSvgIcon size={20}>heroicons-outline:pencil-square</FuseSvgIcon>
								<span className="mx-8">Edit</span>
							</Button>
						</div>
					</div>

					<Typography className="mt-12 text-4xl font-bold truncate">{contact.name}</Typography>
					<Divider className="mt-16 mb-24" />

					<div className="flex flex-col space-y-32">
						<div className="flex flex-col bg-gray-200 p-12 rounded shadow gap-16">
							<div className="flex items-start justify-start gap-36">
								{contact.bank_country && (
									<div className="w-1/2 flex items-start justify-between gap-12">
										<div className="font-bold">Bank Country:</div>
										<div>{contact.bank_country}</div>
									</div>
								)}

								{contact.bank_swift_code && (
									<div className="w-1/2 flex items-start justify-between gap-12">
										<div className="font-bold">Swift Code</div>
										<div>{contact.bank_swift_code}</div>
									</div>
								)}
							</div>

							<div className="flex items-start justify-start gap-36">
								{contact.bank_name && (
									<div className="w-1/2 flex items-start justify-between gap-12">
										<div className="font-bold">Bank Name:</div>
										<div>{contact.bank_name}</div>
									</div>
								)}

								{contact.bank_account_no && (
									<div className="w-1/2 flex items-start justify-between gap-12">
										<div className="font-bold">Bank Account No:</div>
										<div>{contact.bank_account_no}</div>
									</div>
								)}
							</div>
						</div>

						{contact?.emails?.length
							? contact.emails.some((item) => item.email?.length > 0) && (
									<div className="flex items-start gap-24">
										<FuseSvgIcon size={36}>heroicons-outline:envelope</FuseSvgIcon>
										<div className="flex flex-grow flex-col gap-12">
											{contact.emails.map(
												(item) =>
													item.email !== '' && (
														<div
															className="flex flex-col justify-start gap-2"
															key={item.email}
														>
															{item.label && (
																<Typography
																	className="text-md truncate font-bold"
																	color="text.secondary"
																>
																	<span>{item.label}</span>
																</Typography>
															)}
															<div>{item.email}</div>
														</div>
													)
											)}
										</div>
									</div>
								)
							: null}

						{contact?.phones?.length
							? contact.phones.some((item) => item.phone_no?.length > 0) && (
									<div className="flex items-start gap-24">
										<FuseSvgIcon size={36}>heroicons-outline:phone</FuseSvgIcon>
										<div className="flex flex-grow flex-col gap-12">
											{contact.phones.map(
												(item) =>
													item.phone_no !== '' && (
														<div
															className="flex flex-col justify-start gap-2"
															key={item.phone_no}
														>
															{item.label && (
																<Typography
																	className="text-md truncate font-bold"
																	color="text.secondary"
																>
																	<span>{item.label}</span>
																</Typography>
															)}
															<div>
																{item.phone_code} {item.phone_no}
															</div>
														</div>
													)
											)}
										</div>
									</div>
								)
							: null}

						{(contact.address || contact.city || contact.country) && (
							<div className="flex items-start gap-24">
								<FuseSvgIcon size={36}>heroicons-solid:building-office-2</FuseSvgIcon>
								<div className="flex flex-grow flex-col gap-8">
									{contact.address && <div>{contact.address}</div>}
									<div className="flex items-center gap-8">
										{contact.city && <div className="font-bold">{contact.city}</div>}
										{contact.country && <div className="font-bold">{contact.country}</div>}
									</div>
								</div>
							</div>
						)}

						{contact.notes ? (
							<div className="flex items-start gap-24">
								<FuseSvgIcon size={36}>heroicons-outline:bars-3-bottom-left</FuseSvgIcon>
								<div
									className="max-w-none prose dark:prose-invert"
									dangerouslySetInnerHTML={{ __html: contact.notes }}
								/>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</>
	);
}

export default ContactView;
