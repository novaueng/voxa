import { VoxaPlatform } from "./platforms/VoxaPlatform";
import { ITransition } from "./StateMachine";
import { IVoxaEvent } from "./VoxaEvent";
import { IVoxaReply } from "./VoxaReply";
export interface IDirectiveClass {
    platform: string;
    key: string;
    new (...args: any[]): IDirective;
}
export interface IDirective {
    writeToReply: (reply: IVoxaReply, event: IVoxaEvent, transition: ITransition) => Promise<void>;
}
export declare function sampleOrItem(statement: string | string[], platform: VoxaPlatform): string;
export declare class Reprompt implements IDirective {
    viewPath: string;
    static key: string;
    static platform: string;
    constructor(viewPath: string);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition: ITransition): Promise<void>;
}
export interface IAskStatement {
    ask: string;
    reprompt?: string;
}
export declare class Ask implements IDirective {
    static key: string;
    static platform: string;
    viewPaths: string[];
    constructor(viewPaths: string | string[]);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition: ITransition): Promise<void>;
    private addStatementToReply;
}
export declare class Say implements IDirective {
    viewPaths: string | string[];
    static key: string;
    static platform: string;
    constructor(viewPaths: string | string[]);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition: ITransition): Promise<void>;
}
export declare class SayP implements IDirective {
    statement: string;
    static key: string;
    static platform: string;
    constructor(statement: string);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition: ITransition): Promise<void>;
}
export declare class Tell implements IDirective {
    viewPath: string;
    static key: string;
    static platform: string;
    constructor(viewPath: string);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition: ITransition): Promise<void>;
}
export declare class Text implements IDirective {
    viewPaths: string | string[];
    static key: string;
    static platform: string;
    constructor(viewPaths: string | string[]);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition: ITransition): Promise<void>;
}
export declare class TextP implements IDirective {
    text: string;
    static key: string;
    static platform: string;
    constructor(text: string);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition: ITransition): Promise<void>;
}
