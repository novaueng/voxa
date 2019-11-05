import { ITransition } from "../StateMachine";
import { IVoxaIntentEvent } from "../VoxaEvent";
export declare type IStateHandler = (event: IVoxaIntentEvent) => Promise<ITransition>;
export declare class State {
    name: string;
    platform: string;
    intents: string[];
    private handler;
    constructor(name: string, handler: IStateHandler | ITransition, intents?: string | string[], platform?: string);
    handle(voxaEvent: IVoxaIntentEvent): Promise<ITransition>;
    protected getSimpleTransitionHandler(transition: ITransition): IStateHandler;
}
