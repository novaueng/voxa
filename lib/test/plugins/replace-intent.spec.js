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
Promise.resolve().then(() => require("mocha"));
const chai_1 = require("chai");
const simple = require("simple-mock");
const src_1 = require("../../src");
const replace_intent_1 = require("../../src/plugins/replace-intent");
const tools_1 = require("../tools");
const variables_1 = require("../variables");
const views_1 = require("../views");
const rb = new tools_1.AlexaRequestBuilder();
describe("ReplaceIntentPlugin", () => {
    it("should send to intent with Only", async () => {
        const voxaApp = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        const platform = new src_1.AlexaPlatform(voxaApp);
        const spy = simple.spy(() => ({ ask: "LaunchIntent.OpenResponse" }));
        voxaApp.onIntent("SomeIntent", spy);
        const event = rb.getIntentRequest("SomeOnlyIntent");
        replace_intent_1.register(voxaApp);
        const reply = (await platform.execute(event));
        chai_1.expect(spy.called).to.be.true;
        chai_1.expect(spy.lastCall.args[0].intent.name).to.equal("SomeIntent");
        chai_1.expect(reply.speech).to.include("Hello! Good ");
    });
    it("shouldn't affect non matching intents", async () => {
        const voxaApp = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        const platform = new src_1.AlexaPlatform(voxaApp);
        const spy = simple.spy(() => ({ ask: "LaunchIntent.OpenResponse" }));
        voxaApp.onIntent("OnlySomeIntent", spy);
        const event = rb.getIntentRequest("OnlySomeIntent");
        replace_intent_1.register(voxaApp);
        const reply = (await platform.execute(event));
        chai_1.expect(spy.called).to.be.true;
        chai_1.expect(spy.lastCall.args[0].intent.name).to.equal("OnlySomeIntent");
        chai_1.expect(reply.speech).to.include("Hello! Good ");
    });
    it("should use provided regex", async () => {
        const voxaApp = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        const platform = new src_1.AlexaPlatform(voxaApp);
        const spy = simple.spy(() => ({ ask: "LaunchIntent.OpenResponse" }));
        voxaApp.onIntent("SomeHolderIntent", spy);
        const event = rb.getIntentRequest("SomePlaceholderIntent");
        replace_intent_1.register(voxaApp, {
            regex: /(.*)PlaceholderIntent$/,
            replace: "$1HolderIntent",
        });
        const reply = (await platform.execute(event));
        chai_1.expect(spy.called).to.be.true;
        chai_1.expect(spy.lastCall.args[0].intent.name).to.equal("SomeHolderIntent");
        chai_1.expect(reply.speech).to.include("Hello! Good ");
    });
    it("should use multiple regex", async () => {
        const voxaApp = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        const platform = new src_1.AlexaPlatform(voxaApp);
        const spy = simple.spy(() => ({ ask: "LaunchIntent.OpenResponse" }));
        voxaApp.onIntent("LongIntent", spy);
        const event = rb.getIntentRequest("VeryLongOnlyIntent");
        replace_intent_1.register(voxaApp, {
            regex: /(.*)OnlyIntent$/,
            replace: "$1Intent",
        });
        replace_intent_1.register(voxaApp, {
            regex: /^VeryLong(.*)/,
            replace: "Long$1",
        });
        const reply = (await platform.execute(event));
        chai_1.expect(spy.called).to.be.true;
        chai_1.expect(spy.lastCall.args[0].intent.name).to.equal("LongIntent");
        chai_1.expect(reply.speech).to.include("Hello! Good ");
    });
});
//# sourceMappingURL=replace-intent.spec.js.map