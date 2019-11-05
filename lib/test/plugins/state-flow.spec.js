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
require("mocha");
const chai_1 = require("chai");
const _ = require("lodash");
const src_1 = require("../../src");
const stateFlow = require("../../src/plugins/state-flow");
const tools_1 = require("../tools");
const variables_1 = require("../variables");
const views_1 = require("../views");
const rb = new tools_1.AlexaRequestBuilder();
describe("StateFlow plugin", () => {
    let states;
    let event;
    beforeEach(() => {
        event = rb.getIntentRequest("SomeIntent");
        event.session = {
            attributes: {
                state: "secondState",
            },
            new: false,
        };
        states = {
            SomeIntent: {
                to: "intent",
            },
            fourthState: () => undefined,
            initState: () => ({ tell: "ExitIntent.Farewell", to: "die" }),
            intent: () => ({ tell: "ExitIntent.Farewell", to: "die" }),
            secondState: () => ({ to: "initState" }),
            thirdState: () => Promise.resolve({ to: "die" }),
        };
    });
    it("should store the execution flow in the request", async () => {
        const app = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        const skill = new src_1.AlexaPlatform(app);
        _.map(states, (state, name) => {
            app.onState(name, state);
        });
        stateFlow.register(app);
        const result = await skill.execute(event);
        chai_1.expect(_.get(result, "sessionAttributes.flow")).to.deep.equal([
            "secondState",
            "initState",
            "die",
        ]);
    });
    it("should not crash on null transition", async () => {
        const app = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        const skill = new src_1.AlexaPlatform(app);
        _.map(states, (state, name) => {
            app.onState(name, state);
        });
        stateFlow.register(app);
        event.session.attributes.state = "fourthState";
        const result = await skill.execute(event);
        chai_1.expect(_.get(result, "sessionAttributes.flow")).to.deep.equal([
            "fourthState",
            "intent",
            "die",
        ]);
    });
});
//# sourceMappingURL=state-flow.spec.js.map