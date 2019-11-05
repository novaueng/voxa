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
/**
 * Events Builder class reference
 */
class EventBuilder {
    constructor(name) {
        this.expiryTime = "";
        this.timestamp = "";
        this.localizedAttributes = [];
        this.payload = {};
        this.referenceId = "";
        this.relevantAudience = {};
        this.name = name;
    }
    addContent(locale, localizedKey, localizedValue) {
        this.localizedAttributes = this.localizedAttributes || [];
        let item = _.find(this.localizedAttributes, (x) => x.locale === locale);
        if (!item) {
            item = { locale };
            item[localizedKey] = localizedValue;
            this.localizedAttributes.push(item);
        }
        else {
            item[localizedKey] = localizedValue;
        }
        return this;
    }
    /*
     * expiryTime must be in GMT
     */
    setExpiryTime(expiryTime) {
        this.expiryTime = expiryTime;
        return this;
    }
    setPayload(payload) {
        this.payload = payload;
        return this;
    }
    setReferenceId(referenceId) {
        this.referenceId = referenceId;
        return this;
    }
    setMulticast() {
        this.relevantAudience = {
            payload: {},
            type: "Multicast",
        };
        return this;
    }
    /*
     * timestamp must be in GMT
     */
    setTimestamp(timestamp) {
        this.timestamp = timestamp;
        return this;
    }
    setUnicast(userId) {
        this.relevantAudience = {
            payload: { user: userId },
            type: "Unicast",
        };
        return this;
    }
    getPayload() {
        return this.payload;
    }
    build() {
        return {
            event: {
                name: this.name,
                payload: this.getPayload(),
            },
            expiryTime: this.expiryTime,
            localizedAttributes: this.localizedAttributes,
            referenceId: this.referenceId,
            relevantAudience: this.relevantAudience,
            timestamp: this.timestamp,
        };
    }
}
exports.EventBuilder = EventBuilder;
//# sourceMappingURL=EventBuilder.js.map