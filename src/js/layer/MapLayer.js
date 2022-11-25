import { useState } from 'react';
import CountyMap from '../component/CountyMap.js';

export default function MapLayer() {
	return (
		<div className="layer map-layer">
			<CountyMap />
		</div>
	)
}