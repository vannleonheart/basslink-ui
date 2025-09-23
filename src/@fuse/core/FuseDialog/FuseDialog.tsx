import Dialog from '@mui/material/Dialog';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { closeDialog, selectFuseDialogProps } from '@fuse/core/FuseDialog/fuseDialogSlice';
import React from 'react';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>;
	},
	ref: React.Ref<unknown>
) {
	return (
		<Slide
			direction="up"
			ref={ref}
			{...props}
		/>
	);
});

function FuseDialog() {
	const dispatch = useAppDispatch();
	const options = useAppSelector(selectFuseDialogProps);
	const { disableBackdropClick, ...opts } = options;

	return (
		<Dialog
			onClose={(event, reason) => {
				if (disableBackdropClick && reason === 'backdropClick') {
					return;
				}

				dispatch(closeDialog());
			}}
			TransitionComponent={Transition}
			classes={{
				paper: 'rounded-lg'
			}}
			{...opts}
		/>
	);
}

export default FuseDialog;
