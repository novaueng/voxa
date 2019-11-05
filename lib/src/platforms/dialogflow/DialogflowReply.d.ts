import { GoogleActionsV2SimpleResponse, GoogleCloudDialogflowV2Context, RichResponse } from "actions-on-google";
import { IBag, IVoxaEvent } from "../../VoxaEvent";
import { IVoxaReply } from "../../VoxaReply";
export interface IDialogflowPayload {
    facebook?: any;
    google?: any;
}
export interface IGooglePayload extends IDialogflowPayload {
    google: {
        expectUserResponse: boolean;
        noInputPrompts?: any[];
        richResponse?: RichResponse;
        possibleIntents?: any;
        expectedInputs?: any;
        inputPrompt?: any;
        systemIntent?: any;
        isSsml?: boolean;
        userStorage: any;
        resetUserStorage?: true;
    };
}
export declare class DialogflowReply implements IVoxaReply {
    outputContexts: GoogleCloudDialogflowV2Context[];
    fulfillmentMessages?: any[];
    fulfillmentText: string;
    source: string;
    payload: IDialogflowPayload;
    sessionEntityTypes: any[];
    constructor();
    saveSession(attributes: IBag, event: IVoxaEvent): Promise<void>;
    readonly speech: string;
    readonly hasMessages: boolean;
    readonly hasDirectives: boolean;
    readonly hasTerminated: boolean;
    clear(): void;
    terminate(): void;
    addStatement(statement: string, isPlain?: boolean): void;
    addSessionEntity(sessionEntity: any): void;
    hasDirective(type: string | RegExp): boolean;
    addReprompt(reprompt: string): void;
    protected getRichResponseDirectives(): string[];
    protected getSimpleResponse(): GoogleActionsV2SimpleResponse;
}
