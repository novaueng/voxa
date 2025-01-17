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
const chai_1 = require("chai");
const googleapis_1 = require("googleapis");
const _ = require("lodash");
const nock = require("nock");
const simple = require("simple-mock");
const dialogflow_1 = require("../../../src/platforms/dialogflow");
const VoxaApp_1 = require("../../../src/VoxaApp");
const variables_1 = require("./../../variables");
const views_1 = require("./../../views");
/* tslint:disable-next-line:no-var-requires */
const purchasStatusIntent = require("../../requests/dialogflow/actions.intent.COMPLETE_PURCHASE.json");
/* tslint:disable-next-line:no-var-requires */
const buyProductIntent = require("../../requests/dialogflow/buyProductIntent.json");
/* tslint:disable-next-line:no-var-requires */
const itemsInPlayStore = require("../../requests/dialogflow/itemsInPlayStore.json");
const config = {
    transactionOptions: {
        androidAppPackageName: "com.example.com",
        key: {},
    },
};
const configKeyFile = {
    transactionOptions: {
        androidAppPackageName: "com.example.com",
        keyFile: "./keyFile.json",
    },
};
describe("DigitalGoods", () => {
    let googleAssistantPlatform;
    let voxaApp;
    afterEach(() => {
        nock.cleanAll();
        simple.restore();
    });
    beforeEach(() => {
        mockRequests();
        voxaApp = new VoxaApp_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
        googleAssistantPlatform = new dialogflow_1.GoogleAssistantPlatform(voxaApp, config);
    });
    it("should match the right purchase status values", async () => {
        voxaApp.onIntent("actions_intent_COMPLETE_PURCHASE", (voxaEvent) => {
            chai_1.expect(voxaEvent.google.digitalGoods.isPurchaseStatusOk()).to.be.true;
            chai_1.expect(voxaEvent.google.digitalGoods.isPurchaseStatusAlreadyOwned()).to
                .be.false;
            chai_1.expect(voxaEvent.google.digitalGoods.isPurchaseStatusChangeRequested())
                .to.be.false;
            chai_1.expect(voxaEvent.google.digitalGoods.isPurchaseStatusError()).to.be
                .false;
            chai_1.expect(voxaEvent.google.digitalGoods.isPurchaseStatusItemUnavailable())
                .to.be.false;
            chai_1.expect(voxaEvent.google.digitalGoods.isPurchaseStatusUserCancelled()).to
                .be.false;
            return { to: "die" };
        });
        await googleAssistantPlatform.execute(purchasStatusIntent);
    });
    it("should find 1 subscription and 1 entitlement", async () => {
        const reqheaders = {
            reqheaders: {
                "accept": "application/json",
                "authorization": "Bearer access_token",
                "content-type": "application/json",
                "host": "actions.googleapis.com",
            },
        };
        const bodySubscription = {
            conversationId: "1528150043739",
            ids: ["test"],
            skuType: "SKU_TYPE_SUBSCRIPTION",
        };
        const bodyInAppEntitlements = {
            conversationId: "1528150043739",
            ids: ["test"],
            skuType: "SKU_TYPE_IN_APP",
        };
        const path = `/v3/packages/${_.get(config.transactionOptions, "androidAppPackageName")}/skus:batchGet`;
        nock("https://actions.googleapis.com", reqheaders)
            .post(path, bodySubscription)
            .reply(200, itemsInPlayStore)
            .post(path, bodyInAppEntitlements)
            .reply(200, itemsInPlayStore);
        const subscriptionFromPlayStore = _.head(itemsInPlayStore.skus);
        const inAppEntitlementFromPlayStore = _.nth(itemsInPlayStore.skus, 1);
        voxaApp.onIntent("BuyProductIntent", async (voxaEvent) => {
            const inAppEntitlementSkus = await voxaEvent.google.digitalGoods.getInAppEntitlements(["test"]);
            const subscriptionSkus = await voxaEvent.google.digitalGoods.getSubscriptions(["test"]);
            voxaEvent.model.inAppEntitlementsSkus = inAppEntitlementSkus.skus[1];
            voxaEvent.model.subscriptionSkus = subscriptionSkus.skus[0];
            return {
                flow: "yield",
                say: "DigitalGoods.SelectItem.say",
                to: "entry",
            };
        });
        const googleAssistantPlatformWithKeyFile = new dialogflow_1.GoogleAssistantPlatform(voxaApp, configKeyFile);
        const reply = await googleAssistantPlatformWithKeyFile.execute(buyProductIntent);
        const attributes = JSON.parse(reply.outputContexts[0].parameters.attributes);
        chai_1.expect(attributes.model.inAppEntitlementsSkus).to.deep.equal(inAppEntitlementFromPlayStore);
        chai_1.expect(attributes.model.subscriptionSkus).to.deep.equal(subscriptionFromPlayStore);
        chai_1.expect(reply.payload.google.expectUserResponse).to.be.true;
    });
    it("should throw an error when trying to get credentials", async () => {
        simple.restore();
        simple
            .mock(googleapis_1.google.auth.JWT.prototype, "authorize")
            .rejectWith(new Error("Authentication Error"));
        const errorVoxaApp = new VoxaApp_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
        const errorGoogleAssistantPlatform = new dialogflow_1.GoogleAssistantPlatform(errorVoxaApp, config);
        errorVoxaApp.onIntent("BuyProductIntent", async (voxaEvent) => {
            const subscriptionSkus = await voxaEvent.google.digitalGoods.getSkus(["test"], "SKU_TYPE_SUBSCRIPTION");
            voxaEvent.model.subscriptionSkus = subscriptionSkus;
            return {
                flow: "yield",
                say: "DigitalGoods.SelectItem.say",
                to: "entry",
            };
        });
        errorVoxaApp.onError(async (event, error, reply) => {
            chai_1.expect(error.message).to.equal("Authentication Error");
            return reply;
        });
        await errorGoogleAssistantPlatform.execute(buyProductIntent);
    });
    it("should throw an error when trying to call Google Play Store API", async () => {
        const reqheaders = {
            reqheaders: {
                "accept": "application/json",
                "authorization": "Bearer access_token",
                "content-length": "83",
                "content-type": "application/json",
                "host": "actions.googleapis.com",
            },
        };
        const body = {
            conversationId: "1528150043739",
            ids: ["test"],
            skuType: "SKU_TYPE_SUBSCRIPTION",
        };
        const path = `/v3/packages/${_.get(config.transactionOptions, "androidAppPackageName")}/skus:batchGet`;
        nock("https://actions.googleapis.com", reqheaders)
            .post(path, body)
            .replyWithError("Random Error");
        voxaApp.onIntent("BuyProductIntent", async (voxaEvent) => {
            const subscriptionSkus = await voxaEvent.google.digitalGoods.getSkus(["test"], "SKU_TYPE_SUBSCRIPTION");
            voxaEvent.model.subscriptionSkus = subscriptionSkus;
            return {
                flow: "yield",
                say: "DigitalGoods.SelectItem.say",
                to: "entry",
            };
        });
        voxaApp.onError(async (event, error, reply) => {
            chai_1.expect(error.message).to.equal("Error: Random Error");
            return reply;
        });
        await googleAssistantPlatform.execute(buyProductIntent);
    });
    it("should throw an error when transaction options object is missing", async () => {
        const errorGoogleAssistantPlatform = new dialogflow_1.GoogleAssistantPlatform(voxaApp);
        voxaApp.onIntent("BuyProductIntent", async (voxaEvent) => {
            const subscriptionSkus = await voxaEvent.google.digitalGoods.getSkus(["test"], "SKU_TYPE_SUBSCRIPTION");
            voxaEvent.model.subscriptionSkus = subscriptionSkus;
            return {
                reply: "DigitalGoods.SelectItem",
                to: "entry",
            };
        });
        voxaApp.onError(async (event, error, reply) => {
            chai_1.expect(error.message).to.equal("Android App package name missing");
            return reply;
        });
        await errorGoogleAssistantPlatform.execute(buyProductIntent);
    });
    it("should throw an error when transaction key is missing in GoogleAssistantPlatform", async () => {
        const configError = _.cloneDeep(config);
        _.unset(configError, "transactionOptions.key");
        const errorGoogleAssistantPlatform = new dialogflow_1.GoogleAssistantPlatform(voxaApp, configError);
        voxaApp.onIntent("BuyProductIntent", async (voxaEvent) => {
            const subscriptionSkus = await voxaEvent.google.digitalGoods.getSkus(["test"], "SKU_TYPE_SUBSCRIPTION");
            voxaEvent.model.subscriptionSkus = subscriptionSkus;
            return {
                reply: "DigitalGoods.SelectItem",
                to: "entry",
            };
        });
        voxaApp.onError(async (event, error, reply) => {
            chai_1.expect(error.message).to.equal("keyFile for transactions missing");
            return reply;
        });
        await errorGoogleAssistantPlatform.execute(buyProductIntent);
    });
});
function mockRequests() {
    simple.mock(googleapis_1.google.auth.JWT.prototype, "authorize").resolveWith({
        access_token: "access_token",
    });
}
//# sourceMappingURL=DigitalGoods.spec.js.map