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
const chai_1 = require("chai");
const _ = require("lodash");
const dialogflow_1 = require("../../src/platforms/dialogflow");
/* tslint:disable-next-line:no-var-requires */
const rawEvent = require("../requests/dialogflow/launchIntent.json");
describe("FacebookReply", () => {
    let reply;
    beforeEach(() => {
        reply = new dialogflow_1.FacebookReply();
    });
    describe("hasTerminated", () => {
        it("should return false for a new reply", () => {
            chai_1.expect(reply.hasTerminated).to.be.false;
        });
        it("should return true after a call to reply.terminate", () => {
            reply.terminate();
            chai_1.expect(reply.hasTerminated).to.be.false;
        });
    });
    describe("hasDirective", () => {
        it("should return false for a new reply", () => {
            chai_1.expect(reply.hasDirective("whatever")).to.be.false;
        });
        it("should return false for a reply with a directive not found", () => {
            const facebookPayload = {
                payload: {
                    facebook: {},
                },
            };
            _.set(facebookPayload.payload.facebook, "quick_replies", [{ content_type: "Email" }]);
            reply.fulfillmentMessages.push(facebookPayload);
            chai_1.expect(reply.hasDirective("Location")).to.be.false;
        });
        it("should return true for a reply with a directive", () => {
            const facebookPayload = {
                payload: {
                    facebook: {},
                },
            };
            _.set(facebookPayload.payload.facebook, "quick_replies", [{ content_type: "Location" }]);
            reply.fulfillmentMessages.push(facebookPayload);
            chai_1.expect(reply.hasDirective("Location")).to.be.true;
        });
    });
    describe("hasDirectives", () => {
        it("should return false for a new reply", () => {
            chai_1.expect(reply.hasDirectives).to.be.false;
        });
        it("should return false for a reply with just a simple response", () => {
            reply.addStatement("Hello World");
            chai_1.expect(reply.hasDirectives).to.be.false;
        });
    });
    describe("speech", () => {
        it("should return an empty string for a new reply", () => {
            chai_1.expect(reply.speech).to.equal("");
        });
        it("should return an empty string for a reply without a simple response", () => {
            const facebookPayload = {
                payload: {
                    facebook: {},
                },
            };
            _.set(facebookPayload.payload.facebook, "text", "");
            reply.fulfillmentMessages.push(facebookPayload);
            chai_1.expect(reply.speech).to.equal("");
        });
    });
    describe("hasMessages", () => {
        it("should return false for a new reply", () => {
            chai_1.expect(reply.hasMessages).to.be.false;
        });
    });
    describe("addStatement", () => {
        it("should add to both the speech and richResponse", () => {
            reply.addStatement("THIS IS A TEST", true);
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal("THIS IS A TEST");
            chai_1.expect(reply.fulfillmentText).to.equal("THIS IS A TEST");
            chai_1.expect(reply.speech).to.equal("THIS IS A TEST");
        });
        it("should not add speech", () => {
            reply.addStatement("THIS IS A TEST");
            chai_1.expect(_.get(reply, "fulfillmentMessages[0].payload.facebook.text")).to.be.undefined;
            chai_1.expect(reply.fulfillmentText).to.equal("");
            chai_1.expect(reply.speech).to.equal("");
        });
    });
    describe("clear", () => {
        it("should empty the rich response, speech and reprompts", () => {
            reply.addStatement("THIS IS A TEST");
            reply.clear();
            chai_1.expect(_.get(reply, "fulfillmentMessages[0].payload.facebook.attachment")).to.be.undefined;
            chai_1.expect(_.get(reply, "fulfillmentMessages[0].payload.facebook.quick_replies")).to.be.undefined;
            chai_1.expect(_.get(reply, "fulfillmentMessages[0].payload.facebook.text")).to.be.undefined;
            chai_1.expect(reply.fulfillmentText).to.equal("");
            chai_1.expect(reply.speech).to.be.empty;
        });
    });
});
describe("DialogflowReply", () => {
    let reply;
    beforeEach(() => {
        reply = new dialogflow_1.DialogflowReply();
    });
    describe("hasTerminated", () => {
        it("should return false for a new reply", () => {
            chai_1.expect(reply.hasTerminated).to.be.false;
        });
        it("should return true after a call to reply.terminate", () => {
            reply.terminate();
            chai_1.expect(reply.hasTerminated).to.be.true;
        });
    });
    describe("hasDirectives", () => {
        it("should return false for a new reply", () => {
            chai_1.expect(reply.hasDirectives).to.be.false;
        });
        it("should return false for a reply with just a simple response", () => {
            reply.addStatement("Hello World");
            chai_1.expect(reply.hasDirectives).to.be.false;
        });
        it("should return true for a reply with a card", () => {
            const card = new actions_on_google_1.BasicCard({});
            const richResponse = new actions_on_google_1.RichResponse();
            richResponse.add(card);
            reply.payload.google.richResponse = richResponse;
            chai_1.expect(reply.hasDirectives).to.be.true;
            chai_1.expect(reply.hasDirective("BasicCard")).to.be.true;
        });
        it("should return true for a reply with an AccountLinkingCard", () => {
            const signIn = new actions_on_google_1.SignIn();
            reply.payload.google.systemIntent = {
                data: signIn.inputValueData,
                intent: signIn.intent,
            };
            chai_1.expect(reply.hasDirectives).to.be.true;
            chai_1.expect(reply.hasDirective("BasicCard")).to.be.false;
            chai_1.expect(reply.hasDirective(signIn.intent)).to.be.true;
        });
    });
    describe("speech", () => {
        it("should return an empty string for a new reply", () => {
            chai_1.expect(reply.speech).to.equal("");
        });
        it("should return an empty string for a reply without a simple response", () => {
            const suggestions = new actions_on_google_1.Suggestions("suggestion");
            const richResponse = new actions_on_google_1.RichResponse();
            richResponse.addSuggestion(suggestions);
            reply.payload.google.richResponse = richResponse;
            chai_1.expect(reply.speech).to.equal("");
        });
    });
    describe("hasMessages", () => {
        it("should return false for a new reply", () => {
            chai_1.expect(reply.hasMessages).to.be.false;
        });
    });
    describe("addStatement", () => {
        it("should add to both the speech and richResponse", () => {
            reply.addStatement("THIS IS A TEST");
            chai_1.expect(reply.speech).to.equal("<speak>THIS IS A TEST</speak>");
            chai_1.expect(_.get(reply, "payload.google.richResponse.items[0]")).to.deep.equal({
                simpleResponse: { textToSpeech: "<speak>THIS IS A TEST</speak>" },
            });
        });
    });
    describe("clear", () => {
        it("should empty the rich response, speech and reprompts", () => {
            reply.addStatement("THIS IS A TEST");
            reply.addReprompt("THIS IS A TEST REPROMPT");
            reply.clear();
            chai_1.expect(reply.speech).to.equal("");
            chai_1.expect(reply.payload.google.richResponse).to.be.undefined;
            chai_1.expect(reply.payload.google.noInputPrompts).to.be.empty;
        });
    });
});
//# sourceMappingURL=DialogflowReply.spec.js.map