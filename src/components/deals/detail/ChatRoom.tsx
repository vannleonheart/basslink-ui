import Paper from '@mui/material/Paper';
import { useForm } from 'react-hook-form';
import { DealMessage, DealMessageData, Deal } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { Accordion, AccordionDetails, AccordionSummary, Button } from '@mui/material';
import { AttachFile, Delete, ExpandMoreRounded, Send } from '@mui/icons-material';
import TextField from '@mui/material/TextField';
import { agentSendChat, agentUploadFiles, clientSendChat, clientUploadFiles } from '@/utils/apiCall';
import { useSession } from 'next-auth/react';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import _ from 'lodash';
import { DateTime } from 'luxon';
import apiService from '@/store/apiService';

const submitTermsSchema = z.object({
	message: z.string().min(1, 'Message is required')
});

type ChatRoomProps = {
	deal: Deal;
	side: string;
	allowSend?: boolean;
};

export default function ChatRoom({ deal, side, allowSend }: ChatRoomProps) {
	const {
		data: { accessToken }
	} = useSession();
	const container = useRef<HTMLDivElement>(null);
	const { data: messagesData, refetch } = apiService.useGetDealMessagesByDealIdQuery({
		side,
		accessToken,
		id: deal.id
	});
	const messages = useMemo(() => (messagesData ?? []) as DealMessage[], [messagesData]);

	useEffect(() => {
		container.current?.scrollTo({
			top: container.current?.scrollHeight,
			behavior: 'smooth'
		});
	}, [messages]);

	return (
		<Accordion
			style={{
				width: '100%',
				backgroundColor: 'transparent',
				border: 'none',
				borderRadius: '0',
				boxShadow: 'none'
			}}
		>
			<AccordionSummary
				expandIcon={<ExpandMoreRounded />}
				className="px-0"
			>
				<h4 className="text-lg font-semibold text-gray-700">Chat</h4>
			</AccordionSummary>
			<AccordionDetails className="px-0">
				<Paper>
					<div className="flex flex-col h-full">
						<div className="flex flex-col flex-1 p-16">
							<div
								className="max-h-[40vh] flex flex-col gap-8 overflow-y-auto"
								ref={container}
							>
								{messages.map((message, index) => {
									const fromMe =
										(['agent', 'admin'].includes(side) && message.agent_id !== null) ||
										(side === 'client' && message.client_id !== null);
									return fromMe ? (
										<div
											key={message.created + '_' + index}
											className="flex items-center justify-end"
										>
											<div className="flex flex-col items-end justify-center w-2/3 gap-8">
												<div className="flex items-center">
													<div className="text-xs text-gray-500 ml-8">
														{DateTime.fromSeconds(message.created).toFormat('ff')}
													</div>
												</div>
												<div className="bg-blue-500 text-white rounded-lg rounded-br-0 p-12 shadow">
													<div>{message.message_data.message}</div>
												</div>
												{message.message_data.files?.map((file, index) => (
													<div
														key={index}
														className="flex items-center gap-12 text-sm border border-gray-500 p-8 rounded-lg"
													>
														<div className="flex justify-between gap-8">
															<div className="w-8 h-8 flex items-center justify-center">
																<AttachFile fontSize="small" />
															</div>
															<a
																href={
																	'https://basslink.sgp1.cdn.digitaloceanspaces.com/' +
																	file
																}
																target="_blank"
																rel="noreferrer"
																className="text-blue-500 bg-transparent no-underline"
															>
																{file.length > 20
																	? file.slice(0, 10) + '...' + file.slice(-10)
																	: file}
															</a>
														</div>
													</div>
												))}
											</div>
										</div>
									) : (
										<div
											key={message.created + '_' + index}
											className="flex items-center"
										>
											<div className="flex flex-col items-start justify-center w-2/3 gap-8">
												<div className="flex items-center">
													<div className="text-sm font-medium">
														{['agent', 'admin'].includes(side)
															? message?.client?.name
															: side === 'client'
																? message?.agent?.name
																: ''}
													</div>
													<div className="text-xs text-gray-500 ml-8">
														{DateTime.fromSeconds(message.created).toFormat('ff')}
													</div>
												</div>
												<div className="bg-gray-200 rounded-lg rounded-bl-0 p-12 shadow">
													<div>{message.message_data.message}</div>
												</div>
												{message.message_data.files?.map((file, index) => (
													<div
														key={index}
														className="flex items-center gap-12 text-sm border border-gray-500 p-8 rounded-lg"
													>
														<div className="flex justify-between gap-8">
															<div className="w-8 h-8 flex items-center justify-center">
																<AttachFile fontSize="small" />
															</div>
															<a
																href={
																	'https://basslink.sgp1.cdn.digitaloceanspaces.com/' +
																	file
																}
																target="_blank"
																rel="noreferrer"
																className="text-blue-500 bg-transparent no-underline"
															>
																{file.length > 20
																	? file.slice(0, 10) + '...' + file.slice(-10)
																	: file}
															</a>
														</div>
													</div>
												))}
											</div>
										</div>
									);
								})}
							</div>
						</div>
						{allowSend && (
							<ChatInput
								deal={deal}
								fetch={refetch}
								side={side}
							/>
						)}
					</div>
				</Paper>
			</AccordionDetails>
		</Accordion>
	);
}

function ChatInput({ deal, fetch, side }: { deal: Deal; fetch: () => void; side: string }) {
	const { data } = useSession();
	const { accessToken } = data;
	const dispatch = useAppDispatch();
	const { watch, handleSubmit, formState, getValues, setValue, register, reset } = useForm<DealMessageData>({
		mode: 'all',
		resolver: zodResolver(submitTermsSchema),
		defaultValues: {
			message: '',
			files: []
		}
	});
	const form = watch();
	const { isValid, dirtyFields } = formState;
	const [submitting, setSubmitting] = useState(false);
	const [uploading, setUploading] = useState(false);
	const uploadInputRef = useRef<HTMLInputElement>(null);

	const handleAttachFiles = async (e: ChangeEvent<HTMLInputElement>) => {
		function readFileAsync() {
			return new Promise<void>((resolve, reject) => {
				const files = e?.target?.files;

				if (!files || !files.length) {
					return resolve();
				}

				if (side === 'agent') {
					agentUploadFiles(Array.from(files), accessToken)
						.then((result) => {
							if (result.status === 'success') {
								const prevFiles = getValues('files');
								const uploadedFiles = result?.data as {
									files: string[];
								};
								const newFiles = [...prevFiles, ...uploadedFiles.files];

								setValue('files', newFiles);

								return resolve();
							} else {
								return reject(result.message);
							}
						})
						.finally(() => {
							setUploading(false);
						});
				}

				if (side === 'client') {
					clientUploadFiles(Array.from(files), accessToken)
						.then((result) => {
							if (result.status === 'success') {
								const prevFiles = getValues('files');
								const uploadedFiles = result?.data as {
									files: string[];
								};
								const newFiles = [...prevFiles, ...uploadedFiles.files];

								setValue('files', newFiles);

								return resolve();
							} else {
								return reject(result.message);
							}
						})
						.finally(() => {
							setUploading(false);
						});
				}
			});
		}

		try {
			await readFileAsync();
		} catch (error) {
			dispatch(showMessage({ message: error?.message ?? 'Failed to upload files', variant: 'error' }));
		}
	};

	const handleRemoveFile = (index: number) => {
		const files = getValues('files');
		const newFiles = files.filter((_, i) => i !== index);

		setValue('files', newFiles);
	};

	const handleSendMessage = async () => {
		if (submitting) {
			return;
		}

		setSubmitting(true);

		if (side === 'agent') {
			agentSendChat(deal.id, form, accessToken)
				.then((result) => {
					if (result.status === 'success') {
						dispatch(showMessage({ message: 'Message sent successfully', variant: 'success' }));
						fetch();
						reset({
							message: '',
							files: []
						});
					} else {
						dispatch(showMessage({ message: result.message, variant: 'error' }));
					}
				})
				.catch((error) => {
					dispatch(showMessage({ message: error?.message ?? 'Failed to send message', variant: 'error' }));
				})
				.finally(() => {
					setSubmitting(false);
				});
		}

		if (side === 'client') {
			clientSendChat(deal.id, form, accessToken)
				.then((result) => {
					if (result.status === 'success') {
						dispatch(showMessage({ message: 'Message sent successfully', variant: 'success' }));
						fetch();
						reset({
							message: '',
							files: []
						});
					} else {
						dispatch(showMessage({ message: result.message, variant: 'error' }));
					}
				})
				.catch((error) => {
					dispatch(showMessage({ message: error?.message ?? 'Failed to send message', variant: 'error' }));
				})
				.finally(() => {
					setSubmitting(false);
				});
		}
	};

	return (
		<div className="flex items-center justify-between p-16 gap-12">
			<div className="w-full flex flex-col items-start justify-start gap-8">
				<TextField
					placeholder="Type your message here..."
					multiline
					rows={4}
					fullWidth
					{...register('message')}
				></TextField>
				<div className="flex gap-8">
					{form.files.map((file, index) => (
						<div
							key={index}
							className="flex items-center gap-12 text-sm border border-gray-500 p-8 rounded-lg"
						>
							<div>{file.length > 20 ? file.slice(0, 10) + '...' + file.slice(-10) : file}</div>
							<div className="w-8 h-8 bg-gray-200 flex items-center justify-center rounded-lg cursor-pointer">
								<Delete
									className="hover:text-red-500"
									fontSize="small"
									onClick={() => handleRemoveFile(index)}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="w-1/12 flex flex-col items-center justify-between gap-8">
				<Button
					variant="contained"
					color="primary"
					fullWidth
					startIcon={<Send />}
					onClick={handleSubmit(handleSendMessage)}
					disabled={_.isEmpty(dirtyFields) || !isValid || submitting || uploading}
				>
					Send
				</Button>
				<Button
					variant="contained"
					fullWidth
					startIcon={<AttachFile />}
					onClick={() => uploadInputRef.current?.click()}
				>
					Attach
				</Button>
				<input
					ref={uploadInputRef}
					onChange={handleAttachFiles}
					type="file"
					accept="image/*,.pdf,.docx,.xlsx,.csv"
					multiple
					hidden
				/>
			</div>
		</div>
	);
}
