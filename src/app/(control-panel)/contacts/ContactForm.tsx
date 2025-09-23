'use client';

import Button from '@mui/material/Button';
import Link from '@fuse/core/Link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from '@/store/hooks';
import useNavigate from '@fuse/hooks/useNavigate';
import ContactEmailSelector from './ContactEmailSelector';
import PhoneNumberSelector from './PhoneNumberSelector';
import ContactModel from './ContactModel';
import { ClientContact } from '@/types';
import MenuItem from '@mui/material/MenuItem';
import { CountryCodeList } from '@/data/country-code';
import {
	clientCreateContact,
	clientDeleteContactById,
	clientGetContactById,
	clientUpdateContactById
} from '@/utils/apiCall';
import { useSession } from 'next-auth/react';

const ContactEmailSchema = z.object({
	email: z.string().optional(),
	type: z.string().optional()
});

const ContactPhoneNumberSchema = z.object({
	number: z.string().optional(),
	type: z.string().optional()
});

const schema = z.object({
	image: z.string().optional(),
	background: z.string().optional(),
	name: z.string().min(1, { message: 'Name is required' }),
	emails: z.array(ContactEmailSchema).optional(),
	phones: z.array(ContactPhoneNumberSchema).optional(),
	bank_country: z.string().optional(),
	bank_swift_code: z.string().optional(),
	bank_name: z.string().optional(),
	bank_account_no: z.string().optional(),
	bank_address: z.string().optional(),
	country: z.string().optional(),
	city: z.string().optional(),
	address: z.string().optional(),
	notes: z.string().optional()
});

function ContactForm({ isNew }: { isNew?: boolean }) {
	const {
		data: { accessToken }
	} = useSession();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const routeParams = useParams<{ contactId: string }>();
	const { contactId } = routeParams;
	const [contact, setContact] = useState<ClientContact | null>(null);
	const { control, watch, reset, handleSubmit, formState } = useForm<ClientContact>({
		mode: 'all',
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	const form = watch();
	const [submitting, setSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		if (!isNew && contactId) {
			setIsLoading(true);
			setIsError(false);
			clientGetContactById(contactId, accessToken)
				.then((resp) => {
					if (resp.status === 'success') {
						setContact(resp.data as ClientContact);
					} else {
						setIsError(true);
						dispatch(showMessage({ message: resp.message }));
					}
				})
				.catch((error) => {
					setIsError(true);
					dispatch(showMessage({ message: error.message }));
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [isNew, contactId]);

	useEffect(() => {
		if (isNew) {
			reset(ContactModel({}));
		} else {
			if (contact) {
				reset({
					id: contact.id,
					image: contact.image ?? '',
					background: '',
					name: contact.name ?? '',
					emails: contact?.emails ?? [
						{
							email: '',
							label: ''
						}
					],
					phones: contact?.phones ?? [
						{
							phone_code: '',
							phone_no: '',
							label: ''
						}
					],
					bank_country: contact.bank_country ?? '',
					bank_name: contact.bank_name ?? '',
					bank_swift_code: contact.bank_swift_code ?? '',
					bank_account_no: contact.bank_account_no ?? '',
					bank_address: contact.bank_address ?? '',
					country: contact.country ?? '',
					city: contact.city ?? '',
					address: contact.address ?? '',
					notes: contact.notes ?? ''
				});
			}
		}
	}, [contact, reset, routeParams]);

	const onSubmit = useCallback(() => {
		if (submitting) {
			return;
		}

		setSubmitting(true);

		if (isNew) {
			clientCreateContact(form, accessToken)
				.then((resp) => {
					if (resp.status === 'success') {
						navigate(`/contacts?_=${_.uniqueId()}`);
					} else {
						dispatch(showMessage({ message: resp.message }));
					}
				})
				.catch((error) => {
					dispatch(showMessage({ message: error.message }));
				})
				.finally(() => {
					setSubmitting(false);
				});
		} else {
			clientUpdateContactById(contactId, form, accessToken)
				.then((resp) => {
					if (resp.status === 'success') {
						navigate(`/contacts?_=${_.uniqueId()}`);
					} else {
						dispatch(showMessage({ message: resp.message }));
					}
				})
				.catch((error) => {
					dispatch(showMessage({ message: error.message }));
				})
				.finally(() => {
					setSubmitting(false);
				});
		}
	}, [form]);

	function handleRemoveContact() {
		if (!contact) {
			return;
		}

		clientDeleteContactById(contact.id, accessToken)
			.then((resp) => {
				if (resp.status === 'success') {
					navigate(`/contacts?_=${_.uniqueId()}`);
				} else {
					dispatch(showMessage({ message: resp.message }));
				}
			})
			.catch((error) => {
				dispatch(showMessage({ message: error.message }));
			});
	}

	const background = watch('background');
	const name = watch('name');

	if (isError && !isNew) {
		setTimeout(() => {
			navigate('/contacts');
			dispatch(showMessage({ message: 'NOT FOUND' }));
		}, 0);

		return null;
	}

	if (_.isEmpty(form)) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (isLoading) {
		return <FuseLoading className="min-h-screen" />;
	}

	return (
		<>
			<Box
				className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
				sx={{
					backgroundColor: 'background.default'
				}}
			>
				{background && (
					<img
						className="absolute inset-0 object-cover w-full h-full"
						src={background}
						alt="user background"
					/>
				)}
			</Box>

			<div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
				<div className="w-full">
					<div className="flex flex-auto items-end -mt-64">
						<Controller
							control={control}
							name="image"
							render={({ field: { onChange, value } }) => (
								<Box
									sx={{
										borderWidth: 4,
										borderStyle: 'solid',
										borderColor: 'background.paper'
									}}
									className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden"
								>
									<div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
									<div className="absolute inset-0 flex items-center justify-center z-20">
										<div>
											<label
												htmlFor="button-avatar"
												className="flex p-8 cursor-pointer"
											>
												<input
													accept="image/*"
													className="hidden"
													id="button-avatar"
													type="file"
													onChange={async (e) => {
														function readFileAsync() {
															return new Promise((resolve, reject) => {
																const file = e?.target?.files?.[0];

																if (!file) {
																	return;
																}

																const reader: FileReader = new FileReader();

																reader.onload = () => {
																	if (typeof reader.result === 'string') {
																		resolve(
																			`data:${file.type};base64,${btoa(
																				reader.result
																			)}`
																		);
																	} else {
																		reject(
																			new Error(
																				'File reading did not result in a string.'
																			)
																		);
																	}
																};

																reader.onerror = reject;

																reader.readAsBinaryString(file);
															});
														}

														const newImage = await readFileAsync();

														onChange(newImage);
													}}
												/>
												<FuseSvgIcon className="text-white">
													heroicons-outline:camera
												</FuseSvgIcon>
											</label>
										</div>
										<div>
											<IconButton
												onClick={() => {
													onChange('');
												}}
											>
												<FuseSvgIcon className="text-white">heroicons-solid:trash</FuseSvgIcon>
											</IconButton>
										</div>
									</div>
									<Avatar
										sx={{
											backgroundColor: 'background.default',
											color: 'text.secondary'
										}}
										className="object-cover w-full h-full text-64 font-bold"
										src={value}
										alt={name}
									>
										{name?.charAt(0)}
									</Avatar>
								</Box>
							)}
						/>
					</div>
				</div>

				<div className="w-full flex flex-col items-start justify-between sm:gap-8 sm:flex-row">
					<Controller
						control={control}
						name="name"
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-32"
								label="Contact Name"
								id="name"
								error={!!errors.name}
								helperText={errors?.name?.message}
								variant="outlined"
								required
								fullWidth
							/>
						)}
					/>
				</div>

				<div className="w-full flex flex-col items-start justify-between sm:gap-8 sm:flex-row">
					<Controller
						control={control}
						name="country"
						render={({ field }) => (
							<TextField
								{...field}
								select
								className="mt-32 w-1/2"
								label="Country"
								error={!!errors.country}
								helperText={errors?.country?.message}
								variant="outlined"
								required
								fullWidth
							>
								{CountryCodeList.map((option) => (
									<MenuItem
										key={'country_' + option.code}
										value={option.code}
									>
										{option.name}
									</MenuItem>
								))}
							</TextField>
						)}
					/>

					<Controller
						control={control}
						name="city"
						render={({ field }) => (
							<TextField
								className="mt-32 w-1/2"
								{...field}
								label="City"
								id="bank_account_no"
								error={!!errors.city}
								helperText={errors?.city?.message}
								variant="outlined"
								fullWidth
							/>
						)}
					/>
				</div>

				<Controller
					control={control}
					name="address"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="Address"
							id="address"
							error={!!errors.address}
							helperText={errors?.address?.message}
							variant="outlined"
							multiline
							minRows={2}
							fullWidth
						/>
					)}
				/>

				<div className="w-full flex flex-col items-start justify-between sm:gap-8 sm:flex-row">
					<Controller
						control={control}
						name="bank_country"
						render={({ field }) => (
							<TextField
								{...field}
								select
								className="mt-32 w-1/2"
								label="Bank Country"
								error={!!errors.bank_country}
								helperText={errors?.bank_country?.message}
								variant="outlined"
								required
								fullWidth
							>
								{CountryCodeList.map((option) => (
									<MenuItem
										key={'bank_country_' + option.code}
										value={option.code}
									>
										{option.name}
									</MenuItem>
								))}
							</TextField>
						)}
					/>

					<Controller
						control={control}
						name="bank_swift_code"
						render={({ field }) => (
							<TextField
								className="mt-32 w-1/2"
								{...field}
								label="Bank Swift Code"
								id="bank_swift_code"
								error={!!errors.bank_swift_code}
								helperText={errors?.bank_swift_code?.message}
								variant="outlined"
								fullWidth
							/>
						)}
					/>
				</div>

				<div className="w-full flex flex-col items-start justify-between sm:gap-8 sm:flex-row">
					<Controller
						control={control}
						name="bank_name"
						render={({ field }) => (
							<TextField
								className="mt-32"
								{...field}
								label="Bank Name"
								id="bank_name"
								error={!!errors.bank_name}
								helperText={errors?.bank_name?.message}
								variant="outlined"
								fullWidth
							/>
						)}
					/>

					<Controller
						control={control}
						name="bank_account_no"
						render={({ field }) => (
							<TextField
								className="mt-32"
								{...field}
								label="Bank Account Number"
								id="bank_account_no"
								error={!!errors.bank_account_no}
								helperText={errors?.bank_account_no?.message}
								variant="outlined"
								fullWidth
							/>
						)}
					/>
				</div>

				<Controller
					control={control}
					name="bank_address"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="Bank Address"
							multiline
							minRows={2}
							id="bank_address"
							error={!!errors.bank_address}
							helperText={errors?.bank_address?.message}
							variant="outlined"
							fullWidth
						/>
					)}
				/>

				<Controller
					control={control}
					name="emails"
					render={({ field }) => (
						<ContactEmailSelector
							className="mt-32"
							{...field}
							error={!!errors.emails}
							helperText={errors?.emails?.message}
							value={field?.value}
							onChange={(val) => field.onChange(val)}
						/>
					)}
				/>

				<Controller
					control={control}
					name="phones"
					render={({ field }) => (
						<PhoneNumberSelector
							className="mt-32"
							{...field}
							error={!!errors.phones}
							helperText={errors?.phones?.message}
							value={field.value}
							onChange={(val) => field.onChange(val)}
						/>
					)}
				/>

				<Controller
					control={control}
					name="notes"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="Notes"
							id="notes"
							error={!!errors.notes}
							helperText={errors?.notes?.message}
							variant="outlined"
							fullWidth
							multiline
							minRows={5}
							maxRows={10}
						/>
					)}
				/>
			</div>
			<Box
				className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
				sx={{ backgroundColor: 'background.default' }}
			>
				{!isNew && (
					<Button
						color="error"
						onClick={handleRemoveContact}
					>
						Delete
					</Button>
				)}
				<Button
					component={Link}
					className="ml-auto"
					to={`/contacts`}
				>
					Cancel
				</Button>
				<Button
					className="ml-8"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid || submitting}
					onClick={handleSubmit(onSubmit)}
				>
					{submitting ? 'Saving...' : 'Save'}
				</Button>
			</Box>
		</>
	);
}

export default ContactForm;
