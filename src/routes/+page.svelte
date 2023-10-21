<script lang="ts">
	import Map from "$lib/components/Map.svelte"
	import GameControl from '$lib/components/GameControl.svelte';
</script>

<head>
	<title>TOPOBAAS!</title>
	<meta name="description" content="Speel TOPOBAAS! en bewijs dat jij de baas van de Nederlandse kaart bent!" />
	<meta property="og:title" content="TOPOBAAS!">
	<meta property="og:description" content="Speel TOPOBAAS!, het uitdagende spel waarbij spelers Nederlandse plaatsen moeten raden op een kaart. Test je topografische kennis en ontdek hoe goed je bent in het lokaliseren van verschillende plaatsen in Nederland. Daag jezelf uit met TOPOBAAS en verken de Nederlandse topografie op een leuke en educatieve manier.">
	<meta property="og:image" content="https://tebben.github.io/topobaas/topobaas.jpg">
	<meta property="og:url" content="https://tebben.github.io/topobaas/">
</head>

<Map />
<GameControl />
