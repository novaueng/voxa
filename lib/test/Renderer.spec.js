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
const utils_1 = require("../src/platforms/alexa/utils");
const tools_1 = require("./tools");
const variables_1 = require("./variables");
const views_1 = require("./views");
const i18n = require("i18next");
const rb = new tools_1.AlexaRequestBuilder();
describe("Renderer", () => {
    let statesDefinition;
    let rawEvent;
    let event;
    let renderer;
    let voxaApp;
    before(async () => {
        await i18n.init({
            load: "all",
            nonExplicitWhitelist: true,
            resources: views_1.views,
        });
    });
    beforeEach(() => {
        voxaApp = new src_1.VoxaApp({ views: views_1.views });
        renderer = new src_1.Renderer({ views: views_1.views, variables: variables_1.variables });
        rawEvent = rb.getIntentRequest("SomeIntent");
        event = new src_1.AlexaEvent(rawEvent);
        event.platform = new src_1.AlexaPlatform(voxaApp);
        event.t = i18n.getFixedT("en-US");
        statesDefinition = {
            LaunchIntent: { to: "endState" },
            SomeIntent: { to: "endState" },
            endState: { ask: "ExitIntent.Farewell", to: "die" },
            initState: { to: "endState" },
            secondState: { to: "initState" },
            thirdState: () => Promise.resolve({ to: "endState" }),
        };
    });
    const locales = {
        "de-DE": {
            number: "ein",
            question: "wie spät ist es?",
            say: "sagen\nwie spät ist es?",
            site: "Ok für weitere Infos besuchen example.com Website",
        },
        "en-US": {
            number: "one",
            question: "What time is it?",
            say: "say\nWhat time is it?",
            site: "Ok. For more info visit example.com site.",
        },
    };
    it("should launch an exception if no views are provided", () => {
        chai_1.expect(() => new src_1.Renderer({ views: null })).to.throw(); // tslint-disable-line no-unused-expressions
    });
    it("should return an error if the views file doesn't have the local strings", async () => {
        const localeMissing = "en-GB";
        const skill = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
        skill.onIntent("SomeIntent", () => ({ ask: "Number.One" }));
        event.request.locale = localeMissing;
        const reply = await skill.execute(event, new src_1.AlexaReply());
        // expect(reply.error.message).to.equal(`View Number.One for ${localeMissing} locale is missing`);
        chai_1.expect(reply.speech).to.equal("<speak>An unrecoverable error occurred.</speak>");
    });
    _.forEach(locales, (translations, locale) => {
        describe(locale, () => {
            let app;
            let skill;
            beforeEach(() => {
                app = new src_1.VoxaApp({ variables: variables_1.variables, views: views_1.views });
                skill = new src_1.AlexaPlatform(app);
            });
            it(`should return the correct translation for ${locale}`, async () => {
                _.map(statesDefinition, (state, name) => skill.onState(name, state));
                if (utils_1.isLocalizedRequest(rawEvent.request)) {
                    rawEvent.request.locale = locale;
                }
                const reply = await skill.execute(rawEvent);
                chai_1.expect(reply.speech).to.equal(`<speak>${translations.site}</speak>`);
                chai_1.expect(reply.response.directives).to.be.undefined;
            });
            it(`work with array responses ${locale}`, async () => {
                skill.onIntent("SomeIntent", () => ({
                    ask: "Ask",
                    say: "Say",
                    to: "entry",
                }));
                if (utils_1.isLocalizedRequest(rawEvent.request)) {
                    rawEvent.request.locale = locale;
                }
                const reply = await skill.execute(rawEvent);
                chai_1.expect(reply.speech).to.deep.equal(`<speak>${translations.say}</speak>`);
                chai_1.expect(reply.response.directives).to.be.undefined;
            });
            it("should have the locale available in variables", async () => {
                skill.onIntent("SomeIntent", () => ({ tell: "Number.One" }));
                if (utils_1.isLocalizedRequest(rawEvent.request)) {
                    rawEvent.request.locale = locale;
                }
                const reply = await skill.execute(rawEvent);
                chai_1.expect(reply.speech).to.equal(`<speak>${translations.number}</speak>`);
                chai_1.expect(reply.response.directives).to.be.undefined;
            });
            it("should return response with directives", async () => {
                skill.onIntent("SomeIntent", () => ({
                    alexaPlayAudio: {
                        token: "123",
                        url: "url",
                    },
                    ask: "Ask",
                    to: "entry",
                }));
                if (utils_1.isLocalizedRequest(rawEvent.request)) {
                    rawEvent.request.locale = locale;
                }
                const reply = await skill.execute(rawEvent);
                chai_1.expect(reply.speech).to.equal(`<speak>${translations.question}</speak>`);
                chai_1.expect(reply.response.directives).to.be.ok;
            });
        });
    });
    it("should render the correct view based on path", async () => {
        const rendered = await renderer.renderPath("Ask", event);
        chai_1.expect(rendered).to.deep.equal({
            ask: "What time is it?",
            reprompt: "What time is it?",
        });
    });
    it("should use the passed variables and model", async () => {
        event.model = new src_1.Model();
        event.model.count = 1;
        const rendered = await renderer.renderMessage({ say: "{count}" }, event);
        chai_1.expect(rendered).to.deep.equal({ say: "1" });
    });
    it("should fail for missing variables", (done) => {
        renderer
            .renderMessage({ say: "{missing}" }, event)
            .then(() => done("Should have failed"))
            .catch((error) => {
            chai_1.expect(error.message).to.equal("No such variable in views, missing");
            done();
        });
    });
    it("should throw an exception if path doesn't exists", (done) => {
        renderer.renderPath("Missing.Path", event).then(() => done("Should have thrown"), (error) => {
            chai_1.expect(error.message).to.equal("View Missing.Path for en-US locale is missing");
            done();
        });
    });
    it("should use deeply search to render object variable", async () => {
        event.model = new src_1.Model();
        event.model.count = 1;
        const rendered = await renderer.renderMessage({ card: "{exitCard}", number: 1 }, event);
        chai_1.expect(rendered).to.deep.equal({
            card: {
                image: {
                    largeImageUrl: "largeImage.jpg",
                    smallImageUrl: "smallImage.jpg",
                },
                text: "text",
                title: "title",
                type: "Standard",
            },
            number: 1,
        });
    });
    it("should use deeply search variable and model in complex object structure", async () => {
        event.model = new src_1.Model();
        event.model.count = 1;
        const rendered = await renderer.renderMessage({
            card: { title: "{count}", text: "{count}", array: [{ a: "{count}" }] },
        }, event);
        chai_1.expect(rendered).to.deep.equal({
            card: {
                array: [{ a: "1" }],
                text: "1",
                title: "1",
            },
        });
    });
    it("should use deeply search to render array variable", async () => {
        const reply = await renderer.renderMessage({ card: "{exitArray}" }, event);
        chai_1.expect(reply).to.deep.equal({ card: [{ a: 1 }, { b: 2 }, { c: 3 }] });
    });
    it("should use the dialogflow view if available", async () => {
        const dialogflowEvent = new src_1.DialogflowEvent(require("./requests/dialogflow/launchIntent.json"), {});
        dialogflowEvent.t = event.t;
        dialogflowEvent.platform = new src_1.DialogflowPlatform(voxaApp);
        const rendered = await renderer.renderPath("LaunchIntent.OpenResponse", dialogflowEvent);
        chai_1.expect(rendered).to.equal("Hello from Dialogflow");
    });
    it("should use the google view if available", async () => {
        const dialogflowEvent = new src_1.GoogleAssistantEvent(require("./requests/dialogflow/launchIntent.json"), {});
        dialogflowEvent.t = event.t;
        dialogflowEvent.platform = new src_1.GoogleAssistantPlatform(voxaApp);
        const rendered = await renderer.renderPath("LaunchIntent.OpenResponse", dialogflowEvent);
        chai_1.expect(rendered).to.equal("Hello from Google Assistant");
    });
});
//# sourceMappingURL=Renderer.spec.js.map