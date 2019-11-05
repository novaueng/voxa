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
const DialogflowPlatform_1 = require("../DialogflowPlatform");
const DialogflowReply_1 = require("../DialogflowReply");
const directives_1 = require("./directives");
const GoogleAssistantEvent_1 = require("./GoogleAssistantEvent");
class GoogleAssistantPlatform extends DialogflowPlatform_1.DialogflowPlatform {
    constructor(app, config = {}) {
        super(app, config);
        this.name = "google";
        this.EventClass = GoogleAssistantEvent_1.GoogleAssistantEvent;
        app.onBeforeReplySent(this.saveStorage, true, this.name);
    }
    getReply() {
        return new DialogflowReply_1.DialogflowReply();
    }
    saveStorage(voxaEvent, reply, transition) {
        const { conv } = voxaEvent.dialogflow;
        const dialogflowReply = reply;
        if (_.isEmpty(conv.user.storage)) {
            dialogflowReply.payload.google.resetUserStorage = true;
            delete dialogflowReply.payload.google.userStorage;
        }
        else {
            dialogflowReply.payload.google.userStorage = conv.user._serialize();
        }
    }
    getDirectiveHandlers() {
        return [
            directives_1.AccountLinkingCard,
            directives_1.BasicCard,
            directives_1.BrowseCarousel,
            directives_1.Carousel,
            directives_1.CompletePurchase,
            directives_1.Confirmation,
            directives_1.Context,
            directives_1.DateTime,
            directives_1.DeepLink,
            directives_1.LinkOutSuggestion,
            directives_1.List,
            directives_1.MediaResponse,
            directives_1.Permission,
            directives_1.NewSurface,
            directives_1.Place,
            directives_1.RegisterUpdate,
            directives_1.Suggestions,
            directives_1.Table,
            directives_1.TransactionDecision,
            directives_1.TransactionRequirements,
            directives_1.UpdatePermission,
            directives_1.Say,
        ];
    }
}
exports.GoogleAssistantPlatform = GoogleAssistantPlatform;
//# sourceMappingURL=GoogleAssistantPlatform.js.map