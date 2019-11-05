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
const lambda_log_1 = require("lambda-log");
const _ = require("lodash");
class VoxaEvent {
    constructor(rawEvent, logOptions = {}, executionContext) {
        this.executionContext = executionContext;
        this.requestToIntent = {};
        this.requestToRequest = {};
        this.rawEvent = _.cloneDeep(rawEvent);
        this.initSession();
        this.initUser();
        this.initLogger(logOptions);
    }
    mapRequestToRequest() {
        const requestType = this.request.type;
        const newRequestType = this.requestToRequest[requestType];
        if (!newRequestType) {
            return;
        }
        this.request.type = newRequestType;
    }
    mapRequestToIntent() {
        const requestType = this.request.type;
        const intentName = this.requestToIntent[requestType];
        if (!intentName) {
            return;
        }
        this.intent = {
            name: intentName,
            params: {},
        };
        this.request.type = "IntentRequest";
    }
    initLogger(logOptions) {
        logOptions = _.cloneDeep(logOptions);
        _.set(logOptions, "meta.sessionId", this.session.sessionId);
        this.log = new lambda_log_1.LambdaLog(logOptions);
    }
}
exports.VoxaEvent = VoxaEvent;
//# sourceMappingURL=VoxaEvent.js.map