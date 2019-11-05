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
const actions_on_google_1 = require("actions-on-google");
const _ = require("lodash");
const uuid_1 = require("uuid");
const VoxaEvent_1 = require("../../VoxaEvent");
const DialogflowIntent_1 = require("./DialogflowIntent");
const DialogflowSession_1 = require("./DialogflowSession");
class DialogflowEvent extends VoxaEvent_1.VoxaEvent {
    constructor(rawEvent, logOptions, executionContext) {
        super(rawEvent, logOptions, executionContext);
        this.request = {
            locale: _.get(rawEvent.queryResult, "languageCode") || "",
            type: "IntentRequest",
        };
        this.intent = new DialogflowIntent_1.DialogflowIntent(this.dialogflow.conv);
    }
    async getUserInformation() {
        return undefined;
    }
    initSession() {
        this.dialogflow = {
            conv: new actions_on_google_1.DialogflowConversation({
                body: this.rawEvent,
                headers: {},
            }),
        };
        this.session = new DialogflowSession_1.DialogflowSession(this.dialogflow.conv);
    }
    initUser() {
        const { conv } = this.dialogflow;
        const userId = this.getUserId(conv);
        this.user = {
            accessToken: conv.user.access.token,
            id: userId,
            userId,
        };
    }
    /**
     * conv.user.id is a deprecated feature that will be removed soon
     * this makes it so skills using voxa are future proof
     *
     * We use conv.user.id if it's available, but we store it in userStorage,
     * If there's no conv.user.id we generate a uuid.v1 and store it in userStorage
     *
     * After that we'll default to the userStorage value
     */
    getUserId(conv) {
        let userId = "";
        if (conv.user.id) {
            userId = conv.user.id;
        }
        else {
            userId = uuid_1.v1();
        }
        return userId;
    }
    get supportedInterfaces() {
        let capabilities = _.map(this.dialogflow.conv.surface.capabilities.list, "name");
        capabilities = _.filter(capabilities);
        return capabilities;
    }
}
exports.DialogflowEvent = DialogflowEvent;
//# sourceMappingURL=DialogflowEvent.js.map