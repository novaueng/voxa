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
const _ = require("lodash");
const directives_1 = require("../directives");
/**
 * Template Builder class reference
 */
class FacebookButtonTemplateBuilder {
    constructor() {
        this.title = "";
        this.type = directives_1.FACEBOOK_BUTTONS.POSTBACK;
    }
    setFallbackUrl(fallbackUrl) {
        this.fallbackUrl = fallbackUrl;
        return this;
    }
    setMessengerExtensions(messengerExtensions) {
        this.messengerExtensions = messengerExtensions;
        return this;
    }
    setPayload(payload) {
        this.payload = payload;
        return this;
    }
    setTitle(title) {
        this.title = title;
        return this;
    }
    setType(type) {
        this.type = type;
        return this;
    }
    setUrl(url) {
        this.url = url;
        return this;
    }
    setWebviewHeightRatio(webviewHeightRatio) {
        this.webviewHeightRatio = webviewHeightRatio;
        return this;
    }
    build() {
        const template = {
            fallbackUrl: this.fallbackUrl,
            messengerExtensions: this.messengerExtensions,
            payload: this.payload,
            title: this.title,
            type: this.type,
            url: this.url,
            webviewHeightRatio: this.webviewHeightRatio,
        };
        return _.omitBy(template, _.isNil);
    }
}
exports.FacebookButtonTemplateBuilder = FacebookButtonTemplateBuilder;
//# sourceMappingURL=FacebookButtonTemplateBuilder.js.map