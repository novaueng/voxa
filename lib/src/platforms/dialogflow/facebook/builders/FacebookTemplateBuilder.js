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
class FacebookTemplateBuilder {
    constructor() {
        this.buttons = [];
        this.elements = [];
    }
    addButton(button) {
        this.buttons.push(button);
        return this;
    }
    addElement(element) {
        this.elements.push(element);
        return this;
    }
    setImageAspectRatio(imageAspectRatio) {
        this.imageAspectRatio = imageAspectRatio;
        return this;
    }
    setSharable(sharable) {
        this.sharable = sharable;
        return this;
    }
    setText(text) {
        this.text = text;
        return this;
    }
    setTopElementStyle(topElementStyle) {
        this.topElementStyle = topElementStyle;
        return this;
    }
    build() {
        const template = {
            elements: this.elements,
            imageAspectRatio: this.imageAspectRatio,
            sharable: this.sharable,
            text: this.text,
            topElementStyle: this.topElementStyle,
        };
        if (!_.isEmpty(this.buttons)) {
            template.buttons = this.buttons;
        }
        return _.omitBy(template, _.isNil);
    }
}
exports.FacebookTemplateBuilder = FacebookTemplateBuilder;
//# sourceMappingURL=FacebookTemplateBuilder.js.map