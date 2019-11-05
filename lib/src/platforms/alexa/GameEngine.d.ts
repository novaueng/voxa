import { services } from "ask-sdk-model";
export declare class GameEngine {
    static getEventsBuilder(name: string): EventsBuilder;
    static getDeviationRecognizerBuilder(name: string): DeviationRecognizerBuilder;
    static getPatternRecognizerBuilder(name: string): PatternRecognizerBuilder;
    static getProgressRecognizerBuilder(name: string): ProgressRecognizerBuilder;
    static stopInputHandler(originatingRequestId: string): any;
    events: any;
    recognizers: any;
    setEvents(...eventArray: any[]): GameEngine;
    setRecognizers(...recognizerArray: any[]): GameEngine;
    startInputHandler(timeout: number, proxies: any): any;
    protected mergeParameterArray(parameterArray: any[], parameter: any, type: any): void;
}
export declare class RecognizerBuilder {
    recognizers: any;
    recognizerName: string;
    constructor(recognizerName: string, type: string);
    setProperty(property: any): void;
    build(): any;
}
export declare class DeviationRecognizerBuilder extends RecognizerBuilder {
    constructor(name: string);
    recognizer(recognizer: string): DeviationRecognizerBuilder;
}
export declare class PatternRecognizerBuilder extends RecognizerBuilder {
    constructor(name: string);
    anchor(anchor: string): PatternRecognizerBuilder;
    fuzzy(fuzzy: boolean): PatternRecognizerBuilder;
    gadgetIds(gadgetIds: any): PatternRecognizerBuilder;
    actions(actions: string): PatternRecognizerBuilder;
    pattern(pattern: services.gameEngine.Pattern[]): PatternRecognizerBuilder;
}
export declare class ProgressRecognizerBuilder extends RecognizerBuilder {
    constructor(name: string);
    recognizer(recognizer: string): ProgressRecognizerBuilder;
    completion(completion: number): ProgressRecognizerBuilder;
}
export declare class EventsBuilder {
    events: any;
    eventName: string;
    constructor(eventName: string);
    setProperty(property: any): EventsBuilder;
    meets(meets: any): EventsBuilder;
    fails(fails: any): EventsBuilder;
    reports(reports: string): EventsBuilder;
    shouldEndInputHandler(shouldEndInputHandler: boolean): EventsBuilder;
    maximumInvocations(maximumInvocations: number): EventsBuilder;
    triggerTimeMilliseconds(triggerTimeMilliseconds: number): EventsBuilder;
    build(): any;
}
export declare const EVENT_REPORT_ENUM: {
    HISTORY: string;
    MATCHES: string;
    NOTHING: string;
};
export declare const ANCHOR_ENUM: {
    ANYWHERE: string;
    END: string;
    START: string;
};
