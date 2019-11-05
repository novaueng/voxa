"use strict";
/*
 * Copyright (c) 2018 Rain Agency <contact@rain.agency>
 * Author: Rain Agency <contact@rain.agency>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const EventBuilder_1 = require("./EventBuilder");
/**
 * Social Game Invite Events Builder class reference
 */
class SocialGameInviteEventBuilder extends EventBuilder_1.EventBuilder {
    constructor() {
        super("AMAZON.SocialGameInvite.Available");
        this.game = {};
        this.invite = {};
    }
    setGame(offer) {
        this.game = {
            name: "localizedattribute:gameName",
            offer,
        };
        return this;
    }
    setInvite(name, inviteType, relationshipToInvitee) {
        this.invite = {
            inviteType,
            inviter: {
                name,
            },
            relationshipToInvitee,
        };
        return this;
    }
    getPayload() {
        return {
            game: this.game,
            invite: this.invite,
        };
    }
}
exports.SocialGameInviteEventBuilder = SocialGameInviteEventBuilder;
var SOCIAL_GAME_INVITE_TYPE;
(function (SOCIAL_GAME_INVITE_TYPE) {
    SOCIAL_GAME_INVITE_TYPE["CHALLENGE"] = "CHALLENGE";
    SOCIAL_GAME_INVITE_TYPE["INVITE"] = "INVITE";
})(SOCIAL_GAME_INVITE_TYPE = exports.SOCIAL_GAME_INVITE_TYPE || (exports.SOCIAL_GAME_INVITE_TYPE = {}));
var SOCIAL_GAME_OFFER;
(function (SOCIAL_GAME_OFFER) {
    SOCIAL_GAME_OFFER["GAME"] = "GAME";
    SOCIAL_GAME_OFFER["MATCH"] = "MATCH";
    SOCIAL_GAME_OFFER["REMATCH"] = "REMATCH";
})(SOCIAL_GAME_OFFER = exports.SOCIAL_GAME_OFFER || (exports.SOCIAL_GAME_OFFER = {}));
var SOCIAL_GAME_RELATIONSHIP_TO_INVITEE;
(function (SOCIAL_GAME_RELATIONSHIP_TO_INVITEE) {
    SOCIAL_GAME_RELATIONSHIP_TO_INVITEE["CONTACT"] = "CONTACT";
    SOCIAL_GAME_RELATIONSHIP_TO_INVITEE["FRIEND"] = "FRIEND";
})(SOCIAL_GAME_RELATIONSHIP_TO_INVITEE = exports.SOCIAL_GAME_RELATIONSHIP_TO_INVITEE || (exports.SOCIAL_GAME_RELATIONSHIP_TO_INVITEE = {}));
//# sourceMappingURL=SocialGameInviteEventBuilder.js.map