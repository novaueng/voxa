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
const _ = require("lodash");
const src_1 = require("../src");
const tools_1 = require("./tools");
const variables_1 = require("./variables");
const views_1 = require("./views");
describe("States", () => {
    let voxaApp;
    let alexaSkill;
    let rb;
    beforeEach(() => {
        rb = new tools_1.AlexaRequestBuilder();
        voxaApp = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        voxaApp.onIntent("HelpIntent", {
            flow: "yield",
            sayp: "Help",
            to: "entry",
        });
        voxaApp.onState("helpSettings", (voxaEvent) => {
            if (voxaEvent.intent.name === "AnotherHelpSettingsIntent") {
                return {
                    flow: "yield",
                    sayp: "user wants help",
                    to: "entry",
                };
            }
        });
        voxaApp.onState("helpSettings", {
            flow: "yield",
            sayp: "question",
            to: "entry",
        }, "HelpSettingsIntent");
        voxaApp.onState("undefinedState", () => undefined);
        voxaApp.onUnhandledState((voxaEvent, stateName) => {
            return {
                flow: "terminate",
                sayp: "unhandled",
            };
        });
        alexaSkill = new src_1.AlexaPlatform(voxaApp);
    });
    it("should correctly transition to the global handler after failling to find a correct handler", async () => {
        const helpRequest = rb.getIntentRequest("AMAZON.HelpIntent");
        _.set(helpRequest, "session.new", false);
        _.set(helpRequest, "session.attributes", {
            model: {},
            state: "helpSettings",
        });
        const reply = await alexaSkill.execute(helpRequest);
        chai_1.expect(reply.response.shouldEndSession).to.be.false;
        chai_1.expect(reply.sessionAttributes).to.deep.equal({
            model: {},
            state: "entry",
        });
        chai_1.expect(reply.response.outputSpeech.ssml).to.equal("<speak>Help</speak>");
    });
    it("should trigger onUnhandledState when there's no state", async () => {
        const helpRequest = rb.getIntentRequest("AnyIntent");
        _.set(helpRequest, "session.new", false);
        _.set(helpRequest, "session.attributes", {
            model: {},
            state: "helpSettings",
        });
        const reply = await alexaSkill.execute(helpRequest);
        chai_1.expect(reply.response.shouldEndSession).to.be.true;
        chai_1.expect(reply.response.outputSpeech.ssml).to.equal("<speak>unhandled</speak>");
    });
    it("should transition to the intent handler with the intent array filter", async () => {
        const helpRequest = rb.getIntentRequest("HelpSettingsIntent");
        _.set(helpRequest, "session.new", false);
        _.set(helpRequest, "session.attributes", {
            model: {},
            state: "helpSettings",
        });
        const reply = await alexaSkill.execute(helpRequest);
        chai_1.expect(reply.response.outputSpeech.ssml).to.equal("<speak>question</speak>");
    });
    it("should transition to the intent handler without an intent array filter", async () => {
        const helpRequest = rb.getIntentRequest("AnotherHelpSettingsIntent");
        _.set(helpRequest, "session.new", false);
        _.set(helpRequest, "session.attributes", {
            model: {},
            state: "helpSettings",
        });
        const reply = await alexaSkill.execute(helpRequest);
        chai_1.expect(reply.response.outputSpeech.ssml).to.equal("<speak>user wants help</speak>");
    });
    it("should trigger onUnhandledState when there's no match in the state", async () => {
        const helpRequest = rb.getIntentRequest("AnyIntent");
        _.set(helpRequest, "session.new", false);
        _.set(helpRequest, "session.attributes", {
            model: {},
            state: "undefinedState",
        });
        const reply = await alexaSkill.execute(helpRequest);
        chai_1.expect(reply.response.shouldEndSession).to.be.true;
        chai_1.expect(reply.response.outputSpeech.ssml).to.equal("<speak>unhandled</speak>");
    });
});
//# sourceMappingURL=States.spec.js.map