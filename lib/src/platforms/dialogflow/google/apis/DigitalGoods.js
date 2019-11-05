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
const rp = require("request-promise");
const ApiBase_1 = require("./ApiBase");
/**
 * DigitalGoods API class reference
 * https://developers.google.com/actions/transactions/digital/dev-guide-digital
 */
class DigitalGoods extends ApiBase_1.ApiBase {
    constructor(event, log, options) {
        super(event, log, options);
        this.tag = "DigitalGoods";
        this.tag = "DigitalGoods";
    }
    /**
     * Gets Entitlements from PlayStore
     */
    async getInAppEntitlements(skus) {
        return this.getSkus(skus, "SKU_TYPE_IN_APP");
    }
    /**
     * Gets Subscriptions from PlayStore
     */
    async getSubscriptions(skus) {
        return this.getSkus(skus, "SKU_TYPE_SUBSCRIPTION");
    }
    /**
     * Gets Skus from PlayStore
     */
    async getSkus(skus, type) {
        const conversationId = _.get(this.rawEvent, "originalDetectIntentRequest.payload.conversation.conversationId");
        const androidAppPackageName = _.get(this.transactionOptions, "androidAppPackageName");
        if (!androidAppPackageName) {
            throw new Error("Android App package name missing");
        }
        const credentials = await this.getCredentials();
        const bearer = credentials.access_token;
        const options = {
            auth: {
                bearer,
            },
            body: {
                conversationId,
                ids: skus,
                skuType: type,
            },
            json: true,
            method: "POST",
            uri: `https://actions.googleapis.com/v3/packages/${androidAppPackageName}/skus:batchGet`,
        };
        return rp(options);
    }
    /**
     * Gets Google Transactions Status
     */
    getPurchaseStatus() {
        const googleArguments = _.get(this.rawEvent, "originalDetectIntentRequest.payload.inputs[0].arguments", []);
        let purchaseStatus = PURCHASE_STATUS.UNSPECIFIED;
        _.forEach(googleArguments, (argument) => {
            if (argument.name === "COMPLETE_PURCHASE_VALUE") {
                purchaseStatus = argument.extension.purchaseStatus;
                return false;
            }
        });
        return purchaseStatus;
    }
    /**
     * Checks if purchase status is PURCHASE_STATUS_ALREADY_OWNED
     */
    isPurchaseStatusAlreadyOwned() {
        const purchaseStatus = this.getPurchaseStatus();
        return purchaseStatus === PURCHASE_STATUS.ALREADY_OWNED;
    }
    /**
     * Checks if purchase status is PURCHASE_STATUS_ITEM_CHANGE_REQUESTED
     */
    isPurchaseStatusChangeRequested() {
        const purchaseStatus = this.getPurchaseStatus();
        return purchaseStatus === PURCHASE_STATUS.ITEM_CHANGE_REQUESTED;
    }
    /**
     * Checks if purchase status is PURCHASE_STATUS_ERROR
     */
    isPurchaseStatusError() {
        const purchaseStatus = this.getPurchaseStatus();
        return purchaseStatus === PURCHASE_STATUS.ERROR;
    }
    /**
     * Checks if purchase status is PURCHASE_STATUS_ITEM_UNAVAILABLE
     */
    isPurchaseStatusItemUnavailable() {
        const purchaseStatus = this.getPurchaseStatus();
        return purchaseStatus === PURCHASE_STATUS.ITEM_UNAVAILABLE;
    }
    /**
     * Checks if purchase status is PURCHASE_STATUS_OK
     */
    isPurchaseStatusOk() {
        const purchaseStatus = this.getPurchaseStatus();
        return purchaseStatus === PURCHASE_STATUS.OK;
    }
    /**
     * Checks if purchase status is PURCHASE_STATUS_USER_CANCELLED
     */
    isPurchaseStatusUserCancelled() {
        const purchaseStatus = this.getPurchaseStatus();
        return purchaseStatus === PURCHASE_STATUS.USER_CANCELLED;
    }
}
exports.DigitalGoods = DigitalGoods;
var PURCHASE_STATUS;
(function (PURCHASE_STATUS) {
    PURCHASE_STATUS["ALREADY_OWNED"] = "PURCHASE_STATUS_ALREADY_OWNED";
    PURCHASE_STATUS["ERROR"] = "PURCHASE_STATUS_ERROR";
    PURCHASE_STATUS["ITEM_CHANGE_REQUESTED"] = "PURCHASE_STATUS_ITEM_CHANGE_REQUESTED";
    PURCHASE_STATUS["ITEM_UNAVAILABLE"] = "PURCHASE_STATUS_ITEM_UNAVAILABLE";
    PURCHASE_STATUS["OK"] = "PURCHASE_STATUS_OK";
    PURCHASE_STATUS["UNSPECIFIED"] = "PURCHASE_STATUS_UNSPECIFIED";
    PURCHASE_STATUS["USER_CANCELLED"] = "PURCHASE_STATUS_USER_CANCELLED";
})(PURCHASE_STATUS || (PURCHASE_STATUS = {}));
//# sourceMappingURL=DigitalGoods.js.map