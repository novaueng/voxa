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
const simple = require("simple-mock");
const src_1 = require("../src");
const tools_1 = require("./tools");
const variables_1 = require("./variables");
const views_1 = require("./views");
const errors_1 = require("../src/errors");
const StateMachine_1 = require("../src/StateMachine/StateMachine");
const rb = new tools_1.AlexaRequestBuilder();
describe("VoxaApp", () => {
    let statesDefinition;
    let event;
    beforeEach(() => {
        event = rb.getIntentRequest("SomeIntent");
        simple.mock(src_1.AlexaPlatform, "apiRequest").resolveWith(true);
        statesDefinition = {
            DisplayElementSelected: { tell: "ExitIntent.Farewell", to: "die" },
            SomeIntent: { tell: "ExitIntent.Farewell", to: "die" },
            initState: { to: "endState" },
            secondState: { to: "initState" },
            thirdState: () => Promise.resolve({ to: "endState" }),
        };
    });
    it("should have the APL Template directive before the APL Command directive in the Alexa Platform", () => {
        // The APL Template should always be before the APL Command in the directives array in order to work.
        // Don't ask why, that's how Amazon likes it.
        const voxaApp = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        const platform = new src_1.AlexaPlatform(voxaApp);
        const APLTemplateIndex = voxaApp.directiveHandlers.findIndex((directive) => directive.key === "alexaAPLTemplate");
        const APLCommandIndex = voxaApp.directiveHandlers.findIndex((directive) => directive.key === "alexaAPLCommand");
        chai_1.expect(APLTemplateIndex).to.be.lessThan(APLCommandIndex);
    });
    it("should include the state in the session attributes", async () => {
        const voxaApp = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        const platform = new src_1.AlexaPlatform(voxaApp);
        voxaApp.onIntent("LaunchIntent", () => {
            return { to: "secondState", sayp: "This is my message", flow: "yield" };
        });
        voxaApp.onState("secondState", () => ({}));
        const launchEvent = new src_1.AlexaEvent(rb.getIntentRequest("LaunchIntent"));
        launchEvent.platform = platform;
        const reply = (await voxaApp.execute(launchEvent, new src_1.AlexaReply()));
        chai_1.expect(reply.sessionAttributes.state).to.equal("secondState");
        chai_1.expect(reply.response.shouldEndSession).to.be.false;
    });
    it("should include outputAttributes in the session attributes", async () => {
        const voxaApp = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        const platform = new src_1.AlexaPlatform(voxaApp);
        voxaApp.onIntent("LaunchIntent", (request) => {
            request.session.outputAttributes.foo = "bar";
            return { to: "secondState", sayp: "This is my message", flow: "yield" };
        });
        voxaApp.onState("secondState", () => ({}));
        const launchEvent = new src_1.AlexaEvent(rb.getIntentRequest("LaunchIntent"));
        launchEvent.platform = platform;
        const reply = (await voxaApp.execute(launchEvent, new src_1.AlexaReply()));
        chai_1.expect(reply.sessionAttributes.foo).to.equal("bar");
    });
    it("should add the message key from the transition to the reply", async () => {
        const voxaApp = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        const platform = new src_1.AlexaPlatform(voxaApp);
        voxaApp.onIntent("LaunchIntent", () => ({ sayp: "This is my message" }));
        const launchEvent = new src_1.AlexaEvent(rb.getIntentRequest("LaunchIntent"));
        launchEvent.platform = platform;
        const reply = (await voxaApp.execute(launchEvent, new src_1.AlexaReply()));
        chai_1.expect(reply.speech).to.deep.equal("<speak>This is my message</speak>");
    });
    it("should throw an error if trying to render a missing view", async () => {
        const voxaApp = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        const platform = new src_1.AlexaPlatform(voxaApp);
        voxaApp.onIntent("LaunchIntent", () => ({ ask: "Missing.View" }));
        const launchEvent = new src_1.AlexaEvent(rb.getIntentRequest("LaunchIntent"));
        launchEvent.platform = platform;
        const reply = (await voxaApp.execute(launchEvent, new src_1.AlexaReply()));
        // expect(reply.error).to.be.an("error");
        chai_1.expect(reply.speech).to.equal("<speak>An unrecoverable error occurred.</speak>");
    });
    it("should allow multiple reply paths in reply key", async () => {
        const voxaApp = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        const platform = new src_1.AlexaPlatform(voxaApp);
        voxaApp.onIntent("LaunchIntent", (voxaEvent) => {
            voxaEvent.model.count = 0;
            return { say: ["Count.Say", "Count.Tell"] };
        });
        const launchEvent = new src_1.AlexaEvent(rb.getIntentRequest("LaunchIntent"));
        launchEvent.platform = platform;
        const reply = (await voxaApp.execute(launchEvent, new src_1.AlexaReply()));
        chai_1.expect(reply.speech).to.deep.equal("<speak>0\n0</speak>");
    });
    it("should display element selected request", async () => {
        const voxaApp = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        const alexaEvent = rb.getDisplayElementSelectedRequest("token");
        voxaApp.onIntent("Display.ElementSelected", {
            tell: "ExitIntent.Farewell",
            to: "die",
        });
        const alexaSkill = new src_1.AlexaPlatform(voxaApp);
        const reply = await alexaSkill.execute(alexaEvent);
        chai_1.expect(_.get(reply, "response.outputSpeech.ssml")).to.equal("<speak>Ok. For more info visit example.com site.</speak>");
    });
    it("should be able to just pass through some intents to states", async () => {
        const voxaApp = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        let called = false;
        voxaApp.onIntent("LoopOffIntent", () => {
            called = true;
            return { tell: "ExitIntent.Farewell", to: "die" };
        });
        const alexa = new src_1.AlexaPlatform(voxaApp);
        const loopOffEvent = rb.getIntentRequest("AMAZON.LoopOffIntent");
        await alexa.execute(loopOffEvent);
        chai_1.expect(called).to.be.true;
    });
    describe("onBeforeStateChanged", () => {
        it("should accept onBeforeStateChanged callbacks", () => {
            const voxaApp = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
            voxaApp.onBeforeStateChanged(simple.stub());
        });
        it("should execute handlers before each state", async () => {
            const voxaApp = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
            const platform = new src_1.AlexaPlatform(voxaApp);
            voxaApp.onBeforeStateChanged((voxaEvent, voxaReply, state) => {
                voxaEvent.model.previousState = state.name;
            });
            voxaApp.onIntent("SomeIntent", (voxaEvent) => {
                chai_1.expect(voxaEvent.model.previousState).to.equal("SomeIntent");
                return {
                    flow: "terminate",
                    sayp: "done",
                };
            });
            const reply = await platform.execute(event);
            chai_1.expect(reply.speech).to.equal("<speak>done</speak>");
        });
    });
    it("should set properties on request and have those available in the state callbacks", async () => {
        const voxaApp = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
        statesDefinition.SomeIntent = simple.spy((request) => {
            chai_1.expect(request.model).to.not.be.undefined;
            chai_1.expect(request.model).to.be.an.instanceOf(src_1.Model);
            return { tell: "ExitIntent.Farewell", to: "die" };
        });
        _.map(statesDefinition, (state, name) => voxaApp.onState(name, state));
        const platform = new src_1.AlexaPlatform(voxaApp);
        const alexaEvent = event;
        await platform.execute(alexaEvent);
        chai_1.expect(statesDefinition.SomeIntent.called).to.be.true;
        chai_1.expect(statesDefinition.SomeIntent.lastCall.threw).to.be.not.ok;
    });
    // it("should simply set an empty session if serialize is missing", async () => {
    // const voxaApp = new VoxaApp({ views, variables });
    // statesDefinition.entry = simple.spy((request) => {
    // request.model = null;
    // return { ask: "Ask", to: "initState" };
    // });
    // _.map(statesDefinition, (state: any, name: string) => voxaApp.onState(name, state));
    // const reply = await voxaApp.execute(event, new AlexaReply()) as AlexaReply;
    // // expect(reply.error).to.be.undefined;
    // expect(statesDefinition.entry.called).to.be.true;
    // expect(statesDefinition.entry.lastCall.threw).to.be.not.ok;
    // expect(reply.sessionAttributes).to.deep.equal(new Model({ state: "initState" }));
    // });
    it("should allow async serialization in Model", async () => {
        class PromisyModel extends src_1.Model {
            serialize() {
                // eslint-disable-line class-methods-use-this
                return Promise.resolve({
                    value: 1,
                });
            }
        }
        const voxaApp = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables, Model: PromisyModel });
        statesDefinition.SomeIntent = simple.spy((request) => {
            chai_1.expect(request.model).to.not.be.undefined;
            chai_1.expect(request.model).to.be.an.instanceOf(PromisyModel);
            return { ask: "Ask", to: "initState" };
        });
        _.map(statesDefinition, (state, name) => voxaApp.onState(name, state));
        const platform = new src_1.AlexaPlatform(voxaApp);
        const reply = (await platform.execute(event));
        chai_1.expect(statesDefinition.SomeIntent.called).to.be.true;
        chai_1.expect(statesDefinition.SomeIntent.lastCall.threw).to.be.not.ok;
        chai_1.expect(reply.sessionAttributes).to.deep.equal({
            model: { value: 1 },
            state: "initState",
        });
    });
    it("should let model.deserialize return a Promise", async () => {
        class PromisyModel extends src_1.Model {
            static async deserialize(data) {
                const model = new PromisyModel();
                model.didDeserialize = "yep";
                return model;
            }
        }
        const voxaApp = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables, Model: PromisyModel });
        const platform = new src_1.AlexaPlatform(voxaApp);
        const alexaEvent = new src_1.AlexaEvent(event);
        alexaEvent.platform = platform;
        statesDefinition.SomeIntent = simple.spy((request) => {
            chai_1.expect(request.model).to.not.be.undefined;
            chai_1.expect(request.model).to.be.an.instanceOf(PromisyModel);
            chai_1.expect(request.model.didDeserialize).to.eql("yep");
            return { say: "ExitIntent.Farewell", to: "die" };
        });
        _.map(statesDefinition, (state, name) => voxaApp.onState(name, state));
        const sessionEvent = rb.getIntentRequest("SomeIntent");
        _.set(sessionEvent, "session.attributes", { model: { foo: "bar" } });
        await voxaApp.execute(alexaEvent, new src_1.AlexaReply());
        chai_1.expect(statesDefinition.SomeIntent.called).to.be.true;
        chai_1.expect(statesDefinition.SomeIntent.lastCall.threw).to.be.not.ok;
    });
    it("should call onSessionEnded callbacks if state is die", async () => {
        const voxaApp = new src_1.VoxaApp({ Model: src_1.Model, views: views_1.views, variables: variables_1.variables });
        const platform = new src_1.AlexaPlatform(voxaApp);
        const alexaEvent = event;
        _.map(statesDefinition, (state, name) => voxaApp.onState(name, state));
        const onSessionEnded = simple.stub();
        voxaApp.onSessionEnded(onSessionEnded);
        await platform.execute(alexaEvent);
        chai_1.expect(onSessionEnded.called).to.be.true;
    });
    it("should call onBeforeReplySent callbacks", async () => {
        const voxaApp = new src_1.VoxaApp({ Model: src_1.Model, views: views_1.views, variables: variables_1.variables });
        const platform = new src_1.AlexaPlatform(voxaApp);
        const alexaEvent = new src_1.AlexaEvent(event);
        alexaEvent.platform = platform;
        _.map(statesDefinition, (state, name) => voxaApp.onState(name, state));
        const onBeforeReplySent = simple.stub();
        voxaApp.onBeforeReplySent(onBeforeReplySent);
        await voxaApp.execute(alexaEvent, new src_1.AlexaReply());
        chai_1.expect(onBeforeReplySent.called).to.be.true;
    });
    it("should fulfill request", async () => {
        const canFulfillIntent = {
            canFulfill: "YES",
            slots: {
                slot1: {
                    canFulfill: "YES",
                    canUnderstand: "YES",
                },
            },
        };
        const voxaApp = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
        const alexaSkill = new src_1.AlexaPlatform(voxaApp);
        voxaApp.onCanFulfillIntentRequest((alexaEvent, alexaReply) => {
            alexaReply.fulfillIntent("YES");
            alexaReply.fulfillSlot("slot1", "YES", "YES");
            return alexaReply;
        });
        event = rb.getCanFulfillIntentRequestRequest("NameIntent", {
            slot1: "something",
        });
        const reply = (await alexaSkill.execute(event));
        chai_1.expect(reply.response.card).to.be.undefined;
        chai_1.expect(reply.response.reprompt).to.be.undefined;
        chai_1.expect(reply.response.outputSpeech).to.be.undefined;
        chai_1.expect(reply.response.canFulfillIntent).to.deep.equal(canFulfillIntent);
    });
    it("should fulfill request with default intents", async () => {
        const canFulfillIntent = {
            canFulfill: "YES",
            slots: {
                slot1: {
                    canFulfill: "YES",
                    canUnderstand: "YES",
                },
            },
        };
        const defaultFulfillIntents = ["NameIntent"];
        const voxaApp = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
        const alexaSkill = new src_1.AlexaPlatform(voxaApp, { defaultFulfillIntents });
        event = rb.getCanFulfillIntentRequestRequest("NameIntent", {
            slot1: "something",
        });
        const reply = (await alexaSkill.execute(event));
        chai_1.expect(reply.response.card).to.be.undefined;
        chai_1.expect(reply.response.reprompt).to.be.undefined;
        chai_1.expect(reply.response.outputSpeech).to.be.undefined;
        chai_1.expect(reply.response.canFulfillIntent).to.deep.equal(canFulfillIntent);
    });
    it("should return MAYBE fulfill response to CanFulfillIntentRequest", async () => {
        const canFulfillIntent = {
            canFulfill: "MAYBE",
            slots: {
                slot1: {
                    canFulfill: "YES",
                    canUnderstand: "YES",
                },
            },
        };
        const voxaApp = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
        const alexaSkill = new src_1.AlexaPlatform(voxaApp);
        voxaApp.onCanFulfillIntentRequest((alexaEvent, alexaReply) => {
            alexaReply.fulfillIntent("MAYBE");
            alexaReply.fulfillSlot("slot1", "YES", "YES");
            return alexaReply;
        });
        event = rb.getCanFulfillIntentRequestRequest("NameIntent", {
            slot1: "something",
        });
        const reply = (await alexaSkill.execute(event));
        chai_1.expect(reply.response.card).to.be.undefined;
        chai_1.expect(reply.response.reprompt).to.be.undefined;
        chai_1.expect(reply.response.outputSpeech).to.be.undefined;
        chai_1.expect(reply.response.canFulfillIntent).to.deep.equal(canFulfillIntent);
    });
    it("should not fulfill request", async () => {
        const canFulfillIntent = {
            canFulfill: "NO",
        };
        const voxaApp = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
        const alexaSkill = new src_1.AlexaPlatform(voxaApp);
        voxaApp.onCanFulfillIntentRequest((alexaEvent, alexaReply) => {
            alexaReply.fulfillIntent("NO");
            return alexaReply;
        });
        event = rb.getCanFulfillIntentRequestRequest("NameIntent", {
            slot1: "something",
        });
        const reply = (await alexaSkill.execute(event));
        chai_1.expect(reply.response.card).to.be.undefined;
        chai_1.expect(reply.response.reprompt).to.be.undefined;
        chai_1.expect(reply.response.outputSpeech).to.be.undefined;
        chai_1.expect(reply.response.canFulfillIntent).to.deep.equal(canFulfillIntent);
    });
    it("should not fulfill request with wrong values", async () => {
        const canFulfillIntent = {
            canFulfill: "NO",
            slots: {
                slot1: {
                    canFulfill: "NO",
                    canUnderstand: "NO",
                },
            },
        };
        const voxaApp = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
        const alexaSkill = new src_1.AlexaPlatform(voxaApp);
        voxaApp.onCanFulfillIntentRequest((alexaEvent, alexaReply) => {
            alexaReply.fulfillIntent("yes");
            alexaReply.fulfillSlot("slot1", "yes", "yes");
            return alexaReply;
        });
        event = rb.getCanFulfillIntentRequestRequest("NameIntent", {
            slot1: "something",
        });
        const reply = (await alexaSkill.execute(event));
        chai_1.expect(reply.response.card).to.be.undefined;
        chai_1.expect(reply.response.reprompt).to.be.undefined;
        chai_1.expect(reply.response.outputSpeech).to.be.undefined;
        chai_1.expect(reply.response.canFulfillIntent).to.deep.equal(canFulfillIntent);
    });
    describe("onUnhandledState", () => {
        afterEach(() => {
            simple.restore();
        });
        it("should crash if there's an unhandled state", async () => {
            const voxaApp = new src_1.VoxaApp({ Model: src_1.Model, views: views_1.views, variables: variables_1.variables });
            const platform = new src_1.AlexaPlatform(voxaApp);
            const launchEvent = rb.getIntentRequest("LaunchIntent");
            statesDefinition.LaunchIntent = simple.stub().resolveWith(null);
            _.map(statesDefinition, (state, name) => voxaApp.onState(name, state));
            const reply = await platform.execute(launchEvent);
            chai_1.expect(reply.speech).to.equal("<speak>An unrecoverable error occurred.</speak>");
        });
        it("should call onUnhandledState if state controller is for a specific intent", async () => {
            const voxaApp = new src_1.VoxaApp({ Model: src_1.Model, views: views_1.views, variables: variables_1.variables });
            const launchEvent = rb.getIntentRequest("LaunchIntent");
            const onUnhandledState = simple.stub().returnWith(Promise.resolve({
                flow: "terminate",
                sayp: "Unhandled State",
            }));
            voxaApp.onUnhandledState(onUnhandledState);
            voxaApp.onIntent("LaunchIntent", {
                to: "otherState",
            });
            voxaApp.onState("otherState", {
                flow: "terminate",
                sayp: "Other State",
            }, "SomeIntent");
            const platform = new src_1.AlexaPlatform(voxaApp);
            const reply = await platform.execute(launchEvent);
            chai_1.expect(reply.speech).to.equal("<speak>Unhandled State</speak>");
            chai_1.expect(onUnhandledState.called).to.be.true;
        });
        it("should call onUnhandledState callbacks when the state" +
            " machine transition throws a UnhandledState error", async () => {
            const voxaApp = new src_1.VoxaApp({ Model: src_1.Model, views: views_1.views, variables: variables_1.variables });
            const platform = new src_1.AlexaPlatform(voxaApp);
            const launchEvent = rb.getIntentRequest("LaunchIntent");
            const onUnhandledState = simple.stub().returnWith(Promise.resolve({
                tell: "ExitIntent.Farewell",
                to: "die",
            }));
            voxaApp.onUnhandledState(onUnhandledState);
            statesDefinition.LaunchIntent = simple.stub().resolveWith(null);
            _.map(statesDefinition, (state, name) => voxaApp.onState(name, state));
            const reply = await platform.execute(launchEvent);
            chai_1.expect(onUnhandledState.called).to.be.true;
            chai_1.expect(reply.speech).to.equal("<speak>Ok. For more info visit example.com site.</speak>");
        });
        it("should call onUnhandledState for intents without a handler", async () => {
            const voxaApp = new src_1.VoxaApp({ Model: src_1.Model, views: views_1.views, variables: variables_1.variables });
            const platform = new src_1.AlexaPlatform(voxaApp);
            const launchEvent = rb.getIntentRequest("RandomIntent");
            const onUnhandledState = simple.stub().returnWith(Promise.resolve({
                tell: "ExitIntent.Farewell",
                to: "die",
            }));
            voxaApp.onUnhandledState(onUnhandledState);
            statesDefinition.LaunchIntent = simple.stub().resolveWith(null);
            _.map(statesDefinition, (state, name) => voxaApp.onState(name, state));
            const reply = await platform.execute(launchEvent);
            chai_1.expect(onUnhandledState.called).to.be.true;
            chai_1.expect(reply.speech).to.equal("<speak>Ok. For more info visit example.com site.</speak>");
        });
        it("should call onUnhandledState when UnknownState is thrown", async () => {
            const voxaApp = new src_1.VoxaApp({ Model: src_1.Model, views: views_1.views, variables: variables_1.variables });
            const platform = new src_1.AlexaPlatform(voxaApp);
            const launchEvent = rb.getIntentRequest("RandomIntent");
            voxaApp.onUnhandledState((voxaEvent, stateName) => {
                chai_1.expect(stateName).to.equal("RandomIntent");
                return {
                    tell: "ExitIntent.Farewell",
                    to: "die",
                };
            });
            voxaApp.onError((voxaEvent, err) => {
                chai_1.expect(err.message).to.equal("RandomIntent went unhandled");
            });
            statesDefinition.LaunchIntent = simple.stub().resolveWith(null);
            _.map(statesDefinition, (state, name) => voxaApp.onState(name, state));
            const reply = await platform.execute(launchEvent);
            chai_1.expect(reply.speech).to.equal("<speak>Ok. For more info visit example.com site.</speak>");
        });
        it("should crash with an UnknownState Error", async () => {
            simple
                .mock(StateMachine_1.StateMachine.prototype, "getCurrentState")
                .throwWith(new errors_1.UnknownState("RandomIntent"));
            const voxaApp = new src_1.VoxaApp({ Model: src_1.Model, views: views_1.views, variables: variables_1.variables });
            const platform = new src_1.AlexaPlatform(voxaApp);
            const launchEvent = rb.getIntentRequest("RandomIntent");
            statesDefinition.LaunchIntent = simple.stub().resolveWith(null);
            _.map(statesDefinition, (state, name) => voxaApp.onState(name, state));
            voxaApp.onError((voxaEvent, err) => {
                chai_1.expect(err.message).to.equal("RandomIntent went unhandled");
            });
            const reply = await platform.execute(launchEvent);
            chai_1.expect(reply.speech).to.equal("<speak>An unrecoverable error occurred.</speak>");
        });
        it("should crash with a generic Error", async () => {
            simple
                .mock(StateMachine_1.StateMachine.prototype, "getCurrentState")
                .throwWith(new Error("Common Error"));
            const voxaApp = new src_1.VoxaApp({ Model: src_1.Model, views: views_1.views, variables: variables_1.variables });
            const platform = new src_1.AlexaPlatform(voxaApp);
            const launchEvent = rb.getIntentRequest("LaunchIntent");
            statesDefinition.LaunchIntent = simple.stub().resolveWith(null);
            _.map(statesDefinition, (state, name) => voxaApp.onState(name, state));
            voxaApp.onError((voxaEvent, err) => {
                chai_1.expect(err.message).to.equal("Common Error");
            });
            const reply = await platform.execute(launchEvent);
            chai_1.expect(reply.speech).to.equal("<speak>An unrecoverable error occurred.</speak>");
        });
    });
    it("should include all directives in the reply", async () => {
        const voxaApp = new src_1.VoxaApp({ Model: src_1.Model, variables: variables_1.variables, views: views_1.views });
        const platform = new src_1.AlexaPlatform(voxaApp);
        const alexaEvent = new src_1.AlexaEvent(event);
        alexaEvent.platform = platform;
        voxaApp.onIntent("SomeIntent", () => ({
            alexaPlayAudio: {
                behavior: "REPLACE_ALL",
                offsetInMilliseconds: 0,
                token: "123",
                url: "url",
            },
            tell: "ExitIntent.Farewell",
            to: "entry",
        }));
        const reply = (await voxaApp.execute(alexaEvent, new src_1.AlexaReply()));
        chai_1.expect(reply.response.directives).to.not.be.undefined;
        chai_1.expect(reply.response.directives).to.have.length(1);
        chai_1.expect(reply.response.directives).to.deep.equal([
            {
                audioItem: {
                    metadata: {},
                    stream: {
                        offsetInMilliseconds: 0,
                        token: "123",
                        url: "url",
                    },
                },
                playBehavior: "REPLACE_ALL",
                type: "AudioPlayer.Play",
            },
        ]);
    });
    it("should include all directives in the reply even if die", async () => {
        const voxaApp = new src_1.VoxaApp({ Model: src_1.Model, variables: variables_1.variables, views: views_1.views });
        const platform = new src_1.AlexaPlatform(voxaApp);
        const alexaEvent = new src_1.AlexaEvent(event);
        alexaEvent.platform = platform;
        voxaApp.onIntent("SomeIntent", () => ({
            alexaPlayAudio: {
                behavior: "REPLACE_ALL",
                offsetInMilliseconds: 0,
                token: "123",
                url: "url",
            },
            say: "ExitIntent.Farewell",
        }));
        const reply = (await voxaApp.execute(alexaEvent, new src_1.AlexaReply()));
        chai_1.expect(reply.response.directives).to.not.be.undefined;
        chai_1.expect(reply.response.directives).to.have.length(1);
        chai_1.expect(reply.response.directives).to.deep.equal([
            {
                audioItem: {
                    metadata: {},
                    stream: {
                        offsetInMilliseconds: 0,
                        token: "123",
                        url: "url",
                    },
                },
                playBehavior: "REPLACE_ALL",
                type: "AudioPlayer.Play",
            },
        ]);
    });
    it("should render all messages after each transition", async () => {
        const launchEvent = rb.getIntentRequest("LaunchIntent");
        const voxaApp = new src_1.VoxaApp({ Model: src_1.Model, views: views_1.views, variables: variables_1.variables });
        const platform = new src_1.AlexaPlatform(voxaApp);
        const alexaEvent = launchEvent;
        statesDefinition.LaunchIntent = {
            to: "fourthState",
        };
        statesDefinition.fourthState = (request) => {
            request.model.count = 0;
            return { say: "Count.Say", to: "fifthState" };
        };
        statesDefinition.fifthState = (request) => {
            request.model.count = 1;
            return { tell: "Count.Tell", to: "die" };
        };
        _.map(statesDefinition, (state, name) => voxaApp.onState(name, state));
        const reply = await platform.execute(alexaEvent);
        chai_1.expect(reply.speech).to.deep.equal("<speak>0\n1</speak>");
    });
    it("should call onIntentRequest callbacks before the statemachine", async () => {
        const voxaApp = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
        const platform = new src_1.AlexaPlatform(voxaApp);
        const alexaEvent = new src_1.AlexaEvent(event);
        alexaEvent.platform = platform;
        _.map(statesDefinition, (state, name) => voxaApp.onState(name, state));
        const stubResponse = "STUB RESPONSE";
        const stub = simple.stub().resolveWith(stubResponse);
        voxaApp.onIntentRequest(stub);
        const reply = (await voxaApp.execute(alexaEvent, new src_1.AlexaReply()));
        chai_1.expect(stub.called).to.be.true;
        chai_1.expect(reply).to.not.equal(stubResponse);
        chai_1.expect(reply.speech).to.equal("<speak>Ok. For more info visit example.com site.</speak>");
    });
    describe("onRequestStarted", () => {
        it("should return the onError response for exceptions thrown in onRequestStarted", async () => {
            const voxaApp = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
            const platform = new src_1.AlexaPlatform(voxaApp);
            const alexaEvent = new src_1.AlexaEvent(event);
            alexaEvent.platform = platform;
            const spy = simple.spy(() => {
                throw new Error("FAIL!");
            });
            voxaApp.onRequestStarted(spy);
            await voxaApp.execute(alexaEvent, new src_1.AlexaReply());
            chai_1.expect(spy.called).to.be.true;
        });
    });
    describe("Reply", () => {
        it("should pick up the say and reprompt statements", async () => {
            const voxaApp = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
            const platform = new src_1.AlexaPlatform(voxaApp);
            const launchEvent = rb.getIntentRequest("LaunchIntent");
            voxaApp.onIntent("LaunchIntent", {
                flow: "yield",
                reply: "Reply.Say",
                to: "entry",
            });
            const response = await platform.execute(launchEvent);
            chai_1.expect(response.speech).to.deep.equal("<speak>this is a say</speak>");
            chai_1.expect(response.reprompt).to.deep.equal("<speak>this is a reprompt</speak>");
            chai_1.expect(response.hasTerminated).to.be.false;
        });
        it("should pick up Hint and card statements", async () => {
            const voxaApp = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
            voxaApp.onIntent("SomeIntent", {
                flow: "yield",
                reply: "Reply.Card",
                reprompt: "Reprompt",
                say: "Say",
                to: "entry",
            });
            const alexaSkill = new src_1.AlexaPlatform(voxaApp);
            const response = await alexaSkill.execute(event);
            chai_1.expect(_.get(response, "response.outputSpeech.ssml")).to.deep.equal("<speak>say</speak>");
            chai_1.expect(_.get(response, "response.reprompt.outputSpeech.ssml")).to.deep.equal("<speak>reprompt</speak>");
            chai_1.expect(response.response.card).to.deep.equal({
                image: {
                    largeImageUrl: "https://example.com/large.jpg",
                    smallImageUrl: "https://example.com/small.jpg",
                },
                title: "Title",
                type: "Standard",
            });
            chai_1.expect(_.get(response, "response.directives[0]")).to.deep.equal({
                hint: {
                    text: "this is the hint",
                    type: "PlainText",
                },
                type: "Hint",
            });
        });
        it("should pickup arrays in the reply", async () => {
            const voxaApp = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
            voxaApp.onIntent("SomeIntent", {
                flow: "yield",
                reply: ["Reply.Say", "Reply.Card"],
                to: "entry",
            });
            const alexaSkill = new src_1.AlexaPlatform(voxaApp);
            const response = await alexaSkill.execute(event);
            chai_1.expect(response.speech).to.deep.equal("<speak>this is a say</speak>");
            chai_1.expect(response.reprompt).to.deep.equal("<speak>this is a reprompt</speak>");
            chai_1.expect(response.hasTerminated).to.be.false;
            chai_1.expect(response.response.card).to.deep.equal({
                image: {
                    largeImageUrl: "https://example.com/large.jpg",
                    smallImageUrl: "https://example.com/small.jpg",
                },
                title: "Title",
                type: "Standard",
            });
            chai_1.expect(_.get(response, "response.directives[0]")).to.deep.equal({
                hint: {
                    text: "this is the hint",
                    type: "PlainText",
                },
                type: "Hint",
            });
        });
        it("should add the says from multiple replies", async () => {
            const voxaApp = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
            voxaApp.onIntent("SomeIntent", {
                flow: "yield",
                reply: ["Reply.Say", "Reply.Say2"],
                to: "entry",
            });
            const alexaSkill = new src_1.AlexaPlatform(voxaApp);
            const response = await alexaSkill.execute(event);
            chai_1.expect(response.speech).to.deep.equal("<speak>this is a say\nthis is another say</speak>");
            chai_1.expect(response.reprompt).to.deep.equal("<speak>this is a reprompt</speak>");
            chai_1.expect(response.hasTerminated).to.be.false;
        });
        it("should add reply keys to the transiiton", async () => {
            const voxaApp = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
            const launchEvent = rb.getIntentRequest("LaunchIntent");
            voxaApp.onIntent("LaunchIntent", {
                flow: "yield",
                reply: "Reply.Say",
                to: "entry",
            });
            voxaApp.onBeforeReplySent((voxaEvent, reply, transition) => {
                voxaEvent.model.transition = transition;
            });
            const platform = new src_1.AlexaPlatform(voxaApp);
            const response = await platform.execute(launchEvent);
            chai_1.expect(response.sessionAttributes.model.transition).to.deep.equal({
                flow: "yield",
                reply: "Reply.Say",
                reprompt: "Reply.Say.reprompt",
                say: "Reply.Say.say",
                to: "entry",
            });
        });
    });
});
//# sourceMappingURL=VoxaApp.spec.js.map