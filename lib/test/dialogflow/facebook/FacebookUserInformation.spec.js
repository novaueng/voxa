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
const chai_1 = require("chai");
const _ = require("lodash");
const nock = require("nock");
const src_1 = require("../../../src");
const FacebookEvent_1 = require("../../../src/platforms/dialogflow/facebook/FacebookEvent");
const variables_1 = require("./../../variables");
const views_1 = require("./../../views");
const recipient = {
    id: "1234567890",
};
describe("FacebookUserInformation", () => {
    let event;
    let app;
    let facebookBot;
    beforeEach(() => {
        event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
        const pageAccessToken = "accessToken";
        app = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
        facebookBot = new src_1.FacebookPlatform(app, { pageAccessToken });
        const userInfo = {
            firstName: "John",
            gender: "male",
            id: "1234567890123546",
            lastName: "Doe",
            locale: "en_US",
            name: "John Doe",
            profilePic: "profilePic",
            timezone: -6,
        };
        mockFacebookActions();
        const actionsArray = [
            src_1.FACEBOOK_USER_FIELDS.NAME,
            src_1.FACEBOOK_USER_FIELDS.TIMEZONE,
        ];
        nock("https://graph.facebook.com")
            .get(`/${recipient.id}?access_token=accessToken&fields=${src_1.FACEBOOK_USER_FIELDS.ALL}`)
            .reply(200, JSON.stringify(userInfo))
            .get(`/${recipient.id}?access_token=accessToken&fields=${_.join(actionsArray, ",")}`)
            .reply(200, JSON.stringify(userInfo));
    });
    afterEach(() => {
        nock.cleanAll();
    });
    it("should get full contact information and send all Facebook Actions", async () => {
        app.onIntent("LaunchIntent", async (voxaEvent) => {
            await voxaEvent.facebook.sendMarkSeenAction();
            await voxaEvent.facebook.sendTypingOnAction();
            await voxaEvent.facebook.sendTypingOffAction();
            const info = await voxaEvent.getUserInformation(src_1.FACEBOOK_USER_FIELDS.ALL);
            voxaEvent.model.info = info;
            return {
                flow: "terminate",
                text: "Facebook.User.FullInfo",
                to: "die",
            };
        });
        const reply = await facebookBot.execute(event);
        const outputSpeech = "Nice to meet you John Doe!";
        let sessionAttributes = _.find(reply.outputContexts, (x) => _.endsWith(x.name, "attributes"));
        sessionAttributes = JSON.parse(sessionAttributes.parameters.attributes);
        chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal(outputSpeech);
        chai_1.expect(sessionAttributes.state).to.equal("die");
    });
    it("should get full contact information and send an array of Facebook Actions", async () => {
        app.onIntent("LaunchIntent", async (voxaEvent) => {
            await voxaEvent.facebook.sendMarkSeenAction();
            await voxaEvent.facebook.sendTypingOnAction();
            await voxaEvent.facebook.sendTypingOffAction();
            const actionsArray = [
                src_1.FACEBOOK_USER_FIELDS.NAME,
                src_1.FACEBOOK_USER_FIELDS.TIMEZONE,
            ];
            const info = await voxaEvent.getUserInformation(actionsArray);
            voxaEvent.model.info = info;
            return {
                flow: "terminate",
                text: "Facebook.User.FullInfo",
                to: "die",
            };
        });
        const reply = await facebookBot.execute(event);
        const outputSpeech = "Nice to meet you John Doe!";
        let sessionAttributes = _.find(reply.outputContexts, (x) => _.endsWith(x.name, "attributes"));
        sessionAttributes = JSON.parse(sessionAttributes.parameters.attributes);
        chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal(outputSpeech);
        chai_1.expect(sessionAttributes.state).to.equal("die");
    });
    it("should pass control over Page Inbox", async () => {
        event.queryResult.action = "PassControlIntent";
        event.queryResult.intent.displayName = "PassControlIntent";
        app.onIntent("PassControlIntent", async (voxaEvent) => {
            await voxaEvent.facebook.passThreadControlToPageInbox("metadata");
            return {
                flow: "terminate",
                text: "Facebook.ControlPassed.text",
                to: "die",
            };
        });
        const reply = await facebookBot.execute(event);
        const outputSpeech = "Ok. An agent will talk to you soon!";
        let sessionAttributes = _.find(reply.outputContexts, (x) => _.endsWith(x.name, "attributes"));
        sessionAttributes = JSON.parse(sessionAttributes.parameters.attributes);
        chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal(outputSpeech);
        chai_1.expect(sessionAttributes.state).to.equal("die");
    });
    it("should request control from Page Inbox", async () => {
        event.queryResult.action = "RequestControlIntent";
        event.queryResult.intent.displayName = "RequestControlIntent";
        app.onIntent("RequestControlIntent", async (voxaEvent) => {
            await voxaEvent.facebook.requestThreadControl("metadata");
            return {
                flow: "terminate",
                text: "Facebook.ControlRequested.text",
                to: "die",
            };
        });
        const reply = await facebookBot.execute(event);
        const outputSpeech = "Ok. Now I'm talking to you!";
        let sessionAttributes = _.find(reply.outputContexts, (x) => _.endsWith(x.name, "attributes"));
        sessionAttributes = JSON.parse(sessionAttributes.parameters.attributes);
        chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal(outputSpeech);
        chai_1.expect(sessionAttributes.state).to.equal("die");
    });
    it("should take control from Page Inbox", async () => {
        event.queryResult.action = "TakeControlIntent";
        event.queryResult.intent.displayName = "TakeControlIntent";
        app.onIntent("TakeControlIntent", async (voxaEvent) => {
            await voxaEvent.facebook.takeThreadControl("metadata");
            return {
                flow: "terminate",
                text: "Facebook.ControlTaken.text",
                to: "die",
            };
        });
        const reply = await facebookBot.execute(event);
        const outputSpeech = "Ok. Now I'm taking the control!";
        let sessionAttributes = _.find(reply.outputContexts, (x) => _.endsWith(x.name, "attributes"));
        sessionAttributes = JSON.parse(sessionAttributes.parameters.attributes);
        chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal(outputSpeech);
        chai_1.expect(sessionAttributes.state).to.equal("die");
    });
    it("should throw an error when sending Facebook MarkSeen Action", async () => {
        nock.cleanAll();
        nock("https://graph.facebook.com")
            .post("/v3.2/me/messages?access_token=accessToken", {
            recipient,
            sender_action: src_1.FACEBOOK_ACTIONS.MARK_SEEN,
        })
            .replyWithError({
            code: 403,
            message: "Access to this resource cannot be requested",
        });
        app.onIntent("LaunchIntent", async (voxaEvent) => {
            await voxaEvent.facebook.sendMarkSeenAction();
            await voxaEvent.facebook.sendTypingOnAction();
            await voxaEvent.facebook.sendTypingOffAction();
            const info = await voxaEvent.getUserInformation(src_1.FACEBOOK_USER_FIELDS.ALL);
            voxaEvent.model.info = info;
            return {
                flow: "terminate",
                text: "Facebook.User.FullInfo",
                to: "die",
            };
        });
        const reply = await facebookBot.execute(event);
        const outputSpeech = "An unrecoverable error occurred.";
        chai_1.expect(reply.fulfillmentText).to.equal(outputSpeech);
    });
    it("should throw an error when getting user's information", async () => {
        nock.cleanAll();
        mockFacebookActions();
        nock("https://graph.facebook.com")
            .get(`/id?fields=${src_1.FACEBOOK_USER_FIELDS.ALL}&access_token=accessToken`)
            .replyWithError({
            code: 403,
            message: "Access to this resource cannot be requested",
        });
        app.onIntent("LaunchIntent", async (voxaEvent) => {
            await voxaEvent.facebook.sendMarkSeenAction();
            await voxaEvent.facebook.sendTypingOnAction();
            await voxaEvent.facebook.sendTypingOffAction();
            const info = await voxaEvent.getUserInformation(src_1.FACEBOOK_USER_FIELDS.ALL);
            voxaEvent.model.info = info;
            return {
                flow: "terminate",
                text: "Facebook.User.FullInfo",
                to: "die",
            };
        });
        const reply = await facebookBot.execute(event);
        const outputSpeech = "An unrecoverable error occurred.";
        chai_1.expect(reply.fulfillmentText).to.equal(outputSpeech);
    });
});
function mockFacebookActions() {
    nock("https://graph.facebook.com")
        .post("/v3.2/me/messages?access_token=accessToken", {
        recipient,
        sender_action: src_1.FACEBOOK_ACTIONS.MARK_SEEN,
    })
        .reply(200)
        .post("/v3.2/me/messages?access_token=accessToken", {
        recipient,
        sender_action: src_1.FACEBOOK_ACTIONS.TYPING_ON,
    })
        .reply(200)
        .post("/v3.2/me/messages?access_token=accessToken", {
        recipient,
        sender_action: src_1.FACEBOOK_ACTIONS.TYPING_OFF,
    })
        .reply(200)
        .post("/v3.2/me/pass_thread_control?access_token=accessToken", {
        metadata: "metadata",
        recipient,
        target_app_id: FacebookEvent_1.PAGE_INBOX_ID,
    })
        .reply(200)
        .post("/v3.2/me/request_thread_control?access_token=accessToken", {
        metadata: "metadata",
        recipient,
    })
        .reply(200)
        .post("/v3.2/me/take_thread_control?access_token=accessToken", {
        metadata: "metadata",
        recipient,
    })
        .reply(200);
}
//# sourceMappingURL=FacebookUserInformation.spec.js.map