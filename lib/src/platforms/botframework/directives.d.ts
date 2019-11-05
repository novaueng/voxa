import { AudioCard as AudioCardType, HeroCard as HeroCardType, SuggestedActions as SuggestedActionsType } from "botbuilder";
import { IDirective, IDirectiveClass } from "../../directives";
import { ITransition } from "../../StateMachine";
import { IVoxaEvent } from "../../VoxaEvent";
import { IVoxaReply } from "../../VoxaReply";
export interface ISignInCardOptions {
    url: string;
    cardText: string;
    buttonTitle: string;
}
export declare abstract class RenderDirective<T> {
    options: T;
    constructor(options: T);
    protected renderOptions(event: IVoxaEvent): any;
}
export declare class SigninCard implements IDirective {
    signInOptions: ISignInCardOptions;
    static platform: string;
    static key: string;
    constructor(signInOptions: ISignInCardOptions);
    writeToReply(reply: IVoxaReply, event?: IVoxaEvent, transition?: ITransition): Promise<void>;
}
export declare class HeroCard extends RenderDirective<string | HeroCardType> implements IDirective {
    static platform: string;
    static key: string;
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition?: ITransition): Promise<void>;
}
export declare class SuggestedActions extends RenderDirective<string | SuggestedActionsType> implements IDirective {
    static key: string;
    static platform: string;
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition?: ITransition): Promise<void>;
}
export declare class AudioCard extends RenderDirective<string | AudioCardType> implements IDirective {
    static key: string;
    static platform: string;
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition: ITransition): Promise<void>;
}
export declare const AttachmentLayout: IDirectiveClass;
export declare const Attachments: IDirectiveClass;
