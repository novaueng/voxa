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
const azure_functions_ts_essentials_1 = require("azure-functions-ts-essentials");
const chai_1 = require("chai");
const _ = require("lodash");
const portfinder = require("portfinder");
const rp = require("request-promise");
const src_1 = require("../src");
const azure_1 = require("../src/azure");
const tools_1 = require("./tools");
const views_1 = require("./views");
const rb = new tools_1.AlexaRequestBuilder();
describe("VoxaPlatform", () => {
    let app;
    let alexaSkill;
    let processData;
    let dialogflowAction;
    beforeEach(() => {
        app = new src_1.VoxaApp({ views: views_1.views });
        alexaSkill = new src_1.AlexaPlatform(app);
        processData = _.clone(process.env);
        dialogflowAction = new src_1.GoogleAssistantPlatform(app);
    });
    afterEach(() => {
        process.env = processData;
    });
    describe("startServer", () => {
        it("should call the execute method with an http server", async () => {
            const port = await portfinder.getPortPromise();
            const server = await alexaSkill.startServer(port);
            const options = {
                body: {
                    request: "Hello World",
                },
                json: true,
                method: "POST",
                uri: `http://localhost:${port}/`,
            };
            const response = await rp(options);
            chai_1.expect(response).to.deep.equal({
                response: {
                    outputSpeech: {
                        ssml: "<speak>An unrecoverable error occurred.</speak>",
                        type: "SSML",
                    },
                    shouldEndSession: true,
                },
                sessionAttributes: {},
                version: "1.0",
            });
            server.close();
        });
        it("should start the server on a port defined by the PORT environment variable", async () => {
            const port = await portfinder.getPortPromise();
            process.env.PORT = port.toString();
            const server = await alexaSkill.startServer();
            const options = {
                body: {
                    request: "Hello World",
                },
                json: true,
                method: "POST",
                uri: `http://localhost:${port}/`,
            };
            const response = await rp(options);
            chai_1.expect(response).to.deep.equal({
                response: {
                    outputSpeech: {
                        ssml: "<speak>An unrecoverable error occurred.</speak>",
                        type: "SSML",
                    },
                    shouldEndSession: true,
                },
                sessionAttributes: {},
                version: "1.0",
            });
            server.close();
        });
    });
    describe("lambda", () => {
        it("should call the execute method with the event and context", async () => {
            const handler = alexaSkill.lambda();
            const event = rb.getSessionEndedRequest("USER_INITIATED");
            let error;
            let result;
            let counter = 0;
            const callback = (tmpError, tmpResult) => {
                counter += 1;
                error = tmpError;
                result = tmpResult;
            };
            const context = tools_1.getLambdaContext(callback);
            await handler(event, context, callback);
            chai_1.expect(error).to.be.null;
            chai_1.expect(result).to.deep.equal({
                response: {},
                sessionAttributes: {},
                version: "1.0",
            });
        });
    });
    describe("lambdaHTTP", () => {
        it("should return a lambda http proxy response object", (done) => {
            const handler = alexaSkill.lambdaHTTP();
            const event = tools_1.getAPIGatewayProxyEvent("POST", JSON.stringify(rb.getSessionEndedRequest()));
            const callback = (error, result) => {
                try {
                    chai_1.expect(error).to.be.null;
                    chai_1.expect(result.statusCode).to.equal(200);
                    chai_1.expect(result.headers["Content-Type"]).to.equal("application/json; charset=utf-8");
                    done();
                }
                catch (error) {
                    done(error);
                }
            };
            const context = tools_1.getLambdaContext(callback);
            handler(event, context, callback);
        });
    });
    describe("azureFunction", () => {
        it("should call the execute method with the event body and return a response in context.res", async () => {
            const handler = alexaSkill.azureFunction();
            const event = {
                body: rb.getSessionEndedRequest(),
                method: azure_functions_ts_essentials_1.HttpMethod.Post,
            };
            const context = {
                bindings: {},
                done: (error, result) => { },
                invocationId: "Invocation ID",
                log: azure_1.azureLog(),
            };
            await handler(context, event);
            chai_1.expect(context.res).to.be.ok;
        });
    });
    describe("onIntent", () => {
        it("should register onIntent with platform", () => {
            const state = {
                flow: "terminate",
                tell: "Bye",
                to: "die",
            };
            alexaSkill.onIntent("LaunchIntent", state);
        });
    });
    describe("onState", () => {
        let alexaLaunch;
        let dialogflowLaunch;
        beforeEach(() => {
            process.env.DEBUG = "voxa";
            app.onIntent("LaunchIntent", {
                flow: "continue",
                to: "someState",
            });
            alexaSkill.onState("someState", {
                flow: "yield",
                sayp: "Hello from alexa",
                to: "entry",
            });
            dialogflowAction.onState("someState", {
                flow: "yield",
                sayp: "Hello from dialogflow",
                to: "entry",
            });
            alexaLaunch = rb.getIntentRequest("LaunchIntent");
            /* tslint:disable-next-line:no-var-requires */
            dialogflowLaunch = require("./requests/dialogflow/launchIntent.json");
        });
        it("should enable logging when setting the DEBUG=voxa environment variable", async () => {
            process.env.DEBUG = "voxa";
            let options = {};
            class Suit extends src_1.AlexaPlatform {
                getLogOptions(executionContext) {
                    options = super.getLogOptions(executionContext);
                    return options;
                }
            }
            const suit = new Suit(app);
            const reply = await suit.execute(alexaLaunch);
            chai_1.expect(options.debug).to.be.true;
            chai_1.expect(options.dev).to.be.true;
        });
        it("should register states as platform specific", async () => {
            const alexaReply = await alexaSkill.execute(alexaLaunch);
            chai_1.expect(alexaReply.speech).to.include("Hello from alexa");
            const dialogfloweReply = await dialogflowAction.execute(dialogflowLaunch);
            chai_1.expect(dialogfloweReply.speech).to.include("Hello from dialogflow");
        });
        it("should not modify the original transition in the state definition", async () => {
            let reply = await dialogflowAction.execute(dialogflowLaunch);
            chai_1.expect(reply.speech).to.equal("<speak>Hello from dialogflow</speak>");
            reply = await dialogflowAction.execute(dialogflowLaunch);
            chai_1.expect(reply.speech).to.equal("<speak>Hello from dialogflow</speak>");
            reply = await dialogflowAction.execute(dialogflowLaunch);
            chai_1.expect(reply.speech).to.equal("<speak>Hello from dialogflow</speak>");
        });
    });
});
//# sourceMappingURL=VoxaPlatform.spec.js.map