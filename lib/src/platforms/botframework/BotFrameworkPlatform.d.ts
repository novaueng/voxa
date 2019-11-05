import { APIGatewayProxyEvent, APIGatewayProxyResult, Callback as AWSLambdaCallback, Context as AWSLambdaContext } from "aws-lambda";
import { Context as AzureContext } from "azure-functions-ts-essentials";
import { IBotStorage, IBotStorageData, IMessage } from "botbuilder";
import { IDirectiveClass } from "../../directives";
import { VoxaApp } from "../../VoxaApp";
import { IVoxaIntent } from "../../VoxaEvent";
import { IVoxaEvent } from "../../VoxaEvent";
import { IVoxaReply } from "../../VoxaReply";
import { VoxaPlatform } from "../VoxaPlatform";
import { BotFrameworkEvent } from "./BotFrameworkEvent";
export declare type IRecognize = (msg: IMessage) => Promise<IVoxaIntent | undefined>;
export interface IBotframeworkPlatformConfig {
    applicationId?: string;
    applicationPassword?: string;
    storage: IBotStorage;
    recognize: IRecognize;
    defaultLocale: string;
}
export declare class BotFrameworkPlatform extends VoxaPlatform {
    name: string;
    recognize: IRecognize;
    storage: IBotStorage;
    applicationId?: string;
    applicationPassword?: string;
    protected EventClass: typeof BotFrameworkEvent;
    constructor(voxaApp: VoxaApp, config: IBotframeworkPlatformConfig);
    lambdaHTTP(): (event: APIGatewayProxyEvent, context: AWSLambdaContext, callback: AWSLambdaCallback<APIGatewayProxyResult>) => Promise<void>;
    execute(rawEvent: any, context?: AWSLambdaContext | AzureContext): Promise<{}>;
    protected getReply(event: BotFrameworkEvent): IVoxaReply;
    protected getEvent(rawEvent: any, context?: AWSLambdaContext | AzureContext): Promise<IVoxaEvent>;
    protected getDirectiveHandlers(): IDirectiveClass[];
    protected getPlatformRequests(): string[];
    protected getStateData(event: IMessage): Promise<IBotStorageData>;
}
export declare function moveFieldsTo(frm: any, to: any, fields: {
    [id: string]: string;
}): void;
export declare function prepIncomingMessage(msg: IMessage): IMessage;
