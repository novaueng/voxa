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
const DialogflowPlatform_1 = require("../DialogflowPlatform");
const directives_1 = require("./directives");
const FacebookEvent_1 = require("./FacebookEvent");
const FacebookReply_1 = require("./FacebookReply");
class FacebookPlatform extends DialogflowPlatform_1.DialogflowPlatform {
    constructor(app, config = {}) {
        super(app, config);
        this.name = "facebook";
        this.EventClass = FacebookEvent_1.FacebookEvent;
    }
    getReply() {
        return new FacebookReply_1.FacebookReply();
    }
    getDirectiveHandlers() {
        return [
            directives_1.FacebookAccountLink,
            directives_1.FacebookAccountUnlink,
            directives_1.FacebookButtonTemplate,
            directives_1.FacebookCarousel,
            directives_1.FacebookList,
            directives_1.FacebookOpenGraphTemplate,
            directives_1.FacebookQuickReplyLocation,
            directives_1.FacebookQuickReplyPhoneNumber,
            directives_1.FacebookQuickReplyText,
            directives_1.FacebookQuickReplyUserEmail,
            directives_1.FacebookSuggestionChips,
        ];
    }
}
exports.FacebookPlatform = FacebookPlatform;
//# sourceMappingURL=FacebookPlatform.js.map