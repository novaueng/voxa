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
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const simple = require("simple-mock");
const src_1 = require("../../src");
const tools_1 = require("../tools");
const variables_1 = require("../variables");
const views_1 = require("../views");
const autoLoadAdapter_1 = require("./autoLoadAdapter");
const rb = new tools_1.AlexaRequestBuilder("user-xyz");
describe("AutoLoad plugin", () => {
    let alexaEvent;
    let adapter;
    beforeEach(() => {
        alexaEvent = rb.getIntentRequest("LaunchIntent");
        simple.mock(autoLoadAdapter_1.AutoLoadAdapter.prototype, "get").resolveWith({ Id: 1 });
        adapter = new autoLoadAdapter_1.AutoLoadAdapter();
    });
    afterEach(() => {
        simple.restore();
    });
    it("should get data from adapter", async () => {
        const skill = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        src_1.plugins.autoLoad(skill, { adapter });
        const spy = simple.spy(() => ({
            ask: "LaunchIntent.OpenResponse",
            to: "die",
        }));
        skill.onIntent("LaunchIntent", spy);
        const alexaSkill = new src_1.AlexaPlatform(skill);
        const result = await alexaSkill.execute(alexaEvent);
        chai_1.expect(spy.lastCall.args[0].intent.name).to.equal("LaunchIntent");
        chai_1.expect(result.response.outputSpeech.ssml).to.include("Hello! Good");
        chai_1.expect(result.sessionAttributes.state).to.equal("die");
        chai_1.expect(result.sessionAttributes.model.user.Id).to.equal(1);
    });
    it("should throw error on getting data from adapter", async () => {
        const skill = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        src_1.plugins.autoLoad(skill, { adapter });
        const spy = simple.spy(() => ({ ask: "LaunchIntent.OpenResponse" }));
        skill.onIntent("LaunchIntent", spy);
        simple.mock(adapter, "get").rejectWith(new Error("Random error"));
        const platform = new src_1.AlexaPlatform(skill);
        const reply = await platform.execute(alexaEvent);
        chai_1.expect(reply.speech).to.equal("<speak>An unrecoverable error occurred.</speak>");
        // expect(reply.error).to.not.be.undefined;
        // expect(reply.error.message).to.equal('Random error');
    });
    it("should throw an error when no adapter is set up in the config object", () => {
        const skill = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        const fn = () => {
            src_1.plugins.autoLoad(skill, { adapter: undefined });
        };
        chai_1.expect(fn).to.throw("Missing adapter");
    });
    it("should not get data from adapter when adapter has an invalid GET function", () => {
        simple.mock(adapter, "get", undefined);
        const skill = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        const fn = () => {
            src_1.plugins.autoLoad(skill, { adapter });
        };
        chai_1.expect(fn).to.throw("No get method to fetch data from");
    });
});
//# sourceMappingURL=auto-load.spec.js.map