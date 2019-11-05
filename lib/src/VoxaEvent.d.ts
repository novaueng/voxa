import { Context as AWSLambdaContext } from "aws-lambda";
import { Context as AzureContext } from "azure-functions-ts-essentials";
import * as i18next from "i18next";
import { LambdaLog, LambdaLogOptions } from "lambda-log";
import { Model } from "./Model";
import { VoxaPlatform } from "./platforms/VoxaPlatform";
import { Renderer } from "./renderers/Renderer";
export interface ITypeMap {
    [x: string]: string;
}
export interface IVoxaRequest {
    locale: string;
    type: string;
}
export declare type IVoxaEventClass = new (rawEvent: any, logOptions: LambdaLogOptions, context: any) => IVoxaEvent;
export interface IVoxaIntentEvent extends IVoxaEvent {
    intent: IVoxaIntent;
}
export interface IVoxaEvent {
    rawEvent: any;
    session: IVoxaSession;
    intent?: IVoxaIntent;
    request: IVoxaRequest;
    model: Model;
    t: i18next.TFunction;
    log: LambdaLog;
    renderer: Renderer;
    user: IVoxaUser;
    platform: VoxaPlatform;
    supportedInterfaces: string[];
    executionContext?: AWSLambdaContext | AzureContext;
    afterPlatformInitialized?(): void;
}
export declare abstract class VoxaEvent implements IVoxaEvent {
    executionContext?: AWSLambdaContext | AzureContext | undefined;
    abstract readonly supportedInterfaces: string[];
    rawEvent: any;
    session: IVoxaSession;
    intent?: IVoxaIntent;
    request: IVoxaRequest;
    model: Model;
    t: i18next.TFunction;
    log: LambdaLog;
    renderer: Renderer;
    user: IVoxaUser;
    platform: VoxaPlatform;
    protected requestToIntent: ITypeMap;
    protected requestToRequest: ITypeMap;
    constructor(rawEvent: any, logOptions?: LambdaLogOptions, executionContext?: AWSLambdaContext | AzureContext | undefined);
    abstract getUserInformation(): Promise<IVoxaUserProfile>;
    protected abstract initSession(): void;
    protected abstract initUser(): void;
    protected mapRequestToRequest(): void;
    protected mapRequestToIntent(): void;
    protected initLogger(logOptions: LambdaLogOptions): void;
}
export interface IVoxaUser {
    id: string;
    userId: string;
    accessToken?: string;
    [key: string]: any;
}
export interface IVoxaIntent {
    rawIntent?: any;
    name: string;
    params: any;
}
export interface IBag extends Object {
    [key: string]: any;
}
export interface IVoxaSession {
    attributes: IBag;
    outputAttributes: IBag;
    new: boolean;
    sessionId: string;
}
export interface IVoxaUserProfile {
    email: string;
    name: string;
}
