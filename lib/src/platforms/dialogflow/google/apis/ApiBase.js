"use strict";
/*
 * Copyright (c) 2019 Rain Agency <contact@rain.agency>
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
const googleapis_1 = require("googleapis");
const _ = require("lodash");
class ApiBase {
    constructor(event, log, transactionOptions) {
        this.log = log;
        this.transactionOptions = transactionOptions;
        this.tag = ""; // the class reference for error logging
        this.rawEvent = _.cloneDeep(event);
    }
    /**
     * Gets Google's Credentials: access_token, refresh_token, expiration_date, token_type
     */
    async getCredentials() {
        try {
            const client = this.getClient();
            const result = await client.authorize();
            return result;
        }
        catch (error) {
            this.log.debug("error", {
                error,
                tag: this.tag,
            });
            throw error;
        }
    }
    getClient() {
        const key = _.get(this, "transactionOptions.key");
        const keyFile = _.get(this, "transactionOptions.keyFile");
        const scopes = ["https://www.googleapis.com/auth/actions.purchases.digital"];
        if (!keyFile && !key) {
            throw new Error("keyFile for transactions missing");
        }
        if (key) {
            return new googleapis_1.google.auth.JWT(key.client_email, undefined, key.private_key, scopes, undefined);
        }
        const params = {
            keyFile,
            scopes,
        };
        return new googleapis_1.google.auth.JWT(params);
    }
}
exports.ApiBase = ApiBase;
//# sourceMappingURL=ApiBase.js.map