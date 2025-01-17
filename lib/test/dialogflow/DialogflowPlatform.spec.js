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
const chai_1 = require("chai");
const src_1 = require("../../src");
const VoxaApp_1 = require("../../src/VoxaApp");
const variables_1 = require("../variables");
const views_1 = require("../views");
describe("DialogflowPlatform", () => {
    describe("execute", () => {
        it("should convert the voxaReply to a Dialogflow response", async () => {
            const rawEvent = require("../requests/dialogflow/launchIntent.json");
            const voxaApp = new VoxaApp_1.VoxaApp({ views: views_1.views });
            voxaApp.onIntent("LaunchIntent", () => ({
                say: "LaunchIntent.OpenResponse",
            }));
            const platform = new src_1.DialogflowPlatform(voxaApp);
            const reply = await platform.execute(rawEvent);
            chai_1.expect(reply.speech).to.equal("<speak>Hello from Dialogflow</speak>");
        });
        it("should not close the session on Help Intent", async () => {
            const rawEvent = require("../requests/dialogflow/helpIntent.json");
            const voxaApp = new VoxaApp_1.VoxaApp({ views: views_1.views });
            voxaApp.onIntent("HelpIntent", {
                ask: "Help",
                to: "entry",
            });
            const platform = new src_1.DialogflowPlatform(voxaApp);
            const reply = await platform.execute(rawEvent);
            chai_1.expect(reply.speech).to.equal("<speak>This is the help</speak>");
            chai_1.expect(reply.payload.google.expectUserResponse).to.be.true;
        });
    });
});
describe("FacebookPlatform", () => {
    describe("execute", () => {
        it("should convert the voxaReply to a Dialogflow response", async () => {
            const rawEvent = require("../requests/dialogflow/launchIntent.json");
            const voxaApp = new VoxaApp_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
            voxaApp.onIntent("LaunchIntent", () => ({
                text: "LaunchIntent.OpenResponse",
            }));
            const platform = new src_1.FacebookPlatform(voxaApp);
            const reply = await platform.execute(rawEvent);
            chai_1.expect(reply.speech).to.equal("Hello from Facebook");
        });
        it("should not close the session on Help Intent", async () => {
            const rawEvent = require("../requests/dialogflow/helpIntent.json");
            const voxaApp = new VoxaApp_1.VoxaApp({ views: views_1.views });
            voxaApp.onIntent("HelpIntent", {
                flow: "yield",
                text: "Help",
                to: "entry",
            });
            const platform = new src_1.FacebookPlatform(voxaApp);
            const reply = await platform.execute(rawEvent);
            chai_1.expect(reply.speech).to.equal("This is the help");
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal("This is the help");
        });
    });
});
describe("GoogleAssistantPlatform", () => {
    describe("execute", () => {
        it("should convert the voxaReply to a Dialogflow response", async () => {
            const rawEvent = require("../requests/dialogflow/launchIntent.json");
            const voxaApp = new VoxaApp_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
            voxaApp.onIntent("LaunchIntent", () => ({
                say: "LaunchIntent.OpenResponse",
            }));
            const platform = new src_1.GoogleAssistantPlatform(voxaApp);
            const reply = (await platform.execute(rawEvent));
            chai_1.expect(reply.speech).to.equal("<speak>Hello from Google Assistant</speak>");
        });
        it("should not close the session on Help Intent", async () => {
            const rawEvent = require("../requests/dialogflow/helpIntent.json");
            const voxaApp = new VoxaApp_1.VoxaApp({ views: views_1.views });
            voxaApp.onIntent("HelpIntent", {
                ask: "Help",
                to: "entry",
            });
            const platform = new src_1.GoogleAssistantPlatform(voxaApp);
            const reply = await platform.execute(rawEvent);
            chai_1.expect(reply.speech).to.equal("<speak>This is the help</speak>");
            chai_1.expect(reply.payload.google.expectUserResponse).to.be.true;
        });
    });
    describe("simple responses", () => {
        it("should separate simple responses when dialogflowSplitSimpleResponses is present and true", async () => {
            const rawEvent = require("../requests/dialogflow/launchIntent.json");
            const voxaApp = new VoxaApp_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
            voxaApp.onIntent("LaunchIntent", () => ({
                dialogflowSplitSimpleResponses: true,
                reply: [
                    "Reply.Say",
                    "Reply.DialogflowBasicCard",
                    "Reply.Say2",
                ],
            }));
            const platform = new src_1.GoogleAssistantPlatform(voxaApp);
            const reply = await platform.execute(rawEvent);
            chai_1.expect(reply.payload.google.richResponse.items.length).to.equal(3);
            chai_1.expect(reply.payload.google.richResponse.items[2]).to.deep.equal({
                basicCard: {
                    buttons: [
                        {
                            openUrlAction: "https://example.com",
                            title: "Example.com",
                        },
                    ],
                    formattedText: "This is the text",
                    image: {
                        url: "https://example.com/image.png",
                    },
                    imageDisplayOptions: "DEFAULT",
                    subtitle: "subtitle",
                    title: "title",
                },
            });
            chai_1.expect(reply.speech).to.deep.equal("<speak>this is a say</speak>\n<speak>this is another say</speak>");
        });
    });
});
//# sourceMappingURL=DialogflowPlatform.spec.js.map