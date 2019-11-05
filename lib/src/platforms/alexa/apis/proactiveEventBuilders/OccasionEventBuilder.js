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
 * Occasion Events Builder class reference
 */
class OccasionEventBuilder extends EventBuilder_1.EventBuilder {
    constructor() {
        super("AMAZON.Occasion.Updated");
        this.occasion = {};
        this.state = {};
    }
    setOccasion(bookingTime, occasionType) {
        this.occasion = {
            bookingTime,
            broker: {
                name: "localizedattribute:brokerName",
            },
            occasionType,
            provider: {
                name: "localizedattribute:providerName",
            },
            subject: "localizedattribute:subject",
        };
        return this;
    }
    setStatus(confirmationStatus) {
        this.state = { confirmationStatus };
        return this;
    }
    getPayload() {
        return {
            occasion: this.occasion,
            state: this.state,
        };
    }
}
exports.OccasionEventBuilder = OccasionEventBuilder;
var OCCASION_CONFIRMATION_STATUS;
(function (OCCASION_CONFIRMATION_STATUS) {
    OCCASION_CONFIRMATION_STATUS["CANCELED"] = "CANCELED";
    OCCASION_CONFIRMATION_STATUS["CONFIRMED"] = "CONFIRMED";
    OCCASION_CONFIRMATION_STATUS["CREATED"] = "CREATED";
    OCCASION_CONFIRMATION_STATUS["REQUESTED"] = "REQUESTED";
    OCCASION_CONFIRMATION_STATUS["RESCHEDULED"] = "RESCHEDULED";
    OCCASION_CONFIRMATION_STATUS["UPDATED"] = "UPDATED";
})(OCCASION_CONFIRMATION_STATUS = exports.OCCASION_CONFIRMATION_STATUS || (exports.OCCASION_CONFIRMATION_STATUS = {}));
var OCCASION_TYPE;
(function (OCCASION_TYPE) {
    OCCASION_TYPE["APPOINTMENT"] = "APPOINTMENT";
    OCCASION_TYPE["APPOINTMENT_REQUEST"] = "APPOINTMENT_REQUEST";
    OCCASION_TYPE["RESERVATION"] = "RESERVATION";
    OCCASION_TYPE["RESERVATION_REQUEST"] = "RESERVATION_REQUEST";
})(OCCASION_TYPE = exports.OCCASION_TYPE || (exports.OCCASION_TYPE = {}));
//# sourceMappingURL=OccasionEventBuilder.js.map