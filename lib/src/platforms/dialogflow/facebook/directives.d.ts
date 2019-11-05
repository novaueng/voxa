import { IDirective, IDirectiveClass } from "../../../directives";
import { ITransition } from "../../../StateMachine";
import { IVoxaEvent } from "../../../VoxaEvent";
import { IVoxaReply } from "../../../VoxaReply";
export declare class FacebookAccountLink implements IDirective {
    url: string;
    static platform: string;
    static key: string;
    constructor(url: string);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition?: ITransition): Promise<void>;
    private getFacebookPayload;
}
export declare class FacebookAccountUnlink implements IDirective {
    static platform: string;
    static key: string;
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition?: ITransition): Promise<void>;
}
export declare class FacebookSuggestionChips implements IDirective {
    suggestions: string | string[];
    static platform: string;
    static key: string;
    constructor(suggestions: string | string[]);
    writeToReply(reply: IVoxaReply, event: IVoxaEvent, transition?: ITransition): Promise<void>;
    private getSuggestionChips;
}
export interface IFacebookQuickReply {
    imageUrl: string;
    title: string;
    payload: string;
}
export declare const FacebookQuickReplyLocation: IDirectiveClass;
export declare const FacebookQuickReplyPhoneNumber: IDirectiveClass;
export declare const FacebookQuickReplyText: IDirectiveClass;
export declare const FacebookQuickReplyUserEmail: IDirectiveClass;
export declare enum FACEBOOK_BUTTONS {
    ACCOUNT_LINK = "account_link",
    ACCOUNT_UNLINK = "account_unlink",
    ELEMENT_SHARE = "element_share",
    GAME_PLAY = "game_play",
    PAYMENT = "payment",
    PHONE_NUMBER = "phone_number",
    POSTBACK = "postback",
    WEB_URL = "web_url"
}
export declare enum FACEBOOK_IMAGE_ASPECT_RATIO {
    HORIZONTAL = "horizontal",
    SQUARE = "square"
}
export declare enum FACEBOOK_WEBVIEW_HEIGHT_RATIO {
    COMPACT = "compact",
    TALL = "tall",
    FULL = "full"
}
export declare enum FACEBOOK_TOP_ELEMENT_STYLE {
    COMPACT = "compact",
    LARGE = "large"
}
export interface IFacebookGenericButtonTemplate {
    fallbackUrl?: string;
    messengerExtensions?: boolean;
    payload?: string;
    title: string;
    type: FACEBOOK_BUTTONS;
    url?: string;
    webviewHeightRatio?: FACEBOOK_WEBVIEW_HEIGHT_RATIO;
}
export interface IFacebookElementTemplate {
    buttons?: IFacebookGenericButtonTemplate[];
    imageUrl?: string;
    subtitle?: string;
    title?: string;
    defaultActionUrl?: string;
    defaultActionFallbackUrl?: string;
    defaultMessengerExtensions?: boolean;
    defaultWebviewHeightRatio?: FACEBOOK_WEBVIEW_HEIGHT_RATIO;
    sharable?: boolean;
    url?: string;
}
export interface IFacebookPayloadTemplate {
    buttons?: IFacebookGenericButtonTemplate[];
    elements?: IFacebookElementTemplate[];
    imageAspectRatio?: FACEBOOK_IMAGE_ASPECT_RATIO;
    sharable?: boolean;
    text?: string;
    topElementStyle?: FACEBOOK_TOP_ELEMENT_STYLE;
}
export interface IVoxaFacebookGenericButtonTemplate {
    fallback_url?: string;
    messenger_extensions?: boolean;
    payload?: string;
    title: string;
    type: FACEBOOK_BUTTONS;
    url?: string;
    webview_height_ratio?: FACEBOOK_WEBVIEW_HEIGHT_RATIO;
}
export interface IVoxaFacebookElementTemplate {
    buttons?: IFacebookGenericButtonTemplate[];
    default_action?: {
        fallback_url?: string;
        messenger_extensions?: boolean;
        type?: FACEBOOK_BUTTONS;
        url?: string;
        webview_height_ratio?: FACEBOOK_WEBVIEW_HEIGHT_RATIO;
    };
    image_url?: string;
    subtitle?: string;
    title?: string;
    sharable?: boolean;
    url?: string;
}
export interface IVoxaFacebookPayloadTemplate {
    buttons?: IFacebookGenericButtonTemplate[];
    elements?: IFacebookElementTemplate[];
    image_aspect_ratio?: FACEBOOK_IMAGE_ASPECT_RATIO;
    sharable?: boolean;
    template_type: string;
    text?: string;
    top_element_style?: FACEBOOK_TOP_ELEMENT_STYLE;
}
export declare const FacebookButtonTemplate: IDirectiveClass;
export declare const FacebookCarousel: IDirectiveClass;
export declare const FacebookList: IDirectiveClass;
export declare const FacebookOpenGraphTemplate: IDirectiveClass;
