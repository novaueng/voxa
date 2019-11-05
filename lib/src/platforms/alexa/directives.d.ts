import { dialog, Directive, interfaces, Slot, ui } from "ask-sdk-model";
import { IDirective } from "../../directives";
import { ITransition } from "../../StateMachine";
import { IVoxaEvent } from "../../VoxaEvent";
import { IVoxaReply } from "../../VoxaReply";
export declare abstract class AlexaDirective {
    directive?: Directive | Directive[];
    protected addDirective(reply: IVoxaReply): void;
}
export declare abstract class MultimediaAlexaDirective extends AlexaDirective {
    protected validateReply(reply: IVoxaReply): void;
}
export declare class HomeCard implements IDirective {
    viewPath: string | ui.Card;
    static platform: string;
    static key: string;
    constructor(viewPath: string | ui.Card);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition?: ITransition): Promise<void>;
}
export declare class Hint implements IDirective {
    viewPath: string;
    static platform: string;
    static key: string;
    constructor(viewPath: string);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition?: ITransition): Promise<void>;
}
export declare class DialogDelegate extends AlexaDirective implements IDirective {
    slots?: any;
    static platform: string;
    static key: string;
    directive: dialog.DelegateDirective;
    constructor(slots?: any);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition?: ITransition): Promise<void>;
    protected buildSlots(event: IVoxaEvent): void;
    protected buildDirective(event: IVoxaEvent): void;
}
export interface IElicitDialogOptions {
    slotToElicit: string;
    slots: {
        [key: string]: Slot;
    };
}
export declare class DialogElicitSlot extends AlexaDirective implements IDirective {
    options: IElicitDialogOptions;
    static platform: string;
    static key: string;
    private static validate;
    directive: dialog.ElicitSlotDirective;
    constructor(options: IElicitDialogOptions);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition: ITransition): Promise<void>;
    protected buildDirective(event: IVoxaEvent): void;
}
export declare class RenderTemplate extends AlexaDirective implements IDirective {
    static key: string;
    static platform: string;
    viewPath?: string;
    token?: string;
    directive?: interfaces.display.RenderTemplateDirective;
    constructor(viewPath: string | interfaces.display.RenderTemplateDirective);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition?: ITransition): Promise<void>;
    private validateReply;
}
export declare class APLTemplate extends AlexaDirective implements IDirective {
    static key: string;
    static platform: string;
    viewPath?: string;
    directive?: interfaces.alexa.presentation.apl.RenderDocumentDirective;
    constructor(viewPath: string | interfaces.alexa.presentation.apl.RenderDocumentDirective);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition?: ITransition): Promise<void>;
    private validateReply;
}
export declare class APLCommand extends AlexaDirective implements IDirective {
    static key: string;
    static platform: string;
    viewPath?: string;
    directive?: interfaces.alexa.presentation.apl.ExecuteCommandsDirective;
    constructor(viewPath: string | interfaces.alexa.presentation.apl.ExecuteCommandsDirective);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition?: ITransition): Promise<void>;
    private validateReply;
}
export declare class AccountLinkingCard implements IDirective {
    static key: string;
    static platform: string;
    writeToReply(reply: IVoxaReply, event?: IVoxaEvent, transition?: ITransition): Promise<void>;
}
export interface IAlexaPlayAudioDataOptions {
    url: string;
    token: string;
    offsetInMilliseconds?: number;
    behavior?: interfaces.audioplayer.PlayBehavior;
    metadata?: interfaces.audioplayer.AudioItemMetadata;
}
export declare class PlayAudio extends MultimediaAlexaDirective implements IDirective {
    data: IAlexaPlayAudioDataOptions;
    static key: string;
    static platform: string;
    directive?: interfaces.audioplayer.PlayDirective;
    constructor(data: IAlexaPlayAudioDataOptions);
    writeToReply(reply: IVoxaReply, event?: IVoxaEvent, transition?: ITransition): Promise<void>;
}
export declare class StopAudio extends AlexaDirective implements IDirective {
    static key: string;
    static platform: string;
    directive: interfaces.audioplayer.StopDirective;
    writeToReply(reply: IVoxaReply, event?: IVoxaEvent, transition?: ITransition): Promise<void>;
}
export declare class GadgetControllerLightDirective extends AlexaDirective implements IDirective {
    directive: interfaces.gadgetController.SetLightDirective | interfaces.gadgetController.SetLightDirective[];
    static key: string;
    static platform: string;
    constructor(directive: interfaces.gadgetController.SetLightDirective | interfaces.gadgetController.SetLightDirective[]);
    writeToReply(reply: IVoxaReply, event?: IVoxaEvent, transition?: ITransition): Promise<void>;
}
export declare class GameEngineStartInputHandler extends AlexaDirective implements IDirective {
    directive: interfaces.gameEngine.StartInputHandlerDirective;
    static key: string;
    static platform: string;
    constructor(directive: interfaces.gameEngine.StartInputHandlerDirective);
    writeToReply(reply: IVoxaReply, event?: IVoxaEvent, transition?: ITransition): Promise<void>;
}
export declare class GameEngineStopInputHandler extends AlexaDirective implements IDirective {
    originatingRequestId: string;
    static key: string;
    static platform: string;
    constructor(originatingRequestId: string);
    writeToReply(reply: IVoxaReply, event?: IVoxaEvent, transition?: ITransition): Promise<void>;
}
export declare class ConnectionsSendRequest extends AlexaDirective implements IDirective {
    payload: any;
    token: string;
    static key: string;
    static platform: string;
    name?: string;
    directive?: interfaces.connections.SendRequestDirective;
    type?: string;
    constructor(name: string | interfaces.connections.SendRequestDirective, payload: any, token: string);
    writeToReply(reply: IVoxaReply, event?: IVoxaEvent, transition?: ITransition): Promise<void>;
}
export interface IAlexaVideoDataOptions {
    source: string;
    title?: string;
    subtitle?: string;
}
export declare class VideoAppLaunch extends MultimediaAlexaDirective {
    options: IAlexaVideoDataOptions | string;
    static key: string;
    static platform: string;
    directive?: interfaces.videoapp.LaunchDirective;
    constructor(options: IAlexaVideoDataOptions | string);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition?: ITransition): Promise<void>;
}
