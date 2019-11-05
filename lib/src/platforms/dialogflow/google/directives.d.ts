import { Parameters } from "actions-on-google";
import { IDirective, IDirectiveClass, Say as BaseSay } from "../../../directives";
import { ITransition } from "../../../StateMachine";
import { IVoxaEvent } from "../../../VoxaEvent";
import { IVoxaReply } from "../../../VoxaReply";
export declare const LinkOutSuggestion: IDirectiveClass;
export declare const NewSurface: IDirectiveClass;
export declare const List: IDirectiveClass;
export declare const Carousel: IDirectiveClass;
export declare const AccountLinkingCard: IDirectiveClass;
export declare const Permission: IDirectiveClass;
export declare const DateTime: IDirectiveClass;
export declare const Confirmation: IDirectiveClass;
export declare const DeepLink: IDirectiveClass;
export interface IPlaceOptions {
    /**
     * This is the initial response by location sub-dialog.
     * For example: "Where do you want to get picked up?"
     * @public
     */
    prompt: string;
    /**
     * This is the context for seeking permissions.
     * For example: "To find a place to pick you up"
     * Prompt to user: "*To find a place to pick you up*, I just need to check your location.
     *     Can I get that from Google?".
     * @public
     */
    context: string;
}
export declare const Place: IDirectiveClass;
export declare const CompletePurchase: IDirectiveClass;
export declare const TransactionDecision: IDirectiveClass;
export declare const TransactionRequirements: IDirectiveClass;
export declare const RegisterUpdate: IDirectiveClass;
export declare const UpdatePermission: IDirectiveClass;
export declare const BasicCard: IDirectiveClass;
export declare const MediaResponse: IDirectiveClass;
export declare const Table: IDirectiveClass;
export declare const BrowseCarousel: IDirectiveClass;
export declare class Suggestions implements IDirective {
    suggestions: string | string[];
    static platform: string;
    static key: string;
    constructor(suggestions: string | string[]);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition?: ITransition): Promise<void>;
}
export interface IContextConfig {
    name: string;
    lifespan: number;
    parameters?: Parameters;
}
export declare class Context implements IDirective {
    contextConfig: IContextConfig;
    static platform: string;
    static key: string;
    constructor(contextConfig: IContextConfig);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition?: ITransition): Promise<void>;
}
export declare class Say extends BaseSay {
    static key: string;
    static platform: string;
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition: ITransition): Promise<void>;
}
