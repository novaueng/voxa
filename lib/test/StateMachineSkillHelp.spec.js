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
const src_1 = require("../src/");
const tools_1 = require("./tools");
const variables_1 = require("./variables");
const views_1 = require("./views");
const rb = new tools_1.AlexaRequestBuilder();
const states = {
    CancelIntent: {
        to: "exit",
    },
    HelpIntent: {
        to: "help",
    },
    LaunchIntent: {
        to: "launch",
    },
    StopIntent: {
        to: "exit",
    },
    exit: () => ({ tell: "ExitIntent.Farewell", to: "die" }),
    help: () => ({ ask: "HelpIntent.HelpAboutSkill", to: "die" }),
    launch: () => ({ ask: "LaunchIntent.OpenResponse", to: "die" }),
};
describe("StateMachineSkill Help test", () => {
    let app;
    let skill;
    beforeEach(() => {
        app = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
        skill = new src_1.AlexaPlatform(app);
        _.map(states, (state, name) => {
            skill.onState(name, state);
        });
    });
    itIs("AMAZON.HelpIntent", (reply) => {
        chai_1.expect(reply.speech).to.include("For more help visit");
    });
    function itIs(intentName, cb) {
        it(intentName, () => {
            const event = rb.getIntentRequest(intentName);
            return skill.execute(event).then(cb);
        });
    }
});
//# sourceMappingURL=StateMachineSkillHelp.spec.js.map