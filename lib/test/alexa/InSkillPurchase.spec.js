"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _ = require("lodash");
const nock = require("nock");
const src_1 = require("../../src");
const tools_1 = require("./../tools");
const variables_1 = require("./../variables");
const views_1 = require("./../views");
const rb = new tools_1.AlexaRequestBuilder();
const ispMock = {
    inSkillProducts: [
        {
            productId: "1",
            referenceName: "sword",
        },
        {
            productId: "2",
            referenceName: "shield",
        },
    ],
};
describe("InSkillPurchase", () => {
    let event;
    let app;
    let alexaSkill;
    beforeEach(() => {
        app = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
        alexaSkill = new src_1.AlexaPlatform(app);
        const reqheaders = {
            "accept": "application/json",
            "accept-language": "en-US",
            "authorization": "Bearer apiAccessToken",
            "content-type": "application/json",
            "host": "api.amazonalexa.com",
        };
        nock("https://api.amazonalexa.com", { reqheaders })
            .persist()
            .get("/v1/users/~current/skills/~current/inSkillProducts")
            .reply(200, JSON.stringify(ispMock));
    });
    afterEach(() => {
        nock.cleanAll();
    });
    it("should send a buy request", async () => {
        event = rb.getIntentRequest("BuyIntent", { productName: "sword" });
        _.set(event, "context.System.apiAccessToken", "apiAccessToken");
        alexaSkill.onIntent("BuyIntent", async (voxaEvent) => {
            const { productName } = _.get(voxaEvent, "intent.params");
            const token = "startState";
            const buyDirective = await voxaEvent.alexa.isp.buyByReferenceName(productName, token);
            return { alexaConnectionsSendRequest: buyDirective };
        });
        const reply = await alexaSkill.execute(event);
        const responseDirectives = _.get(reply, "response.directives")[0];
        chai_1.expect(reply.response.outputSpeech).to.be.undefined;
        chai_1.expect(reply.response.reprompt).to.be.undefined;
        chai_1.expect(responseDirectives.type).to.equal("Connections.SendRequest");
        chai_1.expect(responseDirectives.name).to.equal("Buy");
        chai_1.expect(responseDirectives.payload.InSkillProduct.productId).to.equal("1");
        chai_1.expect(responseDirectives.token).to.equal("startState");
        chai_1.expect(_.get(reply, "sessionAttributes.state")).to.equal("die");
        chai_1.expect(reply.response.shouldEndSession).to.equal(true);
    });
    it("should send a cancel request", async () => {
        event = rb.getIntentRequest("RefundIntent", { productName: "sword" });
        _.set(event, "context.System.apiAccessToken", "apiAccessToken");
        alexaSkill.onIntent("RefundIntent", async (voxaEvent) => {
            const { productName } = _.get(voxaEvent, "intent.params");
            const token = "startState";
            const buyDirective = await voxaEvent.alexa.isp.cancelByReferenceName(productName, token);
            return { alexaConnectionsSendRequest: buyDirective };
        });
        const reply = await alexaSkill.execute(event);
        const responseDirectives = _.get(reply, "response.directives")[0];
        chai_1.expect(reply.response.outputSpeech).to.be.undefined;
        chai_1.expect(reply.response.reprompt).to.be.undefined;
        chai_1.expect(responseDirectives.type).to.equal("Connections.SendRequest");
        chai_1.expect(responseDirectives.name).to.equal("Cancel");
        chai_1.expect(responseDirectives.payload.InSkillProduct.productId).to.equal("1");
        chai_1.expect(responseDirectives.token).to.equal("startState");
        chai_1.expect(_.get(reply, "sessionAttributes.state")).to.equal("die");
        chai_1.expect(reply.response.shouldEndSession).to.equal(true);
    });
    it("should send an upsell request", async () => {
        event = rb.getIntentRequest("BuyIntent", { productName: "shield" });
        _.set(event, "context.System.apiAccessToken", "apiAccessToken");
        const upsellMessage = "Please buy it";
        alexaSkill.onIntent("BuyIntent", async (voxaEvent) => {
            const { productName } = _.get(voxaEvent, "intent.params");
            const token = "startState";
            const buyDirective = await voxaEvent.alexa.isp.upsellByReferenceName(productName, upsellMessage, token);
            return { alexaConnectionsSendRequest: buyDirective };
        });
        const reply = await alexaSkill.execute(event);
        const responseDirectives = _.get(reply, "response.directives")[0];
        chai_1.expect(reply.response.outputSpeech).to.be.undefined;
        chai_1.expect(reply.response.reprompt).to.be.undefined;
        chai_1.expect(responseDirectives.type).to.equal("Connections.SendRequest");
        chai_1.expect(responseDirectives.name).to.equal("Upsell");
        chai_1.expect(responseDirectives.payload.InSkillProduct.productId).to.equal("2");
        chai_1.expect(responseDirectives.payload.upsellMessage).to.equal(upsellMessage);
        chai_1.expect(responseDirectives.token).to.equal("startState");
        chai_1.expect(_.get(reply, "sessionAttributes.state")).to.equal("die");
        chai_1.expect(reply.response.shouldEndSession).to.equal(true);
    });
    it("should not send ISP directives on invalid endpoint", async () => {
        event = rb.getIntentRequest("BuyIntent", { productName: "shield" });
        _.set(event, "context.System.apiEndpoint", "https://api.fe.amazonalexa.com");
        alexaSkill.onIntent("BuyIntent", (voxaEvent) => {
            if (!voxaEvent.alexa.isp.isAllowed()) {
                return { ask: "ISP.Invalid", to: "entry" };
            }
            return { to: "entry" };
        });
        const reply = await alexaSkill.execute(event);
        const outputSpeech = "To do In Skill Purchases, you need to link your Amazon account to the US market.";
        chai_1.expect(_.get(reply, "response.outputSpeech.ssml")).to.include(outputSpeech);
        chai_1.expect(_.get(reply, "response.reprompt.outputSpeech.ssml")).to.include("Can you try again?");
        chai_1.expect(_.get(reply, "response.directives")).to.be.undefined;
        chai_1.expect(_.get(reply, "sessionAttributes.state")).to.equal("entry");
        chai_1.expect(reply.response.shouldEndSession).to.equal(false);
    });
    it("should handle ACCEPTED purchase result", async () => {
        const status = {
            code: "200",
            message: "OK",
        };
        const payload = {
            message: "optional additional message",
            productId: "string",
            purchaseResult: "ACCEPTED",
        };
        event = rb.getConnectionsResponseRequest("Buy", "firstState", payload, status);
        alexaSkill.onState("firstState", () => ({}));
        alexaSkill.onIntent("Connections.Response", (voxaEvent) => {
            if (voxaEvent.rawEvent.request.payload.purchaseResult === "ACCEPTED") {
                const to = voxaEvent.rawEvent.request.token;
                return { ask: "ISP.ProductBought", to };
            }
            return { tell: "ISP.ProductNotBought" };
        });
        const reply = await alexaSkill.execute(event);
        chai_1.expect(_.get(reply, "response.outputSpeech.ssml")).to.include("Thanks for buying this product, do you want to try it out?");
        chai_1.expect(_.get(reply, "response.reprompt.outputSpeech.ssml")).to.include("Do you want to try it out?");
        chai_1.expect(_.get(reply, "sessionAttributes.state")).to.equal("firstState");
        chai_1.expect(reply.response.shouldEndSession).to.equal(false);
    });
    it("should handle DECLINED purchase result", async () => {
        const status = {
            code: "200",
            message: "OK",
        };
        const payload = {
            message: "optional additional message",
            productId: "string",
            purchaseResult: "DECLINED",
        };
        event = rb.getConnectionsResponseRequest("Buy", "firstState", payload, status);
        alexaSkill.onIntent("Connections.Response", (voxaEvent) => {
            if (voxaEvent.rawEvent.request.payload.purchaseResult === "ACCEPTED") {
                return { ask: "ISP.ProductBought" };
            }
            return { tell: "ISP.ProductNotBought" };
        });
        const reply = await alexaSkill.execute(event);
        chai_1.expect(_.get(reply, "response.outputSpeech.ssml")).to.include("Thanks for your interest");
        chai_1.expect(reply.response.reprompt).to.be.undefined;
        chai_1.expect(_.get(reply, "sessionAttributes.state")).to.equal("die");
        chai_1.expect(reply.response.shouldEndSession).to.equal(true);
    });
});
//# sourceMappingURL=InSkillPurchase.spec.js.map