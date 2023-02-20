import CountyMap from '../component/CountyMap.js';
import UpdatePlotsButton from '../component/UpdatePlotsButton.js';

import '../../scss/layer/MapLayer.scss';

export default function MapLayer() {
	return (
		<div className="layer map-layer">
			<CountyMap />
			<UpdatePlotsButton />
		</div>
	)
}