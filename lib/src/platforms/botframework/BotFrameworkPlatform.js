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
const VoxaPlatform_1 = require("../VoxaPlatform");
const BotFrameworkEvent_1 = require("./BotFrameworkEvent");
const BotFrameworkReply_1 = require("./BotFrameworkReply");
const directives_1 = require("./directives");
const CortanaRequests = [
    "conversationUpdate",
    "contactRelationUpdate",
    "message",
];
const toAddress = {
    channelId: "channelId",
    conversation: "conversation",
    from: "user",
    id: "id",
    recipient: "bot",
    serviceUrl: "serviceUrl",
};
class BotFrameworkPlatform extends VoxaPlatform_1.VoxaPlatform {
    constructor(voxaApp, config) {
        super(voxaApp, config);
        this.name = "botframework";
        this.EventClass = BotFrameworkEvent_1.BotFrameworkEvent;
        this.storage = config.storage;
        this.applicationId = config.applicationId;
        this.applicationPassword = config.applicationPassword;
        this.recognize = config.recognize;
    }
    // Botframework requires a lot more headers to work than
    // the other platforms
    lambdaHTTP() {
        const ALLOWED_HEADERS = [
            "Content-Type",
            "X-Amz-Date",
            "Authorization",
            "X-Api-Key",
            "X-Amz-Security-Token",
            "X-Amz-User-Agent",
            "x-ms-client-session-id",
            "x-ms-client-request-id",
            "x-ms-effective-locale",
        ];
        return async (event, context, callback) => {
            const response = {
                body: "{}",
                headers: {
                    "Access-Control-Allow-Headers": ALLOWED_HEADERS.join(","),
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json",
                },
                statusCode: 200,
            };
            if (event.httpMethod !== "POST") {
                return callback(null, response);
            }
            try {
                const body = JSON.parse(event.body || "");
                const result = await this.execute(body, context);
                response.body = JSON.stringify(result);
                return callback(null, response);
            }
            catch (error) {
                return callback(error);
            }
        };
    }
    async execute(rawEvent, context) {
        const reply = await super.execute(rawEvent, context);
        await reply.send();
        return {};
    }
    getReply(event) {
        return new BotFrameworkReply_1.BotFrameworkReply(event);
    }
    async getEvent(rawEvent, context) {
        const message = prepIncomingMessage(rawEvent);
        const stateData = await this.getStateData(rawEvent);
        const intent = await this.recognize(rawEvent);
        const event = new BotFrameworkEvent_1.BotFrameworkEvent({
            intent,
            message,
            stateData,
        }, this.getLogOptions(context), context);
        event.platform = this;
        if (!event.request.locale) {
            event.request.locale = this.config.defaultLocale;
        }
        return event;
    }
    getDirectiveHandlers() {
        return [
            directives_1.HeroCard,
            directives_1.SuggestedActions,
            directives_1.AudioCard,
            directives_1.SigninCard,
            directives_1.Attachments,
            directives_1.AttachmentLayout,
        ];
    }
    getPlatformRequests() {
        return CortanaRequests;
    }
    async getStateData(event) {
        if (!event.address.conversation) {
            throw new Error("Missing conversation address");
        }
        const conversationId = encodeURIComponent(event.address.conversation.id);
        const userId = event.address.bot.id;
        const context = {
            conversationId,
            persistConversationData: false,
            persistUserData: false,
            userId,
        };
        return new Promise((resolve, reject) => {
            this.storage.getData(context, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }
}
exports.BotFrameworkPlatform = BotFrameworkPlatform;
function moveFieldsTo(frm, to, fields) {
    if (frm && to) {
        for (const f in fields) {
            if (frm.hasOwnProperty(f)) {
                if (typeof to[f] === "function") {
                    to[fields[f]](frm[f]);
                }
                else {
                    to[fields[f]] = frm[f];
                }
                delete frm[f];
            }
        }
    }
}
exports.moveFieldsTo = moveFieldsTo;
function prepIncomingMessage(msg) {
    // Patch locale and channelData
    moveFieldsTo(msg, msg, {
        channelData: "sourceEvent",
        locale: "textLocale",
    });
    // Ensure basic fields are there
    msg.text = msg.text || "";
    msg.attachments = msg.attachments || [];
    msg.entities = msg.entities || [];
    // Break out address fields
    const address = {};
    moveFieldsTo(msg, address, toAddress);
    msg.address = address;
    msg.source = address.channelId;
    // Check for facebook quick replies
    if (msg.source === "facebook" &&
        msg.sourceEvent &&
        msg.sourceEvent.message &&
        msg.sourceEvent.message.quick_reply) {
        msg.text = msg.sourceEvent.message.quick_reply.payload;
    }
    return msg;
}
exports.prepIncomingMessage = prepIncomingMessage;
//# sourceMappingURL=BotFrameworkPlatform.js.map