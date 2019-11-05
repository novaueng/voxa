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
const google_auth_library_1 = require("google-auth-library");
const _ = require("lodash");
const uuid_1 = require("uuid");
const DialogflowEvent_1 = require("../DialogflowEvent");
const DigitalGoods_1 = require("./apis/DigitalGoods");
class GoogleAssistantEvent extends DialogflowEvent_1.DialogflowEvent {
    constructor(rawEvent, logOptions, executionContext) {
        super(rawEvent, logOptions, executionContext);
    }
    async verifyProfile() {
        const client = new google_auth_library_1.OAuth2Client(this.platform.config.clientId);
        const payload = await this.dialogflow.conv.user._verifyProfile(client, this.platform.config.clientId);
        return payload;
    }
    async getUserInformation() {
        const voxaEvent = _.cloneDeep(this);
        const dialogflowUser = this.dialogflow.conv.user;
        if (!dialogflowUser.profile.token) {
            throw new Error("conv.user.profile.token is empty");
        }
        const result = await this.verifyProfile();
        result.emailVerified = result.email_verified;
        result.familyName = result.family_name;
        result.givenName = result.given_name;
        delete result.email_verified;
        delete result.family_name;
        delete result.given_name;
        return result;
    }
    afterPlatformInitialized() {
        this.google = {
            digitalGoods: new DigitalGoods_1.DigitalGoods(this.rawEvent, this.log, this.platform.config.transactionOptions),
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
        const storage = conv.user.storage;
        let userId = "";
        if (conv.user.id) {
            userId = conv.user.id;
        }
        else if (_.get(storage, "voxa.userId")) {
            userId = storage.voxa.userId;
        }
        else {
            userId = uuid_1.v1();
        }
        _.set(this.dialogflow.conv.user.storage, "voxa.userId", userId);
        return userId;
    }
}
exports.GoogleAssistantEvent = GoogleAssistantEvent;
//# sourceMappingURL=GoogleAssistantEvent.js.map