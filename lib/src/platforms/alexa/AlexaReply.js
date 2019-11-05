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
const VoxaReply_1 = require("../../VoxaReply");
class AlexaReply {
    constructor() {
        this.version = "1.0";
        this.response = {};
        this.sessionAttributes = {};
    }
    get hasMessages() {
        return !!this.response.outputSpeech;
    }
    get hasDirectives() {
        if (this.response.card) {
            return true;
        }
        if (!!this.response.directives) {
            return true;
        }
        return false;
    }
    get hasTerminated() {
        return !!this.response && !!this.response.shouldEndSession;
    }
    async saveSession(attributes, event) {
        this.sessionAttributes = attributes;
    }
    terminate() {
        if (!this.response) {
            this.response = {};
        }
        if (this.hasDirective("VideoApp.Launch") ||
            this.hasDirective("GameEngine.StartInputHandler")) {
            delete this.response.shouldEndSession;
        }
        else {
            this.response.shouldEndSession = true;
        }
    }
    get speech() {
        return _.get(this.response, "outputSpeech.ssml", "");
    }
    get reprompt() {
        return _.get(this.response, "reprompt.outputSpeech.ssml", "");
    }
    addStatement(statement, isPlain = false) {
        if (!("shouldEndSession" in this.response)) {
            this.response.shouldEndSession = false;
        }
        if (isPlain) {
            return;
        }
        let ssml = _.get(this.response, "outputSpeech.ssml", "<speak></speak>");
        ssml = VoxaReply_1.addToSSML(ssml, statement);
        this.response.outputSpeech = {
            ssml,
            type: "SSML",
        };
    }
    addReprompt(statement, isPlain = false) {
        const type = "SSML";
        let ssml = _.get(this.response.reprompt, "outputSpeech.ssml", "<speak></speak>");
        ssml = VoxaReply_1.addToSSML(ssml, statement);
        this.response.reprompt = {
            outputSpeech: {
                ssml,
                type,
            },
        };
    }
    fulfillIntent(canFulfill) {
        this.response.card = undefined;
        this.response.reprompt = undefined;
        this.response.outputSpeech = undefined;
        if (!_.includes(["YES", "NO", "MAYBE"], canFulfill)) {
            this.response.canFulfillIntent = { canFulfill: "NO" };
        }
        else {
            this.response.canFulfillIntent = { canFulfill };
        }
    }
    fulfillSlot(slotName, canUnderstand, canFulfill) {
        if (!_.includes(["YES", "NO", "MAYBE"], canUnderstand)) {
            canUnderstand = "NO";
        }
        if (!_.includes(["YES", "NO"], canFulfill)) {
            canFulfill = "NO";
        }
        this.response.canFulfillIntent = this.response.canFulfillIntent || {
            canFulfill: "NO",
        };
        this.response.canFulfillIntent.slots =
            this.response.canFulfillIntent.slots || {};
        this.response.canFulfillIntent.slots[slotName] = {
            canFulfill,
            canUnderstand,
        };
    }
    clear() {
        this.response = {};
    }
    hasDirective(type) {
        if (!this.hasDirectives) {
            return false;
        }
        let allDirectives = this.response.directives || [];
        if (this.response.card) {
            allDirectives = _.concat(allDirectives, {
                card: this.response.card,
                type: "card",
            });
        }
        return allDirectives.some((directive) => {
            if (_.isRegExp(type)) {
                return !!type.exec(directive.type);
            }
            if (_.isString(type)) {
                return type === directive.type;
            }
            throw new Error(`Do not know how to use a ${typeof type} to find a directive`);
        });
    }
}
exports.AlexaReply = AlexaReply;
//# sourceMappingURL=AlexaReply.js.map