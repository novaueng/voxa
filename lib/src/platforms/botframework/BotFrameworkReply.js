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
const urljoin = require("url-join");
const uuid = require("uuid");
const errors_1 = require("../../errors");
const VoxaReply_1 = require("../../VoxaReply");
class BotFrameworkReply {
    constructor(event) {
        this.event = event;
        this.speak = "";
        this.text = "";
        this.textFormat = "plain";
        this.type = "message";
        this.channelId = event.rawEvent.message.address.channelId;
        if (!event.session) {
            throw new Error("event.session is missing");
        }
        this.conversation = { id: event.session.sessionId };
        this.from = { id: event.rawEvent.message.address.bot.id };
        this.inputHint = "ignoringInput";
        this.locale = event.request.locale;
        if (!event.user) {
            throw new Error("event.user is missing");
        }
        this.recipient = {
            id: event.user.id,
        };
        if (event.user.name) {
            this.recipient.name = event.user.name;
        }
        this.replyToId = event.rawEvent.message
            .address.id;
        this.timestamp = new Date().toISOString();
    }
    get hasMessages() {
        return !!this.speak || !!this.text;
    }
    get hasDirectives() {
        return !!this.attachments || !!this.suggestedActions;
    }
    get hasTerminated() {
        return this.inputHint === "acceptingInput";
    }
    get speech() {
        if (!this.speak) {
            return "";
        }
        return this.speak;
    }
    toJSON() {
        return _.omit(this, "event");
    }
    clear() {
        this.attachments = undefined;
        this.suggestedActions = undefined;
        this.text = "";
        this.speak = "";
    }
    terminate() {
        this.inputHint = "acceptingInput";
    }
    addStatement(statement, isPlain = false) {
        if (this.inputHint === "ignoringInput") {
            this.inputHint = "expectingInput";
        }
        if (isPlain) {
            this.text = VoxaReply_1.addToText(this.text, statement);
        }
        else {
            this.speak = VoxaReply_1.addToSSML(this.speak, statement);
        }
    }
    hasDirective(type) {
        throw new errors_1.NotImplementedError("hasDirective");
    }
    addReprompt(reprompt) {
        return;
    }
    async send() {
        this.event.log.debug("partialReply", {
            hasDirectives: this.hasDirectives,
            hasMessages: this.hasMessages,
            sendingPartialReply: !(!this.hasMessages && !this.hasDirectives),
        });
        if (!this.hasMessages && !this.hasDirectives) {
            return;
        }
        const uri = this.getReplyUri(this.event.rawEvent.message);
        this.id = uuid.v1();
        await this.botApiRequest("POST", uri, _.clone(this), this.event);
        this.clear();
    }
    async botApiRequest(method, uri, reply, event, attempts = 0) {
        let authorization;
        const platform = event.platform;
        authorization = await this.getAuthorization(platform.applicationId, platform.applicationPassword);
        const requestOptions = {
            auth: {
                bearer: authorization.access_token,
            },
            body: this,
            json: true,
            method,
            uri,
        };
        event.log.debug("botApiRequest", { requestOptions });
        return rp(requestOptions);
    }
    getReplyUri(event) {
        const address = event.address;
        const baseUri = address.serviceUrl;
        if (!baseUri || !address.conversation) {
            throw new Error("serviceUrl is missing");
        }
        const conversationId = encodeURIComponent(address.conversation.id);
        let path = `/v3/conversations/${conversationId}/activities`;
        if (address.id) {
            path += "/" + encodeURIComponent(address.id);
        }
        return urljoin(baseUri, path);
    }
    async getAuthorization(applicationId, applicationPassword) {
        const url = "https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token";
        const requestOptions = {
            form: {
                client_id: applicationId,
                client_secret: applicationPassword,
                grant_type: "client_credentials",
                scope: "https://api.botframework.com/.default",
            },
            json: true,
            method: "POST",
            url,
        };
        return (await rp(requestOptions));
    }
    async saveSession(attributes, event) {
        const storage = event.platform.storage;
        const conversationId = encodeURIComponent(event.session.sessionId);
        const userId = event.rawEvent.message.address.bot.id;
        const context = {
            conversationId,
            persistConversationData: false,
            persistUserData: false,
            userId,
        };
        const data = {
            conversationData: {},
            // we're only gonna handle private conversation data, this keeps the code small
            // and more importantly it makes it so the programming model is the same between
            // the different platforms
            privateConversationData: attributes,
            userData: {},
        };
        await new Promise((resolve, reject) => {
            storage.saveData(context, data, (error) => {
                if (error) {
                    return reject(error);
                }
                event.log.debug("savedStateData", { data, context });
                return resolve();
            });
        });
    }
}
exports.BotFrameworkReply = BotFrameworkReply;
//# sourceMappingURL=BotFrameworkReply.js.map