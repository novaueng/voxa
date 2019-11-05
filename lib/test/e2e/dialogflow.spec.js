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
const portfinder = require("portfinder");
// import { VirtualGoogleAssistant } from "virtual-google-assistant";
/* tslint:disable-next-line:no-var-requires */
const { googleAssistantAction } = require("../../hello-world/hello-world");
/* tslint:disable-next-line:no-var-requires */
const { VirtualGoogleAssistant } = require("virtual-google-assistant");
/* tslint:disable-next-line:no-var-requires */
const views = require("../../hello-world/views.json");
describe("Hello World Google Assistant", () => {
    let googleAssistant;
    let server;
    let reply;
    beforeEach(async () => {
        const port = await portfinder.getPortPromise();
        server = (await googleAssistantAction.startServer(port));
        googleAssistant = VirtualGoogleAssistant.Builder()
            .directory("hello-world/dialogflowmodel")
            .actionUrl(`http://localhost:${port}`)
            .create();
    });
    afterEach((done) => {
        server.close(done);
    });
    it("Runs the googleAssistantAction and like's voxa", async () => {
        reply = await googleAssistant.launch();
        chai_1.expect(reply.fulfillmentText).to.include("Welcome to this voxa app, are you enjoying voxa so far?");
        reply = await googleAssistant.utter("yes");
        chai_1.expect(reply.fulfillmentText).to.include(views.en.translation.doesLikeVoxa);
    });
    it("Runs the googleAssistantAction and does not like voxa", async () => {
        reply = await googleAssistant.launch();
        chai_1.expect(reply.fulfillmentText).to.include("Welcome to this voxa app, are you enjoying voxa so far?");
        reply = await googleAssistant.utter("no");
        chai_1.expect(reply.fulfillmentText).to.include(views.en.translation.doesNotLikeVoxa);
    });
    /**
     * Newest dialog flow has deprecated the userId property, because of that we're
     * storing it in the userStorage
     */
    it("Uses the same userId on multiple turns", async () => {
        reply = await googleAssistant.intend("UserIdIntent");
        const userId = reply.fulfillmentText;
        chai_1.expect(userId).to.not.equal("");
        chai_1.expect(reply.payload.google.userStorage).to.not.be.undefined;
        chai_1.expect(JSON.parse(reply.payload.google.userStorage).data.voxa.userId).to.equal(userId);
        googleAssistant.addFilter((request) => {
            request.originalDetectIntentRequest.payload.user.userStorage =
                reply.payload.google.userStorage;
        });
        reply = await googleAssistant.intend("UserIdIntent");
        chai_1.expect(reply.fulfillmentText).to.equal(userId);
        googleAssistant.addFilter((request) => {
            request.originalDetectIntentRequest.payload.user.userStorage =
                reply.payload.google.userStorage;
        });
        reply = await googleAssistant.intend("UserIdIntent");
        chai_1.expect(reply.fulfillmentText).to.equal(userId);
        googleAssistant.addFilter((request) => {
            request.originalDetectIntentRequest.payload.user.userStorage =
                reply.payload.google.userStorage;
        });
        reply = await googleAssistant.intend("UserIdIntent");
        chai_1.expect(reply.fulfillmentText).to.equal(userId);
    });
    /**
     * However we also want to just use the current userId property when
     * available
     */
    it("Uses the same userId on multiple turns", async () => {
        const userId = "123";
        googleAssistant.addFilter((request) => {
            request.originalDetectIntentRequest.payload.user.userId = userId;
        });
        reply = await googleAssistant.intend("UserIdIntent");
        chai_1.expect(reply.fulfillmentText).to.equal(userId);
        chai_1.expect(reply.payload.google.userStorage).to.not.be.undefined;
        chai_1.expect(JSON.parse(reply.payload.google.userStorage).data.voxa.userId).to.equal(userId);
        googleAssistant.addFilter((request) => {
            request.originalDetectIntentRequest.payload.user.userStorage =
                reply.payload.google.userStorage;
        });
        reply = await googleAssistant.intend("UserIdIntent");
        chai_1.expect(reply.fulfillmentText).to.equal(userId);
        googleAssistant.addFilter((request) => {
            request.originalDetectIntentRequest.payload.user.userStorage =
                reply.payload.google.userStorage;
        });
        reply = await googleAssistant.intend("UserIdIntent");
        chai_1.expect(reply.fulfillmentText).to.equal(userId);
        googleAssistant.addFilter((request) => {
            request.originalDetectIntentRequest.payload.user.userStorage =
                reply.payload.google.userStorage;
        });
        reply = await googleAssistant.intend("UserIdIntent");
        chai_1.expect(reply.fulfillmentText).to.equal(userId);
    });
});
//# sourceMappingURL=dialogflow.spec.js.map