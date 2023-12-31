import { get, writable } from "svelte/store";
import { Round } from "$lib/round";
import * as turf from '@turf/turf';

import type { Writable } from "svelte/store";

export class Game {
    private places: any;
    private map?: maplibregl.Map;
    private placeFeatures: Array<any> = [];
    private clickedFeatures: Array<any> = [];
    private clickedToPlaceFeatures: Array<any> = [];
    private difficultyMap = [
        [20, 20],
        [19, 20],
        [17, 20],
        [8, 17],
        [1, 16]
    ];

    public rounds: Array<Round>;
    public difficulty: Writable<number>;
    public nrRounds: Writable<number>;
    public currentRound: Writable<Round | undefined>;
    public previousRound: Writable<Round | undefined>;
    public score: Writable<number>;
    public finished: Writable<boolean>;

    constructor(places: any) {
        this.places = places;
        this.finished = writable(false);
        this.difficulty = writable(1);
        this.nrRounds = writable(10);
        this.score = writable(0);
        this.rounds = new Array<Round>();
        this.currentRound = writable(undefined);
        this.previousRound = writable(undefined);
        this.startOnDifficultyChange();
    }

    public setMap(map: maplibregl.Map): void {
        this.map = map;
        this.mapAddClickListener();
    }

    private mapAddClickListener(): void {
        this.map?.on("click", (e: any) => {
            this.scoreRound(e.lngLat);
        });
    }

    private scoreRound(location: { lng: number, lat: number }): void {
        const finished = get(this.finished);
        const round = get(this.currentRound);
        if (finished || !round) {
            return;
        }

        const point = turf.point([location.lng, location.lat]);

        // check if point intersects with feature, if so score = max
        if (!turf.booleanPointInPolygon(point, round.feature)) {
            let feature;
            if (round.feature.geometry.type === 'MultiPolygon' || round.feature.geometry.coordinates.length >= 2) {
                feature = turf.convex(round.feature);
            } else {
                feature = round.feature;
            }

            const polygonToLine = turf.polygonToLine(feature);

            // @ts-ignore
            round.distance = Math.round(turf.pointToLineDistance(point, polygonToLine, { units: 'meters' }));

            //const minScore = 0;
            //const maxScore = 100;
            //const maxDistance = 30000;
            //round.score = Math.round(Math.max(minScore, maxScore - (round.distance / maxDistance) * maxScore));

            round.score = this.calculateScore(100, round.distance, 20000)
        } else {
            round.distance = 0;
            round.score = 100;
        }

        // add place to features to show on map
        this.placeFeatures.push(round.feature);

        // add clicked location to features to show on map
        const clickedFeature = turf.point([location.lng, location.lat]);
        this.clickedFeatures.push(clickedFeature);

        // add line between clicked location and place to features to show on map, use the center point of the place
        const center = turf.center(round.feature);
        const clickedToPlaceFeature = turf.lineString([clickedFeature.geometry.coordinates, center.geometry.coordinates]);
        this.clickedToPlaceFeatures.push(clickedToPlaceFeature);


        this.updateScore();
        this.nextRound();
        this.updateMap();
        this.resetMapPosition();
    }

    private calculateScore(maxScore: number, distance: number, scalingFactor: number): number {
        return Math.round(maxScore * Math.exp(-distance / scalingFactor));
    }

    private resetMapPosition(): void {
        let bearing = get(this.difficulty) === this.difficultyMap.length - 1 ? Math.random() * 360 : 0;

          var bounds = [
            [3.31497114423, 50.803721015], // Southwest coordinates
            [ 7.09205325687, 53.5104033474] // Northeast coordinates
          ];
          // @ts-ignore
          this.map?.fitBounds(bounds, {padding: 40, bearing: bearing });
        }


    private updateMap(): void {
        if (!this.map) {
            return;
        }

        // @ts-ignore
        this.map.getSource('topobaasPlaces').setData({
            'type': 'FeatureCollection',
            'features': this.placeFeatures
        });

        // @ts-ignore
        this.map.getSource('topobaasClickedLocations').setData({
            'type': 'FeatureCollection',
            'features': this.clickedFeatures
        });

        // @ts-ignore
        this.map.getSource('topobaasClickedToPlaceLines').setData({
            'type': 'FeatureCollection',
            'features': this.clickedToPlaceFeatures
        });
    }

    private updateScore(): void {
        let score = 0;
        this.rounds.forEach((round) => {
            score += round.score;
        });

        this.score.set(score);
    }

    private startOnDifficultyChange() {
        this.difficulty.subscribe((difficulty) => {
            this.start(difficulty);
        });
    }

    public start(difficulty: number = get(this.difficulty)) {
        this.rounds = [];
        this.createRounds(difficulty, get(this.nrRounds));
        this.currentRound.set(this.rounds[0]);
        this.previousRound.set(undefined);
        this.score.set(0);
        this.placeFeatures = [];
        this.clickedFeatures = [];
        this.clickedToPlaceFeatures = [];
        this.updateMap();
        this.finished.set(false);

        this.resetMapPosition();
    }

    private createRounds(difficulty: number, nrRounds: number): any {
        const ranks = this.difficultyMap[difficulty];
        const places = this.places.features.filter((place: any) => {
            return place.properties.rank >= ranks[0] && place.properties.rank <= ranks[1];
        });

        const indexUsed = new Array<number>();
        for (let i = 0; i < nrRounds; i++) {
            let randomIndex = Math.floor(Math.random() * places.length);
            
            while (indexUsed.includes(randomIndex)) {
                randomIndex = Math.floor(Math.random() * places.length);
            }

            indexUsed.push(randomIndex);
            
            this.rounds.push(new Round(i, places[randomIndex]));
            places.splice(randomIndex, 1);
        }
    }

    private nextRound(): void {
        const round = get(this.currentRound);
        const finished = get(this.finished);

        if (!round || finished) {
            return;
        }

        this.previousRound.set(round);

        if (round?.index === this.rounds.length - 1) {
            this.finished.set(true);
            return;
        }

        this.currentRound.set(this.rounds[round.index + 1]);
    }
}