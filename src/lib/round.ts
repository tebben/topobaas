
export class Round {
    public index: number;
    public feature: any;
    public distance: number;
    public score: number;

    constructor(index: number, feature: any) {
        this.index = index;
        this.feature = feature;
        this.distance = -1
        this.score = 0;
    }
    
}