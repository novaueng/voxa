import { Response, ResponseEnvelope } from "ask-sdk-model";
import { IBag, IVoxaEvent } from "../../VoxaEvent";
import { IVoxaReply } from "../../VoxaReply";
export declare class AlexaReply implements IVoxaReply, ResponseEnvelope {
    version: string;
    response: Response;
    sessionAttributes: IBag;
    readonly hasMessages: boolean;
    readonly hasDirectives: boolean;
    readonly hasTerminated: boolean;
    saveSession(attributes: IBag, event: IVoxaEvent): Promise<void>;
    terminate(): void;
    readonly speech: string;
    readonly reprompt: string;
    addStatement(statement: string, isPlain?: boolean): void;
    addReprompt(statement: string, isPlain?: boolean): void;
    fulfillIntent(canFulfill: any): void;
    fulfillSlot(slotName: string, canUnderstand: any, canFulfill: any): void;
    clear(): void;
    hasDirective(type: string | RegExp): boolean;
}
