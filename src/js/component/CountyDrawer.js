import { useState, useEffect } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export default function CountyDrawer() {
	const [drawerOpen, setDrawerOpen] = useState(false);

	return (
		<SwipeableDrawer
			onClose={() => { setDrawerOpen(false) }}
			onOpen={() => { setDrawerOpen(true) }}
			open={drawerOpen}
			hideBackdrop={true}
			swipeAreaWidth={50}
		>
			<IconButton>
				<KeyboardArrowRightIcon />
			</IconButton>
			<div>Test data</div>
		</SwipeableDrawer>
	);
}