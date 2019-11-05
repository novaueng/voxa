import { DialogflowReply, IDialogflowPayload } from "../DialogflowReply";
export interface IFacebookPayload extends IDialogflowPayload {
    payload: {
        facebook: {
            attachment?: {
                payload: any;
                type: string;
            };
            quick_replies?: any[];
            text?: any;
        };
    };
}
export declare class FacebookReply extends DialogflowReply {
    fulfillmentMessages: IFacebookPayload[];
    readonly speech: string;
    readonly hasDirectives: boolean;
    readonly hasMessages: boolean;
    readonly hasTerminated: boolean;
    fulfillmentText: string;
    source: string;
    constructor();
    clear(): void;
    addStatement(statement: string, isPlain?: boolean): void;
    hasDirective(type: string | RegExp): boolean;
    addReprompt(reprompt: string): void;
    terminate(): void;
    protected getResponseDirectives(): string[];
}
