import { RequestEnvelope } from "ask-sdk-model";
import { Context as AWSLambdaContext } from "aws-lambda";
import { Context as AzureContext } from "azure-functions-ts-essentials";
import { VoxaApp } from "../../VoxaApp";
import { IVoxaEvent } from "../../VoxaEvent";
import { IVoxaReply } from "../../VoxaReply";
import { IVoxaPlatformConfig, VoxaPlatform } from "../VoxaPlatform";
import { AlexaEvent } from "./AlexaEvent";
import { AccountLinkingCard, APLCommand, APLTemplate, ConnectionsSendRequest, DialogElicitSlot, GadgetControllerLightDirective, GameEngineStartInputHandler, GameEngineStopInputHandler, HomeCard, PlayAudio, RenderTemplate, VideoAppLaunch } from "./directives";
export interface IAlexaPlatformConfig extends IVoxaPlatformConfig {
    appIds?: string | string[];
    defaultFulfillIntents?: string[];
}
export declare class AlexaPlatform extends VoxaPlatform {
    name: string;
    config: IAlexaPlatformConfig;
    protected EventClass: typeof AlexaEvent;
    constructor(voxaApp: VoxaApp, config?: IAlexaPlatformConfig);
    getDirectiveHandlers(): (typeof HomeCard | typeof DialogElicitSlot | typeof RenderTemplate | typeof APLTemplate | typeof APLCommand | typeof AccountLinkingCard | typeof PlayAudio | typeof GadgetControllerLightDirective | typeof GameEngineStartInputHandler | typeof GameEngineStopInputHandler | typeof ConnectionsSendRequest | typeof VideoAppLaunch)[];
    getPlatformRequests(): string[];
    execute(rawEvent: RequestEnvelope, context?: AWSLambdaContext | AzureContext): Promise<any>;
    protected getReply(event: IVoxaEvent): IVoxaReply;
    protected checkSessionEndedRequest(alexaEvent: AlexaEvent): void;
    protected checkAppIds(rawEvent: RequestEnvelope): void;
}
