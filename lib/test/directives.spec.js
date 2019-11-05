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
require("mocha");
const src_1 = require("../src");
const tools_1 = require("./tools");
const variables_1 = require("./variables");
const views_1 = require("./views");
const i18n = require("i18next");
describe("directives", () => {
    let response;
    let event;
    let voxaApp;
    before(async () => {
        await i18n.init({
            load: "all",
            nonExplicitWhitelist: true,
            resources: views_1.views,
        });
    });
    beforeEach(() => {
        voxaApp = new src_1.VoxaApp({
            views: {},
        });
        const rb = new tools_1.AlexaRequestBuilder();
        const renderer = new src_1.Renderer({ views: views_1.views, variables: variables_1.variables });
        event = new src_1.AlexaEvent(rb.getIntentRequest("AMAZON.YesIntent"));
        event.t = i18n.getFixedT(event.request.locale);
        event.renderer = renderer;
        event.platform = new src_1.AlexaPlatform(voxaApp);
        response = new src_1.AlexaReply();
    });
    describe("tell", () => {
        it("should end the session", async () => {
            await new src_1.Tell("Tell").writeToReply(response, event, {});
            chai_1.expect(response.speech).to.equal("<speak>tell</speak>");
            chai_1.expect(response.hasTerminated).to.be.true;
        });
        it("should render a random tell from the list", async () => {
            await new src_1.Tell("TellRandom").writeToReply(response, event, {});
            chai_1.expect([
                "<speak>tell1</speak>",
                "<speak>tell2</speak>",
                "<speak>tell3</speak>",
            ]).to.include(response.speech);
            chai_1.expect(response.hasTerminated).to.be.true;
        });
        it("should always use the first response if platform is configured as test", async () => {
            event.platform.config.test = true;
            await new src_1.Tell("TellRandom").writeToReply(response, event, {});
            chai_1.expect("<speak>tell1</speak>").to.equal(response.speech);
            chai_1.expect(response.hasTerminated).to.be.true;
        });
    });
    describe("ask", () => {
        it("should render ask statements", async () => {
            await new src_1.Ask("Ask").writeToReply(response, event, {});
            chai_1.expect(response.speech).to.deep.equal("<speak>What time is it?</speak>");
        });
        it("should render Random Ask statements", async () => {
            await new src_1.Ask("AskRandomObj").writeToReply(response, event, {});
            chai_1.expect([
                "<speak>ask1</speak>",
                "<speak>ask2</speak>",
                "<speak>ask3</speak>",
            ]).to.include(response.speech);
            chai_1.expect([
                "<speak>reprompt1</speak>",
                "<speak>reprompt2</speak>",
                "<speak>reprompt3</speak>",
            ]).to.include(response.reprompt);
        });
        it("should not terminate the session", async () => {
            await new src_1.Ask("Ask").writeToReply(response, event, {});
            chai_1.expect(response.hasTerminated).to.be.false;
        });
    });
    describe("say", () => {
        it("should render ask statements", async () => {
            await new src_1.Say("Say").writeToReply(response, event, {});
            chai_1.expect(response.speech).to.deep.equal("<speak>say</speak>");
        });
        it("should not terminate the session", async () => {
            await new src_1.Say("Say").writeToReply(response, event, {});
            chai_1.expect(response.hasTerminated).to.be.false;
        });
        it("should render a random Say ", async () => {
            await new src_1.Say("SayRandom").writeToReply(response, event, {});
            chai_1.expect([
                "<speak>say1</speak>",
                "<speak>say2</speak>",
                "<speak>say3</speak>",
            ]).to.include(response.speech);
        });
    });
    describe("reprompt", () => {
        it("should render reprompt statements", async () => {
            await new src_1.Reprompt("Reprompt").writeToReply(response, event, {});
            chai_1.expect(response.reprompt).to.equal("<speak>reprompt</speak>");
        });
        it("should render random reprompt statements", async () => {
            await new src_1.Reprompt("RepromptRandom").writeToReply(response, event, {});
            chai_1.expect([
                "<speak>reprompt1</speak>",
                "<speak>reprompt2</speak>",
                "<speak>reprompt3</speak>",
            ]).to.include(response.reprompt);
        });
    });
});
//# sourceMappingURL=directives.spec.js.map