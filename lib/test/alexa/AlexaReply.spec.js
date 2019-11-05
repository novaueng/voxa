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
const chai_1 = require("chai");
const src_1 = require("../../src");
const tools_1 = require("../tools");
const variables_1 = require("../variables");
const views_1 = require("../views");
const i18n = require("i18next");
const rb = new tools_1.AlexaRequestBuilder();
describe("AlexaReply", () => {
    let reply;
    let event;
    let renderer;
    before(async () => {
        await i18n.init({
            load: "all",
            nonExplicitWhitelist: true,
            resources: views_1.views,
        });
    });
    beforeEach(() => {
        const app = new src_1.VoxaApp({ views: views_1.views });
        const skill = new src_1.AlexaPlatform(app);
        renderer = new src_1.Renderer({ views: views_1.views, variables: variables_1.variables });
        event = new src_1.AlexaEvent(rb.getIntentRequest("SomeIntent"));
        event.renderer = renderer;
        event.t = i18n.getFixedT(event.request.locale);
        event.platform = skill;
        reply = new src_1.AlexaReply();
    });
    it("should generate a correct alexa response and reprompt that doesn't  end a session for an ask response", () => {
        reply.addStatement("ask");
        reply.addReprompt("reprompt");
        chai_1.expect(JSON.parse(JSON.stringify(reply))).to.deep.equal({
            response: {
                // card: undefined,
                outputSpeech: {
                    ssml: "<speak>ask</speak>",
                    type: "SSML",
                },
                reprompt: {
                    outputSpeech: {
                        ssml: "<speak>reprompt</speak>",
                        type: "SSML",
                    },
                },
                shouldEndSession: false,
            },
            sessionAttributes: {},
            version: "1.0",
        });
    });
    it("should generate a correct alexa response that doesn't  end a session for an ask response", () => {
        reply.addStatement("ask");
        chai_1.expect(JSON.parse(JSON.stringify(reply))).to.deep.equal({
            response: {
                outputSpeech: {
                    ssml: "<speak>ask</speak>",
                    type: "SSML",
                },
                shouldEndSession: false,
            },
            sessionAttributes: {},
            version: "1.0",
        });
    });
    it("should generate a correct alexa response that ends a session for a tell response", () => {
        reply.addStatement("tell");
        reply.terminate();
        chai_1.expect(JSON.parse(JSON.stringify(reply))).to.deep.equal({
            response: {
                outputSpeech: {
                    ssml: "<speak>tell</speak>",
                    type: "SSML",
                },
                shouldEndSession: true,
            },
            sessionAttributes: {},
            version: "1.0",
        });
    });
    // it("should generate a correct alexa response that doesn't end a session for an ask response", async () => {
    // const askF = await askP("ask");
    // askF(reply, event);
    // expect(reply).to.deep.equal({
    // response: {
    // outputSpeech: {
    // ssml: "<speak>ask</speak>",
    // type: "SSML",
    // },
    // shouldEndSession: false,
    // },
    // version: "1.0",
    // });
    // });
    // it("should generate a correct alexa response that ends a session for a tell response", async () => {
    // const tellF = await tellP("tell");
    // tellF(reply, event);
    // expect(reply).to.deep.equal({
    // response: {
    // outputSpeech: {
    // ssml: "<speak>tell</speak>",
    // type: "SSML",
    // },
    // shouldEndSession: true,
    // },
    // version: "1.0",
    // });
    // });
    it("should generate a correct alexa response for a CanFulfillIntentRequest", () => {
        const canUnderstand = "YES";
        const canFulfill = "YES";
        reply = new src_1.AlexaReply();
        reply.fulfillIntent("YES");
        reply.fulfillSlot("slot1", canUnderstand, canFulfill);
        chai_1.expect(JSON.parse(JSON.stringify(reply))).to.deep.equal({
            response: {
                canFulfillIntent: {
                    canFulfill: "YES",
                    slots: {
                        slot1: {
                            canFulfill: "YES",
                            canUnderstand: "YES",
                        },
                    },
                },
            },
            sessionAttributes: {},
            version: "1.0",
        });
    });
    it("should generate a correct alexa response persisting session attributes", () => {
        reply = new src_1.AlexaReply();
        reply.addStatement("tell");
        reply.terminate();
        reply.sessionAttributes = { model: { name: "name" } };
        chai_1.expect(JSON.parse(JSON.stringify(reply))).to.deep.equal({
            response: {
                outputSpeech: {
                    ssml: "<speak>tell</speak>",
                    type: "SSML",
                },
                shouldEndSession: true,
            },
            sessionAttributes: {
                model: {
                    name: "name",
                },
            },
            version: "1.0",
        });
    });
    it("should generate a correct alexa response with directives", async () => {
        await new src_1.Tell("ExitIntent.Farewell").writeToReply(reply, event, {});
        await new src_1.Hint("Hint").writeToReply(reply, event, {});
        chai_1.expect(JSON.parse(JSON.stringify(reply))).to.deep.equal({
            response: {
                directives: [
                    {
                        hint: {
                            text: "string",
                            type: "PlainText",
                        },
                        type: "Hint",
                    },
                ],
                outputSpeech: {
                    ssml: "<speak>Ok. For more info visit example.com site.</speak>",
                    type: "SSML",
                },
                shouldEndSession: true,
            },
            sessionAttributes: {},
            version: "1.0",
        });
    });
});
//# sourceMappingURL=AlexaReply.spec.js.map