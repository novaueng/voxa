import { DialogflowConversation, GoogleCloudDialogflowV2WebhookRequest } from "actions-on-google";
import { Context as AWSLambdaContext } from "aws-lambda";
import { Context as AzureContext } from "azure-functions-ts-essentials";
import { LambdaLogOptions } from "lambda-log";
import { VoxaEvent } from "../../VoxaEvent";
import { DialogflowIntent } from "./DialogflowIntent";
import { DialogflowSession } from "./DialogflowSession";
export interface IDialogflow {
    conv: DialogflowConversation;
}
export declare class DialogflowEvent extends VoxaEvent {
    rawEvent: GoogleCloudDialogflowV2WebhookRequest;
    session: DialogflowSession;
    dialogflow: IDialogflow;
    intent: DialogflowIntent;
    constructor(rawEvent: GoogleCloudDialogflowV2WebhookRequest, logOptions?: LambdaLogOptions, executionContext?: AWSLambdaContext | AzureContext);
    getUserInformation(): Promise<any>;
    protected initSession(): void;
    protected initUser(): void;
    /**
     * conv.user.id is a deprecated feature that will be removed soon
     * this makes it so skills using voxa are future proof
     *
     * We use conv.user.id if it's available, but we store it in userStorage,
     * If there's no conv.user.id we generate a uuid.v1 and store it in userStorage
     *
     * After that we'll default to the userStorage value
     */
    protected getUserId(conv: any): string;
    readonly supportedInterfaces: string[];
}
