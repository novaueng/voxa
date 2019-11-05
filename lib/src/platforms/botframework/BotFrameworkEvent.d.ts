import { Context as AWSLambdaContext } from "aws-lambda";
import { Context as AzureContext } from "azure-functions-ts-essentials";
import { IBotStorageData, IConversationUpdate, IEvent, IMessage } from "botbuilder";
import { LambdaLogOptions } from "lambda-log";
import { ITypeMap, IVoxaIntent, VoxaEvent } from "../../VoxaEvent";
export interface IBotframeworkPayload {
    message: IEvent;
    stateData: IBotStorageData;
    intent?: IVoxaIntent;
}
export declare class BotFrameworkEvent extends VoxaEvent {
    readonly supportedInterfaces: string[];
    rawEvent: IBotframeworkPayload;
    requestToRequest: ITypeMap;
    utilitiesIntentMapping: ITypeMap;
    constructor(rawEvent: IBotframeworkPayload, logOptions?: LambdaLogOptions, context?: AWSLambdaContext | AzureContext);
    getUserInformation(): Promise<any>;
    protected initSession(): void;
    protected getIntentFromEntity(): void;
    protected mapUtilitiesIntent(intent: IVoxaIntent): IVoxaIntent;
    protected initUser(): void;
    protected mapRequestToIntent(): void;
    protected getRequest(): {
        type: string;
        locale: any;
    };
}
export declare function isIMessage(event: IEvent): event is IMessage;
export declare function isIConversationUpdate(event: IEvent | IConversationUpdate): event is IConversationUpdate;
export declare function getEntity(msg: IMessage, type: string): any;
