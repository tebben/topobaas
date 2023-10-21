<script lang="ts">
	import Map from "$lib/components/Map.svelte"
	import GameControl from '$lib/components/GameControl.svelte';
</script>

<head>
	<title>TOPOBAAS!</title>
	<meta name="description" content="Speel TOPOBAAS! en bewijs dat jij de baas van de Nederlandse kaart bent!" />
	<meta property="og:title" content="TOPOBAAS!">
	<meta property="og:description" content="Speel TOPOBAAS! en bewijs dat jij de baas van de Nederlandse kaart bent!">
	<meta property="og:image" content="https://tebben.github.io/topobaas/topobaas.jpg">
	<meta property="og:url" content="https://tebben.github.io/topobaas/">
</head>

<Map />
<GameControl />
