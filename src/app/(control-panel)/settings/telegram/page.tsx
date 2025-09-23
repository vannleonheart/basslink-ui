'use client';

import { useSession } from 'next-auth/react';
import { TelegramConnect } from '@/types';
import List from '@mui/material/List';
import { Button, ListItem } from '@mui/material';
import CopyButton from '@/components/commons/CopyButton';
import { agentGetTelegramConnects, clientGetTelegramConnects, disconnectTelegram } from '@/utils/apiCall';
import { useEffect, useState } from 'react';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import DialogConfirm from '@/components/dialogs/DialogConfirm';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useDispatch } from 'react-redux';
import Divider from '@mui/material/Divider';
import { DeleteRounded } from '@mui/icons-material';
import useUser from '@auth/useUser';

export default function TelegramSettingsPage() {
	const dispatch = useDispatch();
	const {
		data: { accessToken }
	} = useSession();
	const { data: user, side } = useUser();
	const [telegramConnects, setTelegramConnects] = useState<TelegramConnect[]>([]);

	const fetchTelegramConnects = () => {
		setTelegramConnects([]);

		if (side === 'agent') {
			agentGetTelegramConnects(accessToken).then((resp) => {
				if (resp.status == 'success') {
					const data = (resp.data ?? []) as TelegramConnect[];
					setTelegramConnects(data);
				}
			});
		} else {
			clientGetTelegramConnects(accessToken).then((resp) => {
				if (resp.status == 'success') {
					const data = (resp.data ?? []) as TelegramConnect[];
					setTelegramConnects(data);
				}
			});
		}
	};

	useEffect(() => {
		fetchTelegramConnects();
	}, []);

	const deleteConnection = (chatId: string) => {
		dispatch(
			openDialog({
				fullWidth: false,
				children: (
					<DialogConfirm
						message="Are you sure want to remove this connection ?"
						onConfirm={() => {
							disconnectTelegram(chatId, accessToken)
								.then((response) => {
									if (response.status === 'success') {
										dispatch(
											showMessage({ message: 'Connection was removed', variant: 'success' })
										);
										fetchTelegramConnects();
									} else {
										dispatch(
											showMessage({
												message: response?.message ?? 'Failed to remove connection',
												variant: 'error'
											})
										);
									}
								})
								.catch((err) =>
									dispatch(
										showMessage({
											message: err?.message ?? 'Failed to remove connection',
											variant: 'error'
										})
									)
								);
						}}
					/>
				)
			})
		);
	};

	return (
		<div>
			<p>Please follow the instructions below to set up Telegram notifications.</p>
			<List>
				<ListItem>
					1. Open Telegram and search for user
					<div className="flex gap-8 ml-6 px-6 py-3 pr-3 border border-gray-500 rounded font-bold bg-white">
						<span>@BRICSLinkIO_Bot</span>
						<CopyButton value="@BRICSLinkIO_Bot" />
					</div>
				</ListItem>
				<ListItem>2. Start a chat with the bot or invite it to a group.</ListItem>
				<ListItem>
					3. Type <strong className="mx-3 px-6 py-3 border border-gray-500 rounded bg-white">/start</strong>
					to start the bot.
				</ListItem>
				<ListItem>
					4. Type <strong className="mx-3 px-6 py-3 border border-gray-500 rounded bg-white">/connect</strong>
					to ask the bot to connect to your account.
				</ListItem>
				<ListItem>5. The bot will ask you to enter the token.</ListItem>
				<ListItem>
					6. Your token is:
					<div className="flex gap-8 ml-6 px-6 py-3 pr-3 border border-gray-500 rounded font-bold bg-white">
						<span>{user?.company?.token}</span>
						<CopyButton value={user?.company?.token} />
					</div>
				</ListItem>
				<ListItem>
					7. You will receive a message from the bot confirming the connection. You can now receive
					notifications.
				</ListItem>
				<ListItem>
					8. To disconnect your account, type
					<strong className="mx-3 px-6 py-3 border border-gray-500 rounded bg-white">/disconnect</strong> and
					enter the token again.
				</ListItem>
			</List>
			<Divider />
			<div className="mt-12">
				<h4 className="font-bold">Connected Accounts</h4>
				<List>
					{telegramConnects && telegramConnects.length > 0 ? (
						<>
							<ListItem>
								<div className="w-full flex items-center justify-between gap-8 font-bold">
									<div className="w-1/4">Name</div>
									<div className="w-1/4">Username</div>
									<div className="w-1/4 text-center">Type</div>
									<div className="w-1/4"></div>
								</div>
							</ListItem>
							{telegramConnects.map((connect) => (
								<ListItem
									key={connect.chat_id}
									className="shadow-2"
								>
									<div className="w-full flex items-center justify-between gap-8">
										<div className="w-1/4">
											{connect.first_name} {connect?.last_name}
										</div>
										<div className="w-1/4">@{connect.username}</div>
										<div className="w-1/4 text-center">
											<span className="capitalize bg-white px-6 py-3 rounded font-bold text-sm">
												{connect.chat_type}
											</span>
										</div>
										<div className="w-1/4 text-right">
											<Button
												size="small"
												variant="text"
												color="error"
												onClick={() => deleteConnection(connect.chat_id)}
											>
												<DeleteRounded fontSize="small" />
											</Button>
										</div>
									</div>
								</ListItem>
							))}
						</>
					) : (
						<ListItem>
							<div className="w-full flex items-start justify-start">No connected accounts</div>
						</ListItem>
					)}
				</List>
			</div>
		</div>
	);
}
