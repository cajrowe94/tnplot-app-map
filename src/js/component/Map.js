import mapboxgl from 'mapbox-gl';
import config from '../../config.js';
import { useState, useEffect } from 'react';
import '../../scss/component/Map.scss';
import tnCountiesData from '../../data/TN_counties.js';

mapboxgl.accessToken = config.MAPBOX_ACCESS_TOKEN;

export default function Map() {
	const [map, setMap] = useState();
	const [countyData, setCountyData] = useState();


	/**
	 * Initialize our mapbox map object
	 */

	useEffect(() => {
		setMap(new mapboxgl.Map({
		    container: 'map-container',
		    style: 'mapbox://styles/calp/cl9z018qc000015nmn81tgxpz',
		    zoom: 7,
		    center: [-86.214326, 35.816163]
		}));

		getCountyStrapiData();
	}, []);


	/**
	 * Add tennessee counties onto map
	 */

	useEffect(() => {
		if (!map) return;

		map.on('load', () => {
			// load county data source
			map.addSource('counties-data', {
				type: 'geojson',
				data: tnCountiesData,
				generateId: true
			});

			// add the data as a new layer
			map.addLayer({
				id: 'tn-counties',
				source: 'counties-data',
				type: 'fill',
				paint: {
					'fill-opacity': 0.6,
					'fill-color': [
						'case',
						['>=', ['feature-state', 'activePlots'], 5],
						'#0a4a1a',
						['>=', ['feature-state', 'activePlots'], 3],
						'#168732',
						['>=', ['feature-state', 'activePlots'], 1],
						'#21ed54',
						'#fa7e02'
					],
					'fill-antialias': true,
					'fill-outline-color': '#000'
				}
			});

			map.addLayer({
				id: 'tn-county-labels',
				source: 'counties-data',
				type: 'symbol',
				layout: {
					'text-field': ['get', 'NAME'],
					'text-justify': 'auto',
				}
			});
		});

		map.on('render', setCountyActivePlotsFeatureState);
	}, [map, countyData]);


	/**
	 * Get all county data from strapi
	 */

	const getCountyStrapiData = () => {
		if (countyData) return countyData;

		fetch(config.STRAPI_BASE_URL + '/api/counties?populate=*', {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + config.STRAPI_API_KEY
			}
		})
		.then(response => response.json())
        .then(data => {
            if (data && data.data && data.data.length) {
            	setCountyData(data.data);
            }
        })
        .catch(error => {
            console.log('Error retrieving data: ', error);
        })
	}


	/**
	 * Set county feature state based on active plots
	 */
	
	const setCountyActivePlotsFeatureState = () => {
		if (!map.getLayer('tn-counties') || !map.loaded() || !countyData) return;

		countyData.forEach(county => {
			let countyName = county.attributes.countyName;
			let countyPlots = county.attributes.plots.data || [];

			let mapboxCountyFeature = map.queryRenderedFeatures({
				layers: ['tn-counties'],
				filter: ['==', ['get', 'NAME'], countyName]
			});

			if (mapboxCountyFeature && mapboxCountyFeature[0]) {
				let activePlots = 0;

				countyPlots.forEach(plot => {
					if (!plot.attributes.plotSurveyDate) {
						activePlots++;
					}
				});

				map.setFeatureState({
					source: 'counties-data',
					id: mapboxCountyFeature[0].id
				}, {
					activePlots: activePlots
				});
			} else {
				console.warn('No county feature found with name: ', countyName);
			}
		});

		map.off('render', setCountyActivePlotsFeatureState);
	}

	return (
		<div id="map-container"></div>
	);
}