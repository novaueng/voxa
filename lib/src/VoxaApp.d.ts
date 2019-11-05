import * as bluebird from "bluebird";
import * as i18next from "i18next";
import { LambdaLogOptions } from "lambda-log";
import { IDirectiveClass } from "./directives";
import { IModel } from "./Model";
import { IRenderer, IRendererConfig, Renderer } from "./renderers/Renderer";
import { IStateHandler, ITransition, IUnhandledStateCb, State, SystemTransition } from "./StateMachine";
import { IVoxaEvent, IVoxaIntentEvent } from "./VoxaEvent";
import { IVoxaReply } from "./VoxaReply";
export interface IVoxaAppConfig extends IRendererConfig {
    Model: IModel;
    RenderClass: IRenderer;
    views: i18next.Resource;
    variables?: any;
    logOptions?: LambdaLogOptions;
    onUnhandledState?: IUnhandledStateCb;
}
export declare type IEventHandler = (event: IVoxaEvent, response: IVoxaReply, transition?: ITransition) => IVoxaReply | void;
export declare type IErrorHandler = (event: IVoxaEvent, error: Error, ReplyClass: IVoxaReply) => IVoxaReply;
export declare class VoxaApp {
    [key: string]: any;
    readonly requestTypes: string[];
    eventHandlers: any;
    requestHandlers: any;
    config: IVoxaAppConfig;
    renderer: Renderer;
    i18nextPromise: PromiseLike<i18next.TFunction>;
    i18n: i18next.i18n;
    states: State[];
    directiveHandlers: IDirectiveClass[];
    constructor(config: any);
    validateConfig(): void;
    handleOnSessionEnded(event: IVoxaIntentEvent, response: IVoxaReply): Promise<IVoxaReply>;
    handleErrors(event: IVoxaEvent, error: Error, reply: IVoxaReply): Promise<IVoxaReply>;
    execute(voxaEvent: IVoxaEvent, reply: IVoxaReply): Promise<IVoxaReply>;
    registerRequestHandler(requestType: string): void;
    registerEvents(): void;
    onUnhandledState(fn: IUnhandledStateCb): void;
    registerEvent(eventName: string): void;
    onState(stateName: string, handler: IStateHandler | ITransition, intents?: string[] | string, platform?: string): void;
    onIntent(intentName: string, handler: IStateHandler | ITransition, platform?: string): void;
    runStateMachine(voxaEvent: IVoxaIntentEvent, response: IVoxaReply): Promise<IVoxaReply>;
    renderDirectives(voxaEvent: IVoxaEvent, response: IVoxaReply, transition: SystemTransition): Promise<ITransition>;
    saveSession(voxaEvent: IVoxaEvent, response: IVoxaReply, transition: ITransition): Promise<void>;
    transformRequest(voxaEvent: IVoxaEvent): Promise<void>;
    private getReplyTransitions;
}
export declare function initializeI118n(i18nInstance: i18next.i18n, views: i18next.Resource): bluebird<i18next.TFunction>;
