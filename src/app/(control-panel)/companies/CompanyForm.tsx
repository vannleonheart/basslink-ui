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
import { useAppDispatch } from 'src/store/hooks';
import useNavigate from '@fuse/hooks/useNavigate';
import CompanyModel from './CompanyModel';
import {
	agentCreateCompany,
	agentDeleteCompanyById,
	agentGetCompanyById,
	agentUpdateCompanyById
} from '@/utils/apiCall';
import { useSession } from 'next-auth/react';
import { CountryCodeList } from '@/data/country-code';
import MenuItem from '@mui/material/MenuItem';
import CompanyAccountSelector from './CompanyAccountSelector';
import { AgentCompany } from '@/types';

const schema = z.object({
	name: z
		.string()
		.min(1, { message: 'Name is required' })
		.max(150, { message: 'Name must be less than 150 characters' }),
	country: z
		.string()
		.min(1, 'You must select your country')
		.max(50, { message: 'Country must be less than 50 characters' }),
	city: z.string().min(1, 'City is required').max(50, { message: 'City must be less than 50 characters' }),
	address: z.string().min(1, 'Address is required').max(255, { message: 'Address must be less than 255 characters' })
});

type CompanyFormProps = {
	isNew?: boolean;
};

function CompanyForm(props: CompanyFormProps) {
	const {
		data: { accessToken }
	} = useSession();
	const { isNew } = props;
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const routeParams = useParams<{ companyId: string }>();
	const { companyId } = routeParams;
	const [company, setCompany] = useState<AgentCompany | null>(null);
	const { control, watch, reset, handleSubmit, formState } = useForm<AgentCompany>({
		mode: 'all',
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;
	const form = watch();
	const [submitting, setSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		if (!isNew && companyId) {
			setIsLoading(true);
			setIsError(false);
			agentGetCompanyById(companyId, accessToken)
				.then((resp) => {
					if (resp.status === 'success') {
						const company = resp.data as AgentCompany;
						setCompany(company);
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
	}, []);

	useEffect(() => {
		if (isNew) {
			reset(CompanyModel({}));
		} else {
			if (company) {
				reset({
					name: company.name,
					country: company.country,
					city: company.country,
					address: company.address,
					accounts: company?.accounts ?? []
				});
			}
		}
	}, [company, reset, routeParams]);

	const onSubmit = () => {
		if (submitting) {
			return;
		}

		setSubmitting(true);

		if (isNew) {
			agentCreateCompany(form, accessToken)
				.then((resp) => {
					if (resp.status === 'success') {
						navigate(`/companies?_=${_.uniqueId()}`);
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
			agentUpdateCompanyById(companyId, form, accessToken)
				.then((resp) => {
					if (resp.status === 'success') {
						navigate(`/companies?_=${_.uniqueId()}`);
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
	};

	function handleRemoveCompany() {
		if (!company) {
			return;
		}

		agentDeleteCompanyById(company.id, accessToken)
			.then((resp) => {
				if (resp.status === 'success') {
					navigate(`/companies?_=${_.uniqueId()}`);
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
			navigate('/companies');
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
				<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<TextField
							{...field}
							size="medium"
							className="mt-32"
							label="Name"
							placeholder=""
							id="name"
							error={!!errors.name}
							helperText={errors?.name?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>
				<div className="mt-20 w-full flex flex-col items-start justify-between sm:gap-8 sm:flex-row">
					<Controller
						control={control}
						name="country"
						render={({ field }) => (
							<TextField
								{...field}
								select
								label="Country"
								error={!!errors.country}
								helperText={errors?.country?.message}
								variant="outlined"
								required
								id="country"
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
								{...field}
								label="City"
								placeholder=""
								id="city"
								error={!!errors.city}
								helperText={errors?.city?.message}
								variant="outlined"
								required
								fullWidth
							/>
						)}
					/>
				</div>
				<Controller
					name="address"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mt-20"
							label="Address"
							type="address"
							multiline
							rows={3}
							error={!!errors.address}
							helperText={errors?.address?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>
				<Controller
					name="accounts"
					control={control}
					render={({ field }) => (
						<CompanyAccountSelector
							className="mt-20"
							{...field}
							value={field?.value}
							onChange={(val) => {
								field.onChange(val);
							}}
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
						onClick={handleRemoveCompany}
					>
						Delete
					</Button>
				)}
				<Button
					component={Link}
					className="ml-auto"
					to={`/companies`}
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

export default CompanyForm;
