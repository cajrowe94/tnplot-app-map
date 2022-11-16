import mapboxgl from 'mapbox-gl';
import config from '../../config.js';
import { useState, useEffect } from 'react';
import '../../scss/component/Map.scss';
import tnCountiesData from '../../data/TN_counties.js';

mapboxgl.accessToken = config.MAPBOX_ACCESS_TOKEN;

export default function Map() {
	const [map, setMap] = useState();
	const [countyData, setCountyData] = useState();

	useEffect(() => {
		setMap(new mapboxgl.Map({
		    container: 'map-container',
		    style: 'mapbox://styles/calp/cl9z018qc000015nmn81tgxpz',
		    zoom: 7,
		    center: [-86.214326, 35.816163]
		}));
	}, []);

	useEffect(() => {
		if (!map) return;

		map.on('load', () => {
			map.addSource('counties-data', {
				type: 'geojson',
				data: tnCountiesData,
				generateId: true
			});

			map.addLayer({
				id: 'tn-counties',
				source: 'counties-data',
				type: 'fill',
				paint: {
					'fill-opacity': 0.3,
					'fill-color': '#7c7d7e',
					'fill-antialias': true,
					'fill-outline-color': '#000'

				}
			});
		});

		map.on('render', queryCounties);
		getCountyData();
	}, [map]);

	const queryCounties = () => {
		if (!map.getLayer('tn-counties') || !map.loaded()) return;

		let counties = map.queryRenderedFeatures({
			layers: ['tn-counties']
		});

		map.off('render', queryCounties);
	}

	const getCountyData = () => {
		fetch(config.STRAPI_BASE_URL + '/api/counties?populate=*', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + config.STRAPI_API_KEY
			}
		})
		.then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log('Error retrieving data: ', error);
        })
	}

	return (
		<div id="map-container"></div>
	);
}