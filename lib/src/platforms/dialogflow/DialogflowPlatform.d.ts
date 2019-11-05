import { IDirectiveClass } from "../../directives";
import { VoxaApp } from "../../VoxaApp";
import { IVoxaPlatformConfig, VoxaPlatform } from "../VoxaPlatform";
import { DialogflowEvent } from "./DialogflowEvent";
import { DialogflowReply } from "./DialogflowReply";
export declare class DialogflowPlatform extends VoxaPlatform {
    name: string;
    protected EventClass: typeof DialogflowEvent;
    constructor(app: VoxaApp, config?: IVoxaPlatformConfig);
    protected getReply(): DialogflowReply;
    protected getDirectiveHandlers(): IDirectiveClass[];
}
