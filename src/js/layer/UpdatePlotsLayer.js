import { useState, useEffect, forwardRef } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';
import '../../scss/layer/UpdatePlotsLayer.scss';

const CustomTypography = styled(Typography)({
	fontFamily: [
		'Poppins'
	],
	color: '#484848'
});

const UpdatePlotsLayer = forwardRef((props, ref) => {
	const [isLoading, setIsLoading] = useState(false);
	const [submitDisabled, setSubmitDisabled] = useState(true);
	const { disableButton, ...rest } = props;

	const postFileUpload = () => {
		setIsLoading(true);

		let fileUploadInput = document.getElementById('xlsx-file-input');

		let formData = new FormData(document.getElementById('update-form'));       

		fetch(`${process.env.REACT_APP_API_BASE_URL}/api/update-plot-rows`, {
			method: 'POST',
			headers: {
				'api_key': process.env.REACT_APP_TNMAP_API_KEY
			},
			body: formData
		})
		.then(response => response.json())
        .then(data => {
        	console.log(data);
            setIsLoading(false);
        })
        .catch(error => {
            setIsLoading(false);
        })
	}

	const handleChange = (e) => {
		if (e.target.value) {
			setSubmitDisabled(false);
		} else {
			setSubmitDisabled(true);
		}
	}

	return (
		<div
			{ ...rest }
			ref={ ref }
			className="layer update-plots-layer"
		>
			<Container
				maxWidth="md"
			>
				<CustomTypography variant="h4">Update Plot Data</CustomTypography>
				<CustomTypography variant="subtitle1">.xlsx file only</CustomTypography>

				<div className="update-plots-form">
					<form
						id="update-form"
						method="post"
						encType="multipart/form-data"
					>
						<input
							required
							disabled={ isLoading }
							type="file"
							name="xlsx-file"
							id="xlsx-file-input"
							onChange={ handleChange }
						/>
						
						<div style={{ marginTop: '20px' }}>
							<LoadingButton
								variant="contained"
								size="small"
								loading={ isLoading }
								disabled={ submitDisabled }
								onClick={ postFileUpload }
							>
								Submit
							</LoadingButton>
						</div>
					</form>
				</div>
			</Container>
		</div>
	);
});

export default UpdatePlotsLayer;