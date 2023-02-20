import { useState, useEffect } from 'react';
import Grow from '@mui/material/Grow';
import Button from '@mui/material/Button';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CancelIcon from '@mui/icons-material/Cancel';
import { styled } from '@mui/material/styles';
import UpdatePlotsLayer from '../layer/UpdatePlotsLayer.js';
import '../../scss/component/UpdatePlotsButton.scss';

const CustomButton = styled(Button)({
	fontFamily: [
		'Poppins'
	],
	backgroundColor: '#484e54',
	'&:hover': {
		backgroundColor: '#5d6164'
	}
});

export default function UpdatePlotsButton() {
	const [showUpdatePlotsLayer, setShowUpdatePlotsLayer] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);

	return (
		<>
			<Grow
				in={ showUpdatePlotsLayer }
				unmountOnExit
			>
				<UpdatePlotsLayer disableButton={ setIsDisabled } />
			</Grow>

			<div className="update-plots-button__container">
				<CustomButton
					size="large"
					variant="contained"
					disabled={isDisabled}
					onClick={() => { setShowUpdatePlotsLayer(!showUpdatePlotsLayer) }}
					endIcon={ showUpdatePlotsLayer ? <CancelIcon /> : <FileUploadIcon /> }
				>
					{ showUpdatePlotsLayer ? 'Back to map' : 'Update plot data' }
				</CustomButton>
			</div>
		</>
	);
}