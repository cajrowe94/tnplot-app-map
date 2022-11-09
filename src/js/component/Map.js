import mapboxgl from 'mapbox-gl';
import config from '../../config.js';
import { useState, useEffect } from 'react';
import '../../scss/component/Map.scss';

mapboxgl.accessToken = config.MAPBOX_ACCESS_TOKEN;

export default function Map() {
	const [map, setMap] = useState();

	/**
	 * Initialize map
	 */

	useEffect(() => {
		setMap(new mapboxgl.Map({
		    container: 'map-container',
		    style: 'mapbox://styles/calp/cl9z018qc000015nmn81tgxpz',
		    zoom: 7,
		    center: [-86.214326, 35.816163]
		}));
	}, []);


	useEffect(() => {
		if (map) {
			map.on('load', () => {
				console.log(map);
			});
		}
	}, [map]);

	return (
		<div id="map-container"></div>
	);
}