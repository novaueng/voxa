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
const _ = require("lodash");
const uuid_1 = require("uuid");
const azure_1 = require("../azure");
const lambda_1 = require("../lambda");
const create_server_1 = require("./create-server");
class VoxaPlatform {
    constructor(app, config = {}) {
        this.app = app;
        this.config = config;
        _.forEach(this.getDirectiveHandlers(), (directive) => app.directiveHandlers.push(directive));
        _.forEach(this.getPlatformRequests(), (requestType) => app.registerRequestHandler(requestType));
    }
    startServer(port) {
        if (!port) {
            port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
        }
        return new Promise((resolve, reject) => {
            const server = create_server_1.createServer(this);
            server.listen(port, () => {
                console.log(`Listening on port ${port}`);
                resolve(server);
            });
        });
    }
    async execute(rawEvent, context) {
        const event = await this.getEvent(rawEvent, context);
        const reply = this.getReply(event);
        return this.app.execute(event, reply);
    }
    lambda() {
        return async (event, context, callback) => {
            try {
                const result = await this.execute(event, context);
                return callback(null, result);
            }
            catch (error) {
                return callback(error);
            }
        };
    }
    lambdaHTTP() {
        return async (event, context, callback) => {
            try {
                const body = JSON.parse(event.body || "");
                const result = await this.execute(body, context);
                const response = {
                    body: JSON.stringify(result),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                    statusCode: 200,
                };
                return callback(null, response);
            }
            catch (error) {
                callback(error);
            }
        };
    }
    azureFunction() {
        return async (context, req) => {
            context.res = {
                body: {
                    error: {
                        message: `Method ${req.method} not supported.`,
                        type: "not_supported",
                    },
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                },
                status: azure_functions_ts_essentials_1.HttpStatusCode.MethodNotAllowed,
            };
            if (req.method === azure_functions_ts_essentials_1.HttpMethod.Post) {
                try {
                    const body = await this.execute(req.body, context);
                    context.res.body = body;
                    context.res.status = azure_functions_ts_essentials_1.HttpStatusCode.OK;
                }
                catch (error) {
                    context.res.body = error;
                    context.res.status = azure_functions_ts_essentials_1.HttpStatusCode.InternalServerError;
                }
            }
        };
    }
    onIntent(intentName, handler) {
        this.app.onIntent(intentName, handler, this.name);
    }
    onState(stateName, handler, intents = []) {
        this.app.onState(stateName, handler, intents, this.name);
    }
    async getEvent(rawEvent, context) {
        const event = new this.EventClass(rawEvent, this.getLogOptions(context), context);
        event.platform = this;
        if (event.afterPlatformInitialized) {
            event.afterPlatformInitialized();
        }
        return event;
    }
    getLogOptions(executionContext) {
        const logOptions = _.merge({
            meta: {
                requestId: this.getRequestId(executionContext),
            },
        }, this.app.config.logOptions);
        if (_.includes(process.env.DEBUG, "voxa")) {
            logOptions.debug = true;
            logOptions.dev = true;
        }
        return logOptions;
    }
    getRequestId(executionContext) {
        if (lambda_1.isLambdaContext(executionContext)) {
            return executionContext.awsRequestId;
        }
        if (azure_1.isAzureContext(executionContext) && executionContext.invocationId) {
            return executionContext.invocationId;
        }
        return uuid_1.v1();
    }
    getPlatformRequests() {
        return [];
    }
}
exports.VoxaPlatform = VoxaPlatform;
//# sourceMappingURL=VoxaPlatform.js.map