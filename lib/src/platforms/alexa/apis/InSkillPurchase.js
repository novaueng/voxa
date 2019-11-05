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
const rp = require("request-promise");
const utils_1 = require("../utils");
const directives_1 = require("../directives");
class InSkillPurchase {
    constructor(event, log) {
        this.log = log;
        this.rawEvent = _.cloneDeep(event);
    }
    static buy(productId, token) {
        const payload = this.formatPayload(productId);
        return new directives_1.ConnectionsSendRequest("Buy", payload, token);
    }
    static cancel(productId, token) {
        return this.sendConnectionSendRequest("Cancel", productId, token);
    }
    static upsell(productId, upsellMessage, token) {
        return this.sendConnectionSendRequest("Upsell", productId, token, upsellMessage);
    }
    static sendConnectionSendRequest(method, productId, token, upsellMessage) {
        const payload = this.formatPayload(productId, upsellMessage);
        return new directives_1.ConnectionsSendRequest(method, payload, token);
    }
    static formatPayload(productId, upsellMessage) {
        return {
            InSkillProduct: {
                productId,
            },
            upsellMessage,
        };
    }
    isAllowed() {
        const ALLOWED_ISP_ENDPOINTS = {
            "en-US": "https://api.amazonalexa.com",
        };
        const locale = utils_1.isLocalizedRequest(this.rawEvent.request) ? this.rawEvent.request.locale : "en-us";
        const endpoint = _.get(this.rawEvent, "context.System.apiEndpoint");
        return _.get(ALLOWED_ISP_ENDPOINTS, locale) === endpoint;
    }
    async buyByReferenceName(referenceName, token) {
        const product = await this.getProductByReferenceName(referenceName);
        return InSkillPurchase.buy(_.get(product, "productId"), token);
    }
    async cancelByReferenceName(referenceName, token) {
        const product = await this.getProductByReferenceName(referenceName);
        return InSkillPurchase.cancel(_.get(product, "productId"), token);
    }
    async upsellByReferenceName(referenceName, upsellMessage, token) {
        const product = await this.getProductByReferenceName(referenceName);
        return InSkillPurchase.upsell(_.get(product, "productId"), upsellMessage, token);
    }
    async getProductByReferenceName(referenceName) {
        const result = await this.getProductList();
        return _.find(result.inSkillProducts, { referenceName }) || {};
    }
    getProductList() {
        const { apiEndpoint, apiAccessToken } = this.rawEvent.context.System;
        const options = {
            headers: {
                "Accept-Language": utils_1.isLocalizedRequest(this.rawEvent.request) ? this.rawEvent.request.locale : "en-us",
                "Authorization": `Bearer ${apiAccessToken}`,
                "Content-Type": "application/json",
            },
            json: true,
            method: "GET",
            uri: `${apiEndpoint}/v1/users/~current/skills/~current/inSkillProducts`,
        };
        return rp(options);
    }
}
exports.InSkillPurchase = InSkillPurchase;
//# sourceMappingURL=InSkillPurchase.js.map