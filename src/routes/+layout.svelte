<script lang="ts">
	import '../app.postcss';
	import './style.css';
	import 'maplibre-gl/dist/maplibre-gl.css';

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

<slot />

<style>
	:global(.maplibregl-ctrl-bottom-right) {
    background-color: black !important;
    opacity: 0.3 !important;
}
</style>
