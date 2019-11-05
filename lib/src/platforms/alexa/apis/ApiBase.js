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
const _ = require("lodash");
const rp = require("request-promise");
class ApiBase {
    constructor(event, log) {
        this.log = log;
        this.errorCodeSafeToIgnore = 0; // the code error to ignore on checkError function
        this.tag = ""; // the class reference for error logging
        this.rawEvent = _.cloneDeep(event);
    }
    getResult(path = "", method = "GET", body) {
        const options = {
            body,
            headers: {
                Authorization: `Bearer ${this.getToken()}`,
            },
            json: true,
            method,
            uri: `${this.getEndpoint()}/${path}`,
        };
        return Promise.resolve(rp(options));
    }
    checkError(error) {
        this.log.debug("error", {
            error,
            tag: this.tag,
        });
        if (error.statusCode === this.errorCodeSafeToIgnore ||
            error.error.code === this.errorCodeSafeToIgnore) {
            return undefined;
        }
        throw error;
    }
    getToken() {
        return _.get(this.rawEvent, "context.System.apiAccessToken");
    }
    getEndpoint() {
        return _.get(this.rawEvent, "context.System.apiEndpoint");
    }
}
exports.ApiBase = ApiBase;
//# sourceMappingURL=ApiBase.js.map