<script lang="ts">
	import { app } from '$lib/app';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';

	let difficulties = ['Noob', 'Easy', 'Normal', 'Pro', 'Baas'];
	$: difficulty = app.game.difficulty;
	$: finished = app.game.finished;
	$: nrRounds = app.game.nrRounds;
	$: currentRound = app.game.currentRound;
	$: previousRound = app.game.previousRound;
	$: roundText = `${$currentRound ? $currentRound.index + 1 : 0}/${$nrRounds}`;
	$: score = app.game.score;
</script>

<div class="w-full md:w-auto absolute md:top-5 md:left-5 top-0 left-0 flex flex-col gap-0.5rem card p-4 variant-glass-primary">
	<div class="w-full text-center text-xl md:text-5xl font-extrabold mb-2 m-0 p-0">TOPOBAAS</div>

	<RadioGroup class="mb-2">
		<RadioItem class="text-sm md:text-base" bind:group={$difficulty} name="justify" value={0}>{difficulties[0]}</RadioItem>
		<RadioItem class="text-sm md:text-base" bind:group={$difficulty} name="justify" value={1}>{difficulties[1]}</RadioItem>
		<RadioItem class="text-sm md:text-base" bind:group={$difficulty} name="justify" value={2}>{difficulties[2]}</RadioItem>
		<RadioItem class="text-sm md:text-base" bind:group={$difficulty} name="justify" value={3}>{difficulties[3]}</RadioItem>
		<RadioItem class="text-sm md:text-base" bind:group={$difficulty} name="justify" value={4}>{difficulties[4]}</RadioItem>
	</RadioGroup>

	<hr class="!border-t-2 border-red-500" />

	<div class="relative">
		{#if $finished}
			<div class="md:text-xl text-l font-light text-center">
				Einde spel <br />
				{$score} punten * {difficulties[$difficulty]} multiplier
			</div>
			<div class="md:text-2xl text-l font-semibold text-center">
				Score: {Math.round($score * (1 + $difficulty / 10))}
			</div>
		{:else}
			<div class="absolute bottom-0 right-0 md:text-sm text-xs font-light">
				{roundText}
			</div>
			<div class="mb-2 mt-2 md:text-xl text-l font-semibold text-center">
				{$currentRound ? `${$currentRound.feature.properties.name}` : 'Geen spel gestart'}
			</div>
		{/if}
	</div>

	<hr class="!border-t-2 border-red-500" />

	{#if !$finished}
		<div class="stats w-full text-center md:text-xl text-l font-semibold">
			<div>
				Score: {$score}
			</div>
		</div>
		{:else}
		<button type="button" class="btn variant-filled mb-2 mt-2" >NOG EEN KEER!!?!</button>
	{/if}

	{#if $previousRound}
		<div class="w-full text-center font-light">
			{#if $previousRound.distance === 0}
				Helemaal goed,
			{:else}
				Je zat er {$previousRound.distance < 1000
					? `${$previousRound.distance.toFixed(0)}m`
					: $previousRound.distance < 10000
					? `${($previousRound.distance / 1000).toFixed(2)}km`
					: `${($previousRound.distance / 1000).toFixed(0)}km`}
				naast en krijgt
			{/if}
			{$previousRound.score} punten.
		</div>
	{/if}
</div>

<style>
	.control {
		position: absolute;
		top: 20px;
		left: 20px;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.stats {
		display: flex;
		gap: 2rem;
		justify-content: center;
	}
</style>
