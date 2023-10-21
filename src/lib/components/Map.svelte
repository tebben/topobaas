<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { app } from '$lib/app';

	import 'maplibre-gl/dist/maplibre-gl.css';
	import maplibregl from 'maplibre-gl';
	import * as pmtiles from 'pmtiles';

	let protocol = new pmtiles.Protocol();
	maplibregl.addProtocol('pmtiles', protocol.tile);

	onMount(() => {
		createMap();
	});

	function createMap() {
		const map = new maplibregl.Map({
			container: 'map',
			hash: true,
			maxPitch: 0,
			bearing: 0,
			dragRotate: false,
			style: {
				version: 8,
				glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
				sources: {
					overture: {
						type: 'vector',
						url: 'pmtiles://https://storage.googleapis.com/ahp-research/overture/pmtiles/overture.pmtiles',
						attribution: '© OpenStreetMap contributors, Overture Maps Foundation, Barry'
					},
					daylight: {
						type: 'vector',
						url: 'pmtiles://https://storage.googleapis.com/ahp-research/overture/pmtiles/daylight.pmtiles'
					},
					topobaasPlaces: {
						type: 'geojson',
						data: {
							type: 'FeatureCollection',
							features: []
						}
					},
					topobaasClickedLocations: {
						type: 'geojson',
						data: {
							type: 'FeatureCollection',
							features: []
						}
					},
					topobaasClickedToPlaceLines: {
						type: 'geojson',
						data: {
							type: 'FeatureCollection',
							features: []
						}
					}
				},
				layers: [
					{
						id: 'admins',
						type: 'fill',
						source: 'overture',
						'source-layer': 'admins',
						paint: {
							'fill-color': '#35363a'
						}
					},

					{
						id: 'land',
						type: 'fill',
						source: 'daylight',
						'source-layer': 'land',
						filter: [
							'all',
							[
								'any',
								['==', ['geometry-type'], 'Polygon'],
								['==', ['geometry-type'], 'MultiPolygon']
							],
							['!=', ['get', 'class'], 'land']
						],
						paint: {
							'fill-color': [
								'case',
								['==', ['get', 'class'], 'forest'],
								'#1C2C23',
								['==', ['get', 'class'], 'glacier'],
								'#99CCFF ',
								['==', ['get', 'class'], 'grass'],
								'#264032',
								['==', ['get', 'class'], 'physical'],
								'#555555',
								['==', ['get', 'class'], 'reef'],
								'#FFCC99',
								['==', ['get', 'class'], 'sand'],
								'#322921',
								['==', ['get', 'class'], 'scrub'],
								'#2D241D',
								['==', ['get', 'class'], 'tree'],
								'#228B22',
								['==', ['get', 'class'], 'wetland'],
								'#1C2C23',
								['==', ['get', 'class'], 'land'],
								'#171717',
								'red'
							]
						}
					},
					{
						id: 'landuse',
						type: 'fill',
						source: 'daylight',
						'source-layer': 'landuse',
						filter: [
							'all',
							[
								'any',
								['==', ['geometry-type'], 'Polygon'],
								['==', ['geometry-type'], 'MultiPolygon']
							]
						],
						paint: {
							'fill-color': [
								'case',
								['==', ['get', 'class'], 'park'],
								'#264032',
								['==', ['get', 'class'], 'protected'],
								'#1C2C23',
								['==', ['get', 'class'], 'horticulture'],
								'#1C2C23',
								['==', ['get', 'class'], 'recreation'],
								'#454545',
								['==', ['get', 'class'], 'agriculture'],
								'#32322D',
								['==', ['get', 'class'], 'golf'],
								'#264032',
								'#292929'
							]
						}
					},
					{
						id: 'water-polygon',
						type: 'fill',
						source: 'daylight',
						'source-layer': 'water',
						filter: [
							'all',
							[
								'any',
								['==', ['geometry-type'], 'Polygon'],
								['==', ['geometry-type'], 'MultiPolygon']
							]
						],
						paint: {
							'fill-color': '#263138 ',
							'fill-opacity': 1
						}
					},
					{
						id: 'water-line',
						type: 'line',
						source: 'daylight',
						'source-layer': 'water',
						filter: [
							'any',
							['==', ['geometry-type'], 'LineString'],
							['==', ['geometry-type'], 'MultiLineString']
						],
						paint: {
							'line-color': '#263138',
							'line-width': 3
						}
					},
					{
						id: 'admins-outline',
						type: 'line',
						source: 'overture',
						'source-layer': 'admins',
						paint: {
							'line-color': '#6a6a6a',
							'line-width': 0.5
						}
					},
					{
						id: 'roads',
						type: 'line',
						source: 'overture',
						'source-layer': 'roads',
						filter: [
							'any',
							['==', ['get', 'class'], 'parkingAisle'],
							['==', ['get', 'class'], 'driveway'],
							['==', ['get', 'class'], 'unknown']
						],
						paint: {
							'line-color': [
								'case',

								['==', ['get', 'class'], 'parkingAisle'],
								'#323232',
								['==', ['get', 'class'], 'driveway'],
								'#1C1C1C',
								['==', ['get', 'class'], 'unknown'],
								'#1C1C1C',
								'#5A5A5A'
							],
							'line-width': [
								'interpolate',
								['exponential', 2],
								['zoom'],
								8,
								['*', 2, ['^', 2, -3]],
								21,
								['*', 2, ['^', 2, 5]]
							]
						},
						layout: {
							'line-cap': 'round'
						}
					},
					{
						id: 'roads-motorway',
						type: 'line',
						source: 'overture',
						'source-layer': 'roads',
						filter: ['any', ['==', ['get', 'class'], 'motorway']],
						minzoom: 8.8,
						paint: {
							'line-color': '#717171',
							'line-width': [
								'interpolate',
								['exponential', 2],
								['zoom'],
								3,
								['*', 6, ['^', 2, -2]],
								21,
								['*', 6, ['^', 2, 6]]
							]
						},
						layout: {
							'line-cap': 'round'
						}
					},
					{
						id: 'roads-primary',
						type: 'line',
						source: 'overture',
						'source-layer': 'roads',
						filter: ['any', ['==', ['get', 'class'], 'primary']],
						paint: {
							'line-color': '#717171',
							'line-width': [
								'interpolate',
								['exponential', 2],
								['zoom'],
								3,
								['*', 4, ['^', 2, -2]],
								21,
								['*', 4, ['^', 2, 6]]
							]
						},
						layout: {
							'line-cap': 'round'
						}
					},
					{
						id: 'roads-secondary',
						type: 'line',
						source: 'overture',
						'source-layer': 'roads',
						filter: ['any', ['==', ['get', 'class'], 'secondary']],
						paint: {
							'line-color': '#717171',
							'line-width': [
								'interpolate',
								['exponential', 2],
								['zoom'],
								3,
								['*', 4, ['^', 2, -2]],
								21,
								['*', 4, ['^', 2, 5]]
							]
						},
						layout: {
							'line-cap': 'round'
						}
					},
					{
						id: 'roads-tertiary',
						type: 'line',
						source: 'overture',
						'source-layer': 'roads',
						filter: ['any', ['==', ['get', 'class'], 'tertiary']],
						paint: {
							'line-color': '#717171',
							'line-width': [
								'interpolate',
								['exponential', 2],
								['zoom'],
								8,
								['*', 3, ['^', 2, -3]],
								21,
								['*', 3, ['^', 2, 6]]
							]
						},
						layout: {
							'line-cap': 'round'
						}
					},
					{
						id: 'roads-cyleway',
						type: 'line',
						source: 'overture',
						'source-layer': 'roads',
						filter: ['all', ['==', ['get', 'class'], 'cycleway']],
						paint: {
							'line-color': '#4D3012',
							'line-width': [
								'interpolate',
								['exponential', 2],
								['zoom'],
								8,
								['*', 2, ['^', 2, -4]],
								21,
								['*', 2, ['^', 2, 5]]
							]
						},
						layout: {
							'line-cap': 'round'
						}
					},
					{
						id: 'roads-pedestrian',
						type: 'line',
						source: 'overture',
						'source-layer': 'roads',
						filter: [
							'any',
							['==', ['get', 'class'], 'pedestrian'],
							['==', ['get', 'class'], 'footway'],
							['==', ['get', 'class'], 'track']
						],
						paint: {
							'line-dasharray': [2, 2],
							'line-color': '#464646',
							'line-width': [
								'interpolate',
								['exponential', 2],
								['zoom'],
								8,
								['*', 3, ['^', 2, -2]],
								21,
								['*', 3, ['^', 2, 3]]
							]
						},
						layout: {
							'line-cap': 'round'
						}
					},
					{
						id: 'roads-residential',
						type: 'line',
						source: 'overture',
						'source-layer': 'roads',
						filter: [
							'any',
							['==', ['get', 'class'], 'residential'],
							['==', ['get', 'class'], 'livingStreet'],
							['==', ['get', 'class'], 'unclassified']
						],
						paint: {
							'line-color': '#535353',
							'line-width': [
								'interpolate',
								['exponential', 2],
								['zoom'],
								8,
								['*', 2, ['^', 2, -3]],
								21,
								['*', 2, ['^', 2, 6]]
							]
						},
						layout: {
							'line-cap': 'round'
						}
					},
					/* {
						id: 'roads-labels',
						type: 'symbol',
						source: 'overture',
						'source-layer': 'roads',
						minzoom: 12,
						layout: {
							'icon-allow-overlap': false,
							'text-allow-overlap': false,
							'symbol-placement': 'line',
							'text-field': ['get', 'roadName'],
							'text-radial-offset': 0.5,
							'text-size': 11
						},
						paint: {
							'text-color': '#E2E2E2',
							'text-halo-color': '#000',
							'text-halo-width': 2,
							'text-halo-blur': 1
						}
					},*/
					{
						id: 'buldings-extruded',
						type: 'fill-extrusion',
						source: 'overture',
						'source-layer': 'buildings',
						minzoom: 14,
						paint: {
							'fill-extrusion-color': '#222222',
							'fill-extrusion-vertical-gradient': true,
							'fill-extrusion-height': [
								'case',
								['==', ['get', 'height'], -1],
								0,
								['get', 'height']
							],
							'fill-extrusion-base': 0,
							'fill-extrusion-opacity': 1
						}
					},
					{
						id: 'buldings-lines',
						type: 'line',
						source: 'overture',
						'source-layer': 'buildings',
						minzoom: 16,
						paint: {
							'line-color': '#323232'
						}
					},

					/* 
					{
						id: 'urban-labels',
						type: 'symbol',
						source: 'daylight',
						'source-layer': 'placename',
						minzoom: 2,
						maxzoom: 14,
						filter: [
							'any',
							['==', ['get', 'subclass'], 'city'],
							['==', ['get', 'subclass'], 'municipality'],
							['==', ['get', 'subclass'], 'metropolis'],
							['==', ['get', 'subclass'], 'megacity']
						],
						layout: {
							'text-ignore-placement': true,
							'text-allow-overlap': false,
							'icon-allow-overlap': false,
							'symbol-placement': 'point',
							'text-field': ['get', 'name'],
							'text-size': 16
						},
						paint: {
							'text-color': 'white',
							'text-halo-color': 'black',
							'text-halo-width': 3,
							'text-halo-blur': 2
						}
					},
					{
						id: 'settlement-labels',
						type: 'symbol',
						source: 'daylight',
						'source-layer': 'placename',
						minzoom: 11,
						maxzoom: 21,
						filter: [
							'any',
							['==', ['get', 'subclass'], 'town'],
							['==', ['get', 'subclass'], 'vilage'],
							['==', ['get', 'subclass'], 'hamlet']
						],
						layout: {
							'text-ignore-placement': true,
							'text-allow-overlap': false,
							'icon-allow-overlap': false,
							'symbol-placement': 'point',
							'text-field': ['get', 'name'],
							'text-size': 14
						},
						paint: {
							'text-color': 'white',
							'text-halo-color': 'black',
							'text-halo-width': 3,
							'text-halo-blur': 2
						}
					},
					{
						id: 'local-labels',
						type: 'symbol',
						source: 'daylight',
						'source-layer': 'placename',
						minzoom: 14,
						maxzoom: 21,
						filter: [
							'any',
							['==', ['get', 'subclass'], 'neighborhood'],
							['==', ['get', 'subclass'], 'suburb'],
							['==', ['get', 'subclass'], 'borough'],
							['==', ['get', 'subclass'], 'block']
						],
						layout: {
							'text-ignore-placement': true,
							'text-allow-overlap': true,
							'icon-allow-overlap': true,
							'icon-ignore-placement': true,
							'symbol-placement': 'point',
							'text-field': ['get', 'name'],
							'text-size': 14
						},
						paint: {
							'text-color': 'white',
							'text-halo-color': 'black',
							'text-halo-width': 3,
							'text-halo-blur': 2
						}
					} */
					{
						id: 'topobaas-lines',
						type: 'line',
						source: 'topobaasClickedToPlaceLines',
						paint: {
							'line-color': 'red',
							'line-width': 1,
							'line-dasharray': [3, 3]
						}
					},
					{
						id: 'topobaas-places',
						type: 'fill',
						source: 'topobaasPlaces',
						paint: {
							'fill-color': '#a3569d',
							'fill-opacity': 0.75
						}
					},
					{
						id: 'topobaas-clicked-locations',
						type: 'circle',
						source: 'topobaasClickedLocations',
						paint: {
							'circle-radius': 7,
							'circle-color': '#505d90',
							'circle-stroke-color': '#7f7cf7',
							'circle-stroke-width': 2
						}
					},
					{
						id: 'topobaas-places-labels',
						type: 'symbol',
						source: 'topobaasPlaces',
						layout: {
							'text-font': ['Noto Sans Italic'],
							'text-field': ['get', 'name'],
							'text-anchor': 'top',
							'text-size': 14,
							'text-offset': [0, 0]
						},
						paint: {
							'text-color': '#fff',
							'text-halo-color': '#000',
							'text-halo-width': 2,
							'text-halo-blur': 1
						}
					}
				]
			},
			center: [5.164, 52.266],
			zoom: 7.2
		});

		app.map.set(map);
	}
</script>

<div id="map" class="map" />

<style>
	.map {
		width: 100%;
		height: 100%;
	}
</style>
