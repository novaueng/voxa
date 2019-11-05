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
 * Message Alert Events Builder class reference
 */
class MessageAlertEventBuilder extends EventBuilder_1.EventBuilder {
    constructor() {
        super("AMAZON.MessageAlert.Activated");
        this.messageGroup = {};
        this.state = {};
    }
    setMessageGroup(creatorName, count, urgency) {
        this.messageGroup = {
            count,
            creator: { name: creatorName },
            urgency,
        };
        return this;
    }
    setState(status, freshness) {
        this.state = { status, freshness };
        return this;
    }
    getPayload() {
        return {
            messageGroup: this.messageGroup,
            state: this.state,
        };
    }
}
exports.MessageAlertEventBuilder = MessageAlertEventBuilder;
var MESSAGE_ALERT_FRESHNESS;
(function (MESSAGE_ALERT_FRESHNESS) {
    MESSAGE_ALERT_FRESHNESS["NEW"] = "NEW";
    MESSAGE_ALERT_FRESHNESS["OVERDUE"] = "OVERDUE";
})(MESSAGE_ALERT_FRESHNESS = exports.MESSAGE_ALERT_FRESHNESS || (exports.MESSAGE_ALERT_FRESHNESS = {}));
var MESSAGE_ALERT_STATUS;
(function (MESSAGE_ALERT_STATUS) {
    MESSAGE_ALERT_STATUS["FLAGGED"] = "FLAGGED";
    MESSAGE_ALERT_STATUS["UNREAD"] = "UNREAD";
})(MESSAGE_ALERT_STATUS = exports.MESSAGE_ALERT_STATUS || (exports.MESSAGE_ALERT_STATUS = {}));
var MESSAGE_ALERT_URGENCY;
(function (MESSAGE_ALERT_URGENCY) {
    MESSAGE_ALERT_URGENCY["URGENT"] = "URGENT";
})(MESSAGE_ALERT_URGENCY = exports.MESSAGE_ALERT_URGENCY || (exports.MESSAGE_ALERT_URGENCY = {}));
//# sourceMappingURL=MessageAlertEventBuilder.js.map