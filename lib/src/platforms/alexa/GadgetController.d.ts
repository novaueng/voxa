export declare class GadgetController {
    static getAnimationsBuilder(): AnimationsBuilder;
    static getSequenceBuilder(): SequenceBuilder;
    animations: any;
    triggerEvent?: string;
    setAnimations(...animationArray: any[]): this;
    setTriggerEvent(triggerEvent: string): GadgetController;
    setLight(targetGadgets: any, triggerEventTimeMs: number): any;
}
export declare class AnimationsBuilder {
    animation: any;
    constructor();
    repeat(repeat: number): AnimationsBuilder;
    targetLights(targetLights: any): AnimationsBuilder;
    sequence(sequenceArray: any): AnimationsBuilder;
    build(): any;
}
export declare class SequenceBuilder {
    sequence: any;
    constructor();
    duration(durationMs: number): this;
    color(color: string): this;
    blend(blend: boolean): this;
    build(): any;
}
export declare const TRIGGER_EVENT_ENUM: {
    BUTTON_DOWN: string;
    BUTTON_UP: string;
    NONE: string;
};
