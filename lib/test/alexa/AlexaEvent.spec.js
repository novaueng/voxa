"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _ = require("lodash");
const nock = require("nock");
const src_1 = require("../../src/");
const tools_1 = require("../tools");
const variables_1 = require("../variables");
const views_1 = require("../views");
describe("AlexaEvent", () => {
    const rb = new tools_1.AlexaRequestBuilder();
    it("should show an empty intent if not an intent request", () => {
        const alexaEvent = new src_1.AlexaEvent(rb.getSessionEndedRequest());
        chai_1.expect(alexaEvent.intent).to.be.undefined;
    });
    it("should format intent slots", () => {
        const rawEvent = rb.getIntentRequest("SomeIntent", {
            Dish: "Fried Chicken",
        });
        const alexaEvent = new src_1.AlexaEvent(rawEvent);
        chai_1.expect(alexaEvent.intent.params).to.deep.equal({ Dish: "Fried Chicken" });
    });
    it("should get token", () => {
        const rawEvent = rb.getPlaybackStoppedRequest("some-token");
        const alexaEvent = new src_1.AlexaEvent(rawEvent);
        chai_1.expect(alexaEvent.token).to.equal("some-token");
    });
    it("should find users on the context", () => {
        const rawEvent = rb.getIntentRequest("SomeIntent");
        delete rawEvent.session;
        const alexaEvent = new src_1.AlexaEvent(rawEvent);
        chai_1.expect(alexaEvent.user.userId).to.equal(_.get(rawEvent, "context.System.user.userId"));
    });
    it("should find users on the session", () => {
        // The Echo simulator from the test menu doesn't provide the context, so this is necessary
        const rawEvent = rb.getIntentRequest("SomeIntent");
        delete rawEvent.context;
        const alexaEvent = new src_1.AlexaEvent(rawEvent);
        chai_1.expect(alexaEvent.user.userId).to.equal(_.get(rawEvent, "session.user.userId"));
    });
    it("should set session attributes to an object on receiving a null value", () => {
        const rawEvent = rb.getLaunchRequest();
        const alexaEvent = new src_1.AlexaEvent(rawEvent);
        chai_1.expect(alexaEvent.session.attributes).to.deep.equal({});
    });
    it("should return supported capabilities", () => {
        const rawEvent = rb.getLaunchRequest();
        const alexaEvent = new src_1.AlexaEvent(rawEvent);
        chai_1.expect(alexaEvent.supportedInterfaces).to.deep.equal([
            "Alexa.Presentation.APL",
            "AudioPlayer",
            "Display",
            "VideoApp",
        ]);
    });
    it("should add DisplayElementSelected intent params", () => {
        const rawEvent = rb.getDisplayElementSelectedRequest("SleepSingleIntent@2018-09-13T00:40:16.047Z");
        const alexaEvent = new src_1.AlexaEvent(rawEvent);
        chai_1.expect(alexaEvent.intent.params).to.be.ok;
    });
    it("should add AlexaPresentationAPLUserEvent intent params", () => {
        const rawEvent = rb.getAlexaPresentationAPLUserEvent();
        const alexaEvent = new src_1.AlexaEvent(rawEvent);
        chai_1.expect(alexaEvent.intent.params).to.be.ok;
    });
});
describe("LoginWithAmazon", () => {
    const rb = new tools_1.AlexaRequestBuilder();
    let voxaApp;
    let alexaSkill;
    beforeEach(() => {
        voxaApp = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
        alexaSkill = new src_1.AlexaPlatform(voxaApp);
    });
    afterEach(() => {
        nock.cleanAll();
    });
    it("should validate user information", async () => {
        const lwaResult = {
            email: "johndoe@example.com",
            name: "John Doe",
            userId: "amzn1.account.K2LI23KL2LK2",
            zipCode: "12345",
        };
        nock("https://api.amazon.com")
            .get("/user/profile?access_token=accessToken")
            .reply(200, {
            email: "johndoe@example.com",
            name: "John Doe",
            postal_code: "12345",
            user_id: "amzn1.account.K2LI23KL2LK2",
        });
        const rawEvent = rb.getLaunchRequest();
        _.set(rawEvent, "session.user.accessToken", "accessToken");
        const alexaEvent = new src_1.AlexaEvent(rawEvent);
        alexaEvent.platform = alexaSkill;
        const userDetails = await alexaEvent.getUserInformation();
        chai_1.expect(userDetails).to.deep.equal(lwaResult);
    });
    it("should throw an error when accessToken is empty", async () => {
        const rawEvent = rb.getLaunchRequest();
        const alexaEvent = new src_1.AlexaEvent(rawEvent);
        alexaEvent.platform = alexaSkill;
        let exceptionWasThrown = false;
        try {
            await alexaEvent.getUserInformation();
        }
        catch (err) {
            exceptionWasThrown = true;
            chai_1.expect(err.message).to.equal("this.user.accessToken is empty");
        }
        chai_1.expect(exceptionWasThrown).to.be.true;
    });
});
//# sourceMappingURL=AlexaEvent.spec.js.map