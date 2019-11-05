import { IDirective } from "../directives";
export interface ITransition {
    [propname: string]: any;
    to?: string;
    flow?: string;
}
/**
 * A helper class for transitions. Users can return transitions as an object with various command keys.
 * For developer flexibility we allow that transition object to be vague.
 * This object wraps the ITransition and gives defaults helps interpret what the various toggles mean.
 */
export declare class SystemTransition implements ITransition {
    [propname: string]: any;
    to: string;
    flow: string;
    directives?: IDirective[];
    constructor(transition: ITransition);
    readonly shouldTerminate: boolean;
    readonly shouldContinue: boolean;
}
