import mapboxgl from 'mapbox-gl';
import { useState, useEffect } from 'react';
import '../../scss/component/CountyMap.scss';
import tnCountiesData from '../../data/TN_counties.js';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

export default function CountyMap() {
	const [map, setMap] = useState();
	const [countyDataMap, setCountyDataMap] = useState();
	const [isFetchingData, setIsFetchingData] = useState(false);


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

		fetchCountyData();
	}, []);


	/**
	 * Add tennessee counties onto map
	 */

	useEffect(() => {
		if (!map) return;

		map.on('load', () => {

			// load county data source
			if (!map.getSource('counties-data')) {
				map.addSource('counties-data', {
					type: 'geojson',
					data: tnCountiesData,
					generateId: true
				});
			}

			// add county lines layer
			if (!map.getLayer('tn-counties')) {
				map.addLayer({
					id: 'tn-counties',
					source: 'counties-data',
					type: 'fill',
					paint: {
						'fill-opacity': 0.8,
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
			}

			// add county name labels layer
			if (!map.getLayer('tn-county-labels')) {
				map.addLayer({
					id: 'tn-county-labels',
					source: 'counties-data',
					type: 'symbol',
					layout: {
						'text-field': ['get', 'NAME'],
						'text-justify': 'auto',
						'text-font': ['Raleway SemiBold'],
						'text-size': 13
					},
					paint: {
						'text-color': '#2b2b2b',
						'text-halo-color': '#ffffff',
						'text-halo-width': 1,
						'text-halo-blur': 1
					}
				});
			}
		});

		map.on('render', setCountyActivePlotsFeatureState);
		createCountyMapboxPopup();
	}, [map, countyDataMap]);


	/**
	 * Get all county data from strapi
	 */

	const fetchCountyData = () => {
		if (countyDataMap || isFetchingData) return;

		setIsFetchingData(true);

		fetch(`${process.env.REACT_APP_API_BASE_URL}/api/counties`, {
			method: 'GET',
			headers: {
				'api_key': process.env.REACT_APP_TNMAP_API_KEY
			}
		})
		.then(response => response.json())
        .then(data => {
            if (data && data.results && data.results.length) {
            	// create a map to use for faster lookups
            	const mapObject = new Map();

				for (let countyObject of data.results) {
					mapObject.set(countyObject.county_name.toLowerCase().replace(' ', '_'), countyObject);
				}

            	setCountyDataMap(mapObject);
            }

            setIsFetchingData(false);
        })
        .catch(error => {
            setIsFetchingData(false);
        })
	}


	/**
	 * Create popup for county hover
	 */

	const createCountyMapboxPopup = () => {
		if (!map) return;

		const popup = new mapboxgl.Popup({
			closeButton: false,
			closeOnClick: false
		});

		map.on('mousemove', 'tn-counties', (e) => {
			let countyName = e.features[0].properties.NAME;
			let mouseLonLat = e.lngLat.wrap();

			map.getCanvas().style.cursor = 'pointer';

			let popupHtml = getHtmlForCountyPopup(countyName);

			// create and add popup to map
			popup.setLngLat(mouseLonLat).setHTML(popupHtml).addTo(map);
		});

		map.on('mouseleave', 'tn-counties', () => {
			map.getCanvas().style.cursor = '';
			popup.remove();
		});
	}


	/**
	 * Create and return html for county mapbox popup
	 * Must send a county name
	 */
	
	const getHtmlForCountyPopup = (countyName) => {
		if (!countyName || !countyDataMap) return;

		let activePlots = getActivePlotsInCounty(countyName);

		let popupHtml = `
			<div class="county-popup">
				<div class="county-popup__name">${countyName} county</div>
				<div class="county-popup__plots">
					Plots left: ${activePlots}
				</div>
			</div>
		`;

		return popupHtml;
	}


	/**
	 * Returns active plots for county
	 */

	const getActivePlotsInCounty = (countyName) => {
		if (!countyName || !countyDataMap) return;

		let county = countyDataMap.get(countyName.toLowerCase().replace(' ', '_'));
		let activePlots = 0;

		if (county && county.plots) {
			county.plots.forEach(plot => {
				if (!plot.plot_survey_date) {
					activePlots++;
				}
			});
		}

		return activePlots;
	}


	/**
	 * Set county feature state based on active plots
	 */
	
	const setCountyActivePlotsFeatureState = () => {
		if (!map.getLayer('tn-counties') || !map.loaded() || !countyDataMap) return;

		countyDataMap.forEach(county => {
			let countyName = county.county_name;
			let countyPlots = county.plots || [];
			
			let mapboxCountyFeature = map.querySourceFeatures(
				'counties-data',
				{
					filter: ['==', ['get', 'NAME'], countyName]
				}
			);

			if (mapboxCountyFeature && mapboxCountyFeature[0]) {
				let activePlots = 0;

				countyPlots.forEach(plot => {
					if (!plot.plot_survey_date) {
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
		<>
			<div id="map-container"></div>
		</>
	);
}