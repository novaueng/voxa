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
const _ = require("lodash");
const rp = require("request-promise");
const VoxaEvent_1 = require("../../VoxaEvent");
const AlexaIntent_1 = require("./AlexaIntent");
const apis_1 = require("./apis");
const utils_1 = require("./utils");
class AlexaEvent extends VoxaEvent_1.VoxaEvent {
    constructor(rawEvent, logOptions, executionContext) {
        super(rawEvent, logOptions, executionContext);
        this.requestToIntent = {
            "Alexa.Presentation.APL.UserEvent": "Alexa.Presentation.APL.UserEvent",
            "Connections.Response": "Connections.Response",
            "Display.ElementSelected": "Display.ElementSelected",
            "GameEngine.InputHandlerEvent": "GameEngine.InputHandlerEvent",
            "LaunchRequest": "LaunchIntent",
        };
        const locale = utils_1.isLocalizedRequest(rawEvent.request)
            ? rawEvent.request.locale
            : "en-us";
        this.request = {
            locale,
            type: rawEvent.request.type,
        };
        this.initIntents();
        this.mapRequestToIntent();
        this.initApis();
        this.initUser();
    }
    get token() {
        return _.get(this.rawEvent, "request.token");
    }
    get supportedInterfaces() {
        const interfaces = _.get(this.rawEvent, "context.System.device.supportedInterfaces", {});
        return _.keys(interfaces);
    }
    async getUserInformation() {
        if (!this.user.accessToken) {
            throw new Error("this.user.accessToken is empty");
        }
        const httpOptions = {
            json: true,
            method: "GET",
            uri: `https://api.amazon.com/user/profile?access_token=${this.user.accessToken}`,
        };
        const result = await rp(httpOptions);
        result.zipCode = result.postal_code;
        result.userId = result.user_id;
        delete result.postal_code;
        delete result.user_id;
        return result;
    }
    initUser() {
        const user = _.get(this.rawEvent, "session.user") ||
            _.get(this.rawEvent, "context.System.user");
        if (!user) {
            return;
        }
        this.user = {
            accessToken: user.accessToken,
            id: user.userId,
            userId: user.userId,
        };
    }
    initApis() {
        this.alexa = {
            customerContact: new apis_1.CustomerContact(this.rawEvent, this.log),
            deviceAddress: new apis_1.DeviceAddress(this.rawEvent, this.log),
            deviceSettings: new apis_1.DeviceSettings(this.rawEvent, this.log),
            isp: new apis_1.InSkillPurchase(this.rawEvent, this.log),
            lists: new apis_1.Lists(this.rawEvent, this.log),
            reminders: new apis_1.Reminders(this.rawEvent, this.log),
        };
    }
    initSession() {
        this.session = {
            attributes: _.get(this.rawEvent, "session.attributes", {}),
            new: _.get(this.rawEvent, "session.new", false),
            outputAttributes: {},
            sessionId: _.get(this.rawEvent, "session.sessionId", ""),
        };
    }
    initIntents() {
        const { request } = this.rawEvent;
        if (isIntentRequest(request)) {
            this.intent = new AlexaIntent_1.AlexaIntent(request.intent);
        }
    }
}
exports.AlexaEvent = AlexaEvent;
function isIntentRequest(request) {
    return (request.type === "IntentRequest" ||
        request.type === "CanFulfillIntentRequest");
}
//# sourceMappingURL=AlexaEvent.js.map