import { IDirectiveClass } from "../../../directives";
import { VoxaApp } from "../../../VoxaApp";
import { IVoxaPlatformConfig } from "../../VoxaPlatform";
import { DialogflowPlatform } from "../DialogflowPlatform";
import { FacebookEvent } from "./FacebookEvent";
import { FacebookReply } from "./FacebookReply";
export interface IFacebookPlatformConfig extends IVoxaPlatformConfig {
    pageAccessToken?: string;
}
export declare class FacebookPlatform extends DialogflowPlatform {
    name: string;
    protected EventClass: typeof FacebookEvent;
    constructor(app: VoxaApp, config?: IFacebookPlatformConfig);
    protected getReply(): FacebookReply;
    protected getDirectiveHandlers(): IDirectiveClass[];
}
