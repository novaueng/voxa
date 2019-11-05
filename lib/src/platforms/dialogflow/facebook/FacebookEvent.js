"use strict";
/*
 * Copyright (c) 2019 Rain Agency <contact@rain.agency>
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
const _ = require("lodash");
const rp = require("request-promise");
const DialogflowEvent_1 = require("../DialogflowEvent");
class FacebookEvent extends DialogflowEvent_1.DialogflowEvent {
    constructor() {
        super(...arguments);
        this.facebook = {
            passThreadControl: this.passThreadControl.bind(this),
            passThreadControlToPageInbox: this.passThreadControlToPageInbox.bind(this),
            requestThreadControl: this.requestThreadControl.bind(this),
            sendFacebookAction: this.sendFacebookAction.bind(this),
            sendMarkSeenAction: this.sendMarkSeenAction.bind(this),
            sendTypingOffAction: this.sendTypingOffAction.bind(this),
            sendTypingOnAction: this.sendTypingOnAction.bind(this),
            takeThreadControl: this.takeThreadControl.bind(this),
        };
    }
    get supportedInterfaces() {
        // FACEBOOK MESSENGER DOES NOT HAVE INTERFACES
        return [];
    }
    async getUserInformation(userFields) {
        let fields = FACEBOOK_USER_FIELDS.BASIC;
        if (_.isArray(userFields)) {
            fields = _.join(userFields, ",");
        }
        else if (!_.isUndefined(userFields)) {
            fields = userFields.toString();
        }
        const result = await this.getFacebookProfile(fields);
        result.firstName = result.first_name;
        result.lastName = result.last_name;
        result.profilePic = result.profile_pic;
        delete result.first_name;
        delete result.last_name;
        delete result.profile_pic;
        return result;
    }
    initUser() {
        const { originalDetectIntentRequest } = this.rawEvent;
        const userId = _.get(originalDetectIntentRequest, "payload.data.sender.id");
        this.user = {
            id: userId,
            userId,
        };
    }
    async sendFacebookRequest(path, body) {
        const params = {
            json: true,
            method: "GET",
            uri: `https://graph.facebook.com/v3.2/me/${path}?access_token=${this.platform.config.pageAccessToken}`,
        };
        if (body) {
            body.recipient = { id: this.user.id };
            params.body = body;
            params.method = "POST";
        }
        await rp(params);
    }
    async passThreadControl(targetAppId, metadata) {
        const body = {
            target_app_id: targetAppId,
        };
        if (metadata) {
            body.metadata = metadata;
        }
        await this.sendFacebookRequest("pass_thread_control", body);
    }
    async passThreadControlToPageInbox(metadata) {
        await this.passThreadControl(exports.PAGE_INBOX_ID, metadata);
    }
    async sendThreadControlRequest(path, metadata) {
        let body;
        if (metadata) {
            body = { metadata };
        }
        await this.sendFacebookRequest(path, body);
    }
    async requestThreadControl(metadata) {
        await this.sendThreadControlRequest("request_thread_control", metadata);
    }
    async takeThreadControl(metadata) {
        await this.sendThreadControlRequest("take_thread_control", metadata);
    }
    async sendFacebookAction(event) {
        const body = {
            sender_action: event,
        };
        await this.sendFacebookRequest("messages", body);
    }
    async sendMarkSeenAction() {
        await this.sendFacebookAction(FACEBOOK_ACTIONS.MARK_SEEN);
    }
    async sendTypingOnAction() {
        await this.sendFacebookAction(FACEBOOK_ACTIONS.TYPING_ON);
    }
    async sendTypingOffAction() {
        await this.sendFacebookAction(FACEBOOK_ACTIONS.TYPING_OFF);
    }
    getFacebookProfile(fields) {
        const queryStringParams = {
            access_token: this.platform.config.pageAccessToken,
            fields,
        };
        const httpOptions = {
            json: true,
            method: "GET",
            qs: queryStringParams,
            qsStringifyOptions: { encode: false },
            uri: `https://graph.facebook.com/${this.user.id}`,
        };
        return rp(httpOptions);
    }
}
exports.FacebookEvent = FacebookEvent;
/*
 * Checkout https://developers.facebook.com/docs/messenger-platform/handover-protocol/pass-thread-control#page_inbox
 * For more information about passing control from Facebook app to Page Inbox
 */
exports.PAGE_INBOX_ID = "263902037430900";
var FACEBOOK_USER_FIELDS;
(function (FACEBOOK_USER_FIELDS) {
    FACEBOOK_USER_FIELDS["ALL"] = "first_name,gender,id,last_name,locale,name,profile_pic,timezone";
    FACEBOOK_USER_FIELDS["BASIC"] = "first_name,last_name,profile_pic";
    FACEBOOK_USER_FIELDS["FIRST_NAME"] = "first_name";
    FACEBOOK_USER_FIELDS["GENDER"] = "gender";
    FACEBOOK_USER_FIELDS["ID"] = "id";
    FACEBOOK_USER_FIELDS["LAST_NAME"] = "last_name";
    FACEBOOK_USER_FIELDS["LOCALE"] = "locale";
    FACEBOOK_USER_FIELDS["NAME"] = "name";
    FACEBOOK_USER_FIELDS["PROFILE_PIC"] = "profile_pic";
    FACEBOOK_USER_FIELDS["TIMEZONE"] = "timezone";
})(FACEBOOK_USER_FIELDS = exports.FACEBOOK_USER_FIELDS || (exports.FACEBOOK_USER_FIELDS = {}));
var FACEBOOK_ACTIONS;
(function (FACEBOOK_ACTIONS) {
    FACEBOOK_ACTIONS["MARK_SEEN"] = "mark_seen";
    FACEBOOK_ACTIONS["TYPING_ON"] = "typing_on";
    FACEBOOK_ACTIONS["TYPING_OFF"] = "typing_off";
})(FACEBOOK_ACTIONS = exports.FACEBOOK_ACTIONS || (exports.FACEBOOK_ACTIONS = {}));
//# sourceMappingURL=FacebookEvent.js.map