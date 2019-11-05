/// <reference types="node" />
import { APIGatewayProxyEvent, APIGatewayProxyResult, Callback as AWSLambdaCallback, Context as AWSLambdaContext } from "aws-lambda";
import { Context as AzureContext, HttpRequest as AzureHttpRequest } from "azure-functions-ts-essentials";
import * as http from "http";
import { LambdaLogOptions } from "lambda-log";
import { IDirectiveClass } from "../directives";
import { ITransition } from "../StateMachine";
import { IStateHandler } from "../StateMachine";
import { VoxaApp } from "../VoxaApp";
import { IVoxaEvent, IVoxaEventClass } from "../VoxaEvent";
import { IVoxaReply } from "../VoxaReply";
export interface IVoxaPlatformConfig {
    logOptions?: LambdaLogOptions;
    test?: boolean;
    [key: string]: any;
}
export declare abstract class VoxaPlatform {
    app: VoxaApp;
    config: IVoxaPlatformConfig;
    name: string;
    protected abstract EventClass: IVoxaEventClass;
    constructor(app: VoxaApp, config?: IVoxaPlatformConfig);
    startServer(port?: number): Promise<http.Server>;
    execute(rawEvent: any, context?: AWSLambdaContext | AzureContext): Promise<any>;
    lambda(): (event: any, context: AWSLambdaContext | AzureContext, callback: AWSLambdaCallback<any>) => Promise<void>;
    lambdaHTTP(): (event: APIGatewayProxyEvent, context: AWSLambdaContext, callback: AWSLambdaCallback<APIGatewayProxyResult>) => Promise<void>;
    azureFunction(): (context: AzureContext, req: AzureHttpRequest) => Promise<void>;
    onIntent(intentName: string, handler: IStateHandler | ITransition): void;
    onState(stateName: string, handler: IStateHandler | ITransition, intents?: string[] | string): void;
    protected getEvent(rawEvent: any, context?: AWSLambdaContext | AzureContext): Promise<IVoxaEvent>;
    protected abstract getReply(event: IVoxaEvent): IVoxaReply;
    protected getLogOptions(executionContext?: AWSLambdaContext | AzureContext): LambdaLogOptions;
    protected getRequestId(executionContext?: AWSLambdaContext | AzureContext): string;
    protected abstract getDirectiveHandlers(): IDirectiveClass[];
    protected getPlatformRequests(): string[];
}
