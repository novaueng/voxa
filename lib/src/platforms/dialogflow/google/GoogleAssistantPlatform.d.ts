import { IDirectiveClass } from "../../../directives";
import { ITransition } from "../../../StateMachine";
import { VoxaApp } from "../../../VoxaApp";
import { IVoxaEvent } from "../../../VoxaEvent";
import { IVoxaReply } from "../../../VoxaReply";
import { IVoxaPlatformConfig } from "../../VoxaPlatform";
import { DialogflowPlatform } from "../DialogflowPlatform";
import { DialogflowReply } from "../DialogflowReply";
import { ITransactionOptions } from "./apis/ITransactionOptions";
import { GoogleAssistantEvent } from "./GoogleAssistantEvent";
export interface IGoogleAssistantPlatformConfig extends IVoxaPlatformConfig {
    clientId?: string;
    transactionOptions?: ITransactionOptions;
}
export declare class GoogleAssistantPlatform extends DialogflowPlatform {
    name: string;
    protected EventClass: typeof GoogleAssistantEvent;
    constructor(app: VoxaApp, config?: IGoogleAssistantPlatformConfig);
    protected getReply(): DialogflowReply;
    protected saveStorage(voxaEvent: IVoxaEvent, reply: IVoxaReply, transition: ITransition): void;
    protected getDirectiveHandlers(): IDirectiveClass[];
}
