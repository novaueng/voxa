import { EventBuilder } from "./EventBuilder";
/**
 * Social Game Invite Events Builder class reference
 */
export declare class SocialGameInviteEventBuilder extends EventBuilder {
    game: any;
    invite: any;
    constructor();
    setGame(offer: SOCIAL_GAME_OFFER): SocialGameInviteEventBuilder;
    setInvite(name: string, inviteType: SOCIAL_GAME_INVITE_TYPE, relationshipToInvitee: SOCIAL_GAME_RELATIONSHIP_TO_INVITEE): SocialGameInviteEventBuilder;
    getPayload(): any;
}
export declare enum SOCIAL_GAME_INVITE_TYPE {
    CHALLENGE = "CHALLENGE",
    INVITE = "INVITE"
}
export declare enum SOCIAL_GAME_OFFER {
    GAME = "GAME",
    MATCH = "MATCH",
    REMATCH = "REMATCH"
}
export declare enum SOCIAL_GAME_RELATIONSHIP_TO_INVITEE {
    CONTACT = "CONTACT",
    FRIEND = "FRIEND"
}
