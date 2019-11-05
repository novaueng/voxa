import { EventBuilder } from "./EventBuilder";
/**
 * Sports Events Builder class reference
 */
export declare class SportsEventBuilder extends EventBuilder {
    sportsEvent: any;
    update: any;
    constructor();
    setAwayTeamStatistic(teamName: string, score: number): SportsEventBuilder;
    setHomeTeamStatistic(teamName: string, score: number): SportsEventBuilder;
    setUpdate(teamName: string, scoreEarned: number): SportsEventBuilder;
    getPayload(): any;
    private setTeamStatistic;
}
