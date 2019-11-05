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
const VoxaReply_1 = require("../../../VoxaReply");
const DialogflowReply_1 = require("../DialogflowReply");
class FacebookReply extends DialogflowReply_1.DialogflowReply {
    constructor() {
        super();
        this.fulfillmentMessages = [];
        this.fulfillmentText = "";
        this.source = "facebook";
        _.unset(this, "payload");
    }
    get speech() {
        return this.fulfillmentText;
    }
    get hasDirectives() {
        const directives = this.getResponseDirectives();
        return !_.isEmpty(directives);
    }
    get hasMessages() {
        return !!this.fulfillmentText;
    }
    get hasTerminated() {
        // WE CAN'T TERMINATE A SESSION IN FACEBOOK MESSENGER
        return false;
    }
    clear() {
        this.fulfillmentMessages = [];
        this.fulfillmentText = "";
    }
    addStatement(statement, isPlain = false) {
        if (isPlain) {
            this.fulfillmentText = VoxaReply_1.addToText(this.fulfillmentText, statement);
            const customFacebookPayload = {
                payload: {
                    facebook: {
                        text: statement,
                    },
                },
            };
            this.fulfillmentMessages.push(customFacebookPayload);
        }
    }
    hasDirective(type) {
        if (!this.hasDirectives) {
            return false;
        }
        const responseDirectives = this.getResponseDirectives();
        if (_.includes(responseDirectives, type)) {
            return true;
        }
        return false;
    }
    addReprompt(reprompt) {
        // FACEBOOK MESSENGER DOES NOT USE REPROMPTS
    }
    terminate() {
        // WE CAN'T TERMINATE A SESSION IN FACEBOOK MESSENGER
    }
    getResponseDirectives() {
        const responseDirectives = _.map(this.fulfillmentMessages, (message) => {
            const quickRepliesKeys = _.map(message.payload.facebook.quick_replies, "content_type");
            const templateType = _.get(message.payload.facebook, "attachment.payload.template_type");
            return _.chain(quickRepliesKeys)
                .concat(templateType)
                .uniq()
                .compact()
                .value();
        });
        return _.flattenDeep(responseDirectives);
    }
}
exports.FacebookReply = FacebookReply;
//# sourceMappingURL=FacebookReply.js.map