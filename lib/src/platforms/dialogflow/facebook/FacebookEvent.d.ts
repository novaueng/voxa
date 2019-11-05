import { IVoxaUserProfile } from "../../../VoxaEvent";
import { DialogflowEvent } from "../DialogflowEvent";
export declare class FacebookEvent extends DialogflowEvent {
    facebook: {
        passThreadControl: (targetAppId: string, metadata?: string | undefined) => Promise<void>;
        passThreadControlToPageInbox: (metadata?: string | undefined) => Promise<void>;
        requestThreadControl: (metadata?: string | undefined) => Promise<void>;
        sendFacebookAction: (event: FACEBOOK_ACTIONS) => Promise<void>;
        sendMarkSeenAction: () => Promise<void>;
        sendTypingOffAction: () => Promise<void>;
        sendTypingOnAction: () => Promise<void>;
        takeThreadControl: (metadata?: string | undefined) => Promise<void>;
    };
    readonly supportedInterfaces: string[];
    getUserInformation(userFields?: FACEBOOK_USER_FIELDS | FACEBOOK_USER_FIELDS[]): Promise<IVoxaFacebookUserProfile>;
    protected initUser(): void;
    private sendFacebookRequest;
    private passThreadControl;
    private passThreadControlToPageInbox;
    private sendThreadControlRequest;
    private requestThreadControl;
    private takeThreadControl;
    private sendFacebookAction;
    private sendMarkSeenAction;
    private sendTypingOnAction;
    private sendTypingOffAction;
    private getFacebookProfile;
}
export declare const PAGE_INBOX_ID = "263902037430900";
export declare enum FACEBOOK_USER_FIELDS {
    ALL = "first_name,gender,id,last_name,locale,name,profile_pic,timezone",
    BASIC = "first_name,last_name,profile_pic",
    FIRST_NAME = "first_name",
    GENDER = "gender",
    ID = "id",
    LAST_NAME = "last_name",
    LOCALE = "locale",
    NAME = "name",
    PROFILE_PIC = "profile_pic",
    TIMEZONE = "timezone"
}
export declare enum FACEBOOK_ACTIONS {
    MARK_SEEN = "mark_seen",
    TYPING_ON = "typing_on",
    TYPING_OFF = "typing_off"
}
export interface IVoxaFacebookUserProfile extends IVoxaUserProfile {
    firstName: string;
    lastName: string;
    profilePic: string;
    locale: string;
    timezone: number;
    gender: string;
}
