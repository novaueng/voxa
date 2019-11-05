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
const EventBuilder_1 = require("./EventBuilder");
/**
 * Media Content Events Builder class reference
 */
class MediaContentEventBuilder extends EventBuilder_1.EventBuilder {
    constructor() {
        super("AMAZON.MediaContent.Available");
        this.availability = {};
        this.content = {};
    }
    setAvailability(method) {
        this.availability = {
            method,
            provider: {
                name: "localizedattribute:providerName",
            },
            startTime: new Date().toISOString(),
        };
        return this;
    }
    setContentType(contentType) {
        this.content = {
            contentType,
            name: "localizedattribute:contentName",
        };
        return this;
    }
    getPayload() {
        return {
            availability: this.availability,
            content: this.content,
        };
    }
}
exports.MediaContentEventBuilder = MediaContentEventBuilder;
var MEDIA_CONTENT_METHOD;
(function (MEDIA_CONTENT_METHOD) {
    MEDIA_CONTENT_METHOD["AIR"] = "AIR";
    MEDIA_CONTENT_METHOD["DROP"] = "DROP";
    MEDIA_CONTENT_METHOD["PREMIERE"] = "PREMIERE";
    MEDIA_CONTENT_METHOD["RELEASE"] = "RELEASE";
    MEDIA_CONTENT_METHOD["STREAM"] = "STREAM";
})(MEDIA_CONTENT_METHOD = exports.MEDIA_CONTENT_METHOD || (exports.MEDIA_CONTENT_METHOD = {}));
var MEDIA_CONTENT_TYPE;
(function (MEDIA_CONTENT_TYPE) {
    MEDIA_CONTENT_TYPE["ALBUM"] = "ALBUM";
    MEDIA_CONTENT_TYPE["BOOK"] = "BOOK";
    MEDIA_CONTENT_TYPE["EPISODE"] = "EPISODE";
    MEDIA_CONTENT_TYPE["GAME"] = "GAME";
    MEDIA_CONTENT_TYPE["MOVIE"] = "MOVIE";
    MEDIA_CONTENT_TYPE["SINGLE"] = "SINGLE";
})(MEDIA_CONTENT_TYPE = exports.MEDIA_CONTENT_TYPE || (exports.MEDIA_CONTENT_TYPE = {}));
//# sourceMappingURL=MediaContentEventBuilder.js.map