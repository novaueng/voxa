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
 * Order Status Events Builder class reference
 */
class OrderStatusEventBuilder extends EventBuilder_1.EventBuilder {
    constructor() {
        super("AMAZON.OrderStatus.Updated");
        this.state = {};
    }
    setStatus(status, expectedArrival, enterTimestamp) {
        this.state = { status, enterTimestamp };
        if (expectedArrival) {
            this.state.deliveryDetails = { expectedArrival };
        }
        return this;
    }
    getPayload() {
        return {
            order: {
                seller: {
                    name: "localizedattribute:sellerName",
                },
            },
            state: this.state,
        };
    }
}
exports.OrderStatusEventBuilder = OrderStatusEventBuilder;
var ORDER_STATUS;
(function (ORDER_STATUS) {
    ORDER_STATUS["ORDER_DELIVERED"] = "ORDER_DELIVERED";
    ORDER_STATUS["ORDER_OUT_FOR_DELIVERY"] = "ORDER_OUT_FOR_DELIVERY";
    ORDER_STATUS["ORDER_PREPARING"] = "ORDER_PREPARING";
    ORDER_STATUS["ORDER_RECEIVED"] = "ORDER_RECEIVED";
    ORDER_STATUS["ORDER_SHIPPED"] = "ORDER_SHIPPED";
    ORDER_STATUS["PREORDER_RECEIVED"] = "PREORDER_RECEIVED";
})(ORDER_STATUS = exports.ORDER_STATUS || (exports.ORDER_STATUS = {}));
//# sourceMappingURL=OrderStatusEventBuilder.js.map