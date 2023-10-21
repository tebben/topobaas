import { Game } from "$lib/game";
import places from "$lib/data/places.json";
import { get, writable } from "svelte/store";

import type { Writable } from "svelte/store";

export class App {
    public places: any;
    public map: Writable<maplibregl.Map | undefined>;
    public game: Game;

    constructor() {
        this.places = places;
        this.map = writable(undefined);
        this.game = new Game(this.places);
        this.subscribeToMap();
    }

    private subscribeToMap(): void {
        this.map.subscribe(() => {
            this.run();
        });
    }

    private run(): void {
        const map = get(this.map);
        if (!map) {
            return;
        }

        this.game.setMap(map);
    }
}

export const app = new App();