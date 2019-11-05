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
/**
 * Template Builder class reference
 */
class FacebookElementTemplateBuilder {
    constructor() {
        this.buttons = [];
        this.title = "";
    }
    addButton(button) {
        this.buttons.push(button);
        return this;
    }
    setImageUrl(imageUrl) {
        this.imageUrl = imageUrl;
        return this;
    }
    setSubtitle(subtitle) {
        this.subtitle = subtitle;
        return this;
    }
    setTitle(title) {
        this.title = title;
        return this;
    }
    setUrl(url) {
        this.url = url;
        return this;
    }
    setDefaultActionUrl(defaultActionUrl) {
        this.defaultActionUrl = defaultActionUrl;
        return this;
    }
    setDefaultActionFallbackUrl(defaultActionFallbackUrl) {
        this.defaultActionFallbackUrl = defaultActionFallbackUrl;
        return this;
    }
    setDefaultMessengerExtensions(defaultMessengerExtensions) {
        this.defaultMessengerExtensions = defaultMessengerExtensions;
        return this;
    }
    setDefaultWebviewHeightRatio(defaultWebviewHeightRatio) {
        this.defaultWebviewHeightRatio = defaultWebviewHeightRatio;
        return this;
    }
    setSharable(sharable) {
        this.sharable = sharable;
        return this;
    }
    build() {
        const template = {
            buttons: this.buttons,
            defaultActionFallbackUrl: this.defaultActionFallbackUrl,
            defaultActionUrl: this.defaultActionUrl,
            defaultMessengerExtensions: this.defaultMessengerExtensions,
            defaultWebviewHeightRatio: this.defaultWebviewHeightRatio,
            imageUrl: this.imageUrl,
            sharable: this.sharable,
            subtitle: this.subtitle,
            title: this.title,
            url: this.url,
        };
        return _.omitBy(template, _.isNil);
    }
}
exports.FacebookElementTemplateBuilder = FacebookElementTemplateBuilder;
//# sourceMappingURL=FacebookElementTemplateBuilder.js.map