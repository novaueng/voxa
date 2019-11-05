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
 * Trash Collection Alert Events Builder class reference
 */
class TrashCollectionAlertEventBuilder extends EventBuilder_1.EventBuilder {
    constructor() {
        super("AMAZON.TrashCollectionAlert.Activated");
        this.alert = {};
    }
    setAlert(collectionDayOfWeek, ...garbageTypes) {
        this.alert = {
            collectionDayOfWeek,
            garbageTypes,
        };
        return this;
    }
    getPayload() {
        return { alert: this.alert };
    }
}
exports.TrashCollectionAlertEventBuilder = TrashCollectionAlertEventBuilder;
var GARBAGE_COLLECTION_DAY;
(function (GARBAGE_COLLECTION_DAY) {
    GARBAGE_COLLECTION_DAY["MONDAY"] = "MONDAY";
    GARBAGE_COLLECTION_DAY["TUESDAY"] = "TUESDAY";
    GARBAGE_COLLECTION_DAY["WEDNESDAY"] = "WEDNESDAY";
    GARBAGE_COLLECTION_DAY["THURSDAY"] = "THURSDAY";
    GARBAGE_COLLECTION_DAY["SATURDAY"] = "SATURDAY";
    GARBAGE_COLLECTION_DAY["SUNDAY"] = "SUNDAY";
})(GARBAGE_COLLECTION_DAY = exports.GARBAGE_COLLECTION_DAY || (exports.GARBAGE_COLLECTION_DAY = {}));
var GARBAGE_TYPE;
(function (GARBAGE_TYPE) {
    GARBAGE_TYPE["BOTTLES"] = "BOTTLES";
    GARBAGE_TYPE["BULKY"] = "BULKY";
    GARBAGE_TYPE["BURNABLE"] = "BURNABLE";
    GARBAGE_TYPE["CANS"] = "CANS";
    GARBAGE_TYPE["CLOTHING"] = "CLOTHING";
    GARBAGE_TYPE["COMPOSTABLE"] = "COMPOSTABLE";
    GARBAGE_TYPE["CRUSHABLE"] = "CRUSHABLE";
    GARBAGE_TYPE["GARDEN_WASTE"] = "GARDEN_WASTE";
    GARBAGE_TYPE["GLASS"] = "GLASS";
    GARBAGE_TYPE["HAZARDOUS"] = "HAZARDOUS";
    GARBAGE_TYPE["HOME_APPLIANCES"] = "HOME_APPLIANCES";
    GARBAGE_TYPE["KITCHEN_WASTE"] = "KITCHEN_WASTE";
    GARBAGE_TYPE["LANDFILL"] = "LANDFILL";
    GARBAGE_TYPE["PET_BOTTLES"] = "PET_BOTTLES";
    GARBAGE_TYPE["RECYCLABLE_PLASTICS"] = "RECYCLABLE_PLASTICS";
    GARBAGE_TYPE["WASTE_PAPER"] = "WASTE_PAPER";
})(GARBAGE_TYPE = exports.GARBAGE_TYPE || (exports.GARBAGE_TYPE = {}));
//# sourceMappingURL=TrashCollectionAlertEventBuilder.js.map