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
const querystring = require("querystring");
const rp = require("request-promise");
/**
 * Messaging API class reference
 * https://developer.amazon.com/docs/smapi/skill-messaging-api-reference.html
 */
class AuthenticationBase {
    constructor(clientId, clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
    }
    /**
     * Gets new access token
     * https://developer.amazon.com/docs/smapi/configure-an-application-or-service-to-send-messages-to-your-skill.html
     */
    getAuthenticationToken(scope) {
        const bodyRequest = {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: "client_credentials",
            scope,
        };
        const options = {
            body: decodeURIComponent(querystring.stringify(bodyRequest)),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            json: true,
            method: "POST",
            uri: "https://api.amazon.com/auth/O2/token",
        };
        return Promise.resolve(rp(options));
    }
}
exports.AuthenticationBase = AuthenticationBase;
//# sourceMappingURL=AuthenticationBase.js.map