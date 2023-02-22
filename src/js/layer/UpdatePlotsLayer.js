import { useState, forwardRef } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
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
	const [updateData, setUpdateData] = useState([]);

	const { disableButton, ...rest } = props;

	const postFileUpload = () => {
		setIsLoading(true);

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
        	setUpdateData(data);
            setIsLoading(false);
        })
        .catch(error => {
        	console.log(`error: ${error}`);
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

				<div className="update-plots-results">
					{
						updateData.map((result, i) => {
							if (result.error) {
								return (
									<div key={ i } className="update-plots-results__row error">
										<p>{ result.error }</p>
									</div>
								)
							} else if (result.updates && result.updates.plot && result.updates.plot.messages) {
								return (
									<div key={ i } className="update-plots-results__row">
										{
											result.updates.plot.messages.map((message, i) => {
												return (
													<div key={ i } className="update-plots-results__row-message">
														<p>{ message }</p>
													</div>
												)
											})
										}
									</div>
								)
							}

							return ''
						})
					}
				</div>
			</Container>
		</div>
	);
});

export default UpdatePlotsLayer;