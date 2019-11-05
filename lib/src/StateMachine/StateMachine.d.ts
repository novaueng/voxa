import { IVoxaIntentEvent } from "../VoxaEvent";
import { IVoxaReply } from "../VoxaReply";
import { State } from "./State";
import { ITransition, SystemTransition } from "./transitions";
export declare type IStateMachineCb = (event: IVoxaIntentEvent, reply: IVoxaReply, transition: ITransition) => Promise<ITransition>;
export declare type IUnhandledStateCb = (event: IVoxaIntentEvent, stateName: string) => Promise<ITransition>;
export declare type IOnBeforeStateChangedCB = (event: IVoxaIntentEvent, reply: IVoxaReply, state: State) => Promise<void>;
export interface IStateMachineConfig {
    states: State[];
    onBeforeStateChanged?: IOnBeforeStateChangedCB[];
    onAfterStateChanged?: IStateMachineCb[];
    onUnhandledState?: IUnhandledStateCb;
}
export declare class StateMachine {
    states: State[];
    currentState: State;
    onBeforeStateChangedCallbacks: IOnBeforeStateChangedCB[];
    onAfterStateChangeCallbacks: IStateMachineCb[];
    onUnhandledStateCallback?: IUnhandledStateCb;
    constructor(config: IStateMachineConfig);
    runTransition(fromState: string, voxaEvent: IVoxaIntentEvent, reply: IVoxaReply, recursions?: number): Promise<SystemTransition>;
    private stateTransition;
    private onAfterStateChanged;
    private checkOnUnhandledState;
    private runOnBeforeStateChanged;
    private getCurrentState;
}
