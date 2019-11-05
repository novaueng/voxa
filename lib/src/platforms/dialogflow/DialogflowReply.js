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
const VoxaReply_1 = require("../../VoxaReply");
class DialogflowReply {
    constructor() {
        this.outputContexts = [];
        this.fulfillmentText = "";
        this.source = "google";
        this.sessionEntityTypes = [];
        this.payload = {
            google: {
                expectUserResponse: true,
                isSsml: true,
                userStorage: {},
            },
        };
    }
    async saveSession(attributes, event) {
        const dialogflowEvent = event;
        const serializedData = JSON.stringify(attributes);
        dialogflowEvent.dialogflow.conv.contexts.set("attributes", 10000, {
            attributes: serializedData,
        });
        this.outputContexts = dialogflowEvent.dialogflow.conv.contexts._serialize();
    }
    get speech() {
        const richResponse = this.payload.google.richResponse;
        if (!richResponse) {
            return "";
        }
        return _(richResponse.items)
            .filter((item) => !!item.simpleResponse)
            .map("simpleResponse.textToSpeech")
            .value()
            .join("\n");
    }
    get hasMessages() {
        return !!this.getSimpleResponse().textToSpeech;
    }
    get hasDirectives() {
        // all system intents are directives
        if (this.payload.google.systemIntent) {
            return true;
        }
        const richResponse = this.payload.google.richResponse;
        if (!richResponse) {
            return false;
        }
        // any rich response item that's not a SimpleResponse counts as a directive
        const directives = this.getRichResponseDirectives();
        return !!_.pull(directives, "SimpleResponse").length;
    }
    get hasTerminated() {
        return !this.payload.google.expectUserResponse;
    }
    clear() {
        delete this.payload.google.richResponse;
        this.payload.google.noInputPrompts = [];
        this.fulfillmentText = "";
    }
    terminate() {
        this.payload.google.expectUserResponse = false;
    }
    addStatement(statement, isPlain = false) {
        const simpleResponse = this.getSimpleResponse();
        if (isPlain) {
            this.fulfillmentText = VoxaReply_1.addToText(this.fulfillmentText, statement);
            simpleResponse.displayText = VoxaReply_1.addToText(simpleResponse.displayText, statement);
        }
        else {
            simpleResponse.textToSpeech = VoxaReply_1.addToSSML(simpleResponse.textToSpeech, statement);
        }
    }
    addSessionEntity(sessionEntity) {
        const sessionEntityTypes = this.sessionEntityTypes || [];
        sessionEntityTypes.push(sessionEntity);
        this.sessionEntityTypes = sessionEntityTypes;
    }
    hasDirective(type) {
        if (!this.hasDirectives) {
            return false;
        }
        const richResponseDirectives = this.getRichResponseDirectives();
        if (_.includes(richResponseDirectives, type)) {
            return true;
        }
        const systemIntent = this.payload.google.systemIntent;
        if (systemIntent) {
            if (systemIntent.intent === type) {
                return true;
            }
        }
        return false;
    }
    addReprompt(reprompt) {
        const noInputPrompts = this.payload.google.noInputPrompts || [];
        noInputPrompts.push({
            textToSpeech: reprompt,
        });
        this.payload.google.noInputPrompts = noInputPrompts;
    }
    getRichResponseDirectives() {
        const richResponse = this.payload.google.richResponse;
        if (!richResponse) {
            return [];
        }
        return _(richResponse.items)
            .map(_.values)
            .flatten()
            .map((item) => item.constructor.name)
            .value();
    }
    getSimpleResponse() {
        const richResponse = this.payload.google.richResponse || new actions_on_google_1.RichResponse();
        this.payload.google.richResponse = richResponse;
        const simpleResponseItem = _.findLast(richResponse.items, (item) => !!item.simpleResponse);
        if (simpleResponseItem && simpleResponseItem.simpleResponse) {
            return simpleResponseItem.simpleResponse;
        }
        const simpleResponse = new actions_on_google_1.SimpleResponse("");
        richResponse.add(simpleResponse);
        return simpleResponse;
    }
}
exports.DialogflowReply = DialogflowReply;
//# sourceMappingURL=DialogflowReply.js.map