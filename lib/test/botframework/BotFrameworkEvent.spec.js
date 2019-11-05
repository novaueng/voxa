"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Promise.resolve().then(() => require("mocha"));
const chai_1 = require("chai");
const _ = require("lodash");
const BotFrameworkEvent_1 = require("../../src/platforms/botframework/BotFrameworkEvent");
const BotFrameworkPlatform_1 = require("../../src/platforms/botframework/BotFrameworkPlatform");
describe("BotFrameworkEvent", () => {
    const stateData = {};
    it("should map a webchat conversationUpdate to a LaunchIntent", () => {
        const message = BotFrameworkPlatform_1.prepIncomingMessage(_.cloneDeep(require("../requests/botframework/conversationUpdate.json")));
        const event = new BotFrameworkEvent_1.BotFrameworkEvent({ message, stateData });
        chai_1.expect(event.request.type).to.equal("IntentRequest");
        if (!event.intent) {
            throw new Error("Intent should not be undefined");
        }
        chai_1.expect(event.intent.name).to.equal("LaunchIntent");
    });
    it("should map a Microsoft.Launch intent to a voxa LaunchIntent", () => {
        const message = _.cloneDeep(require("../requests/botframework/microsoft.launch.json"));
        const event = new BotFrameworkEvent_1.BotFrameworkEvent({ message, stateData });
        chai_1.expect(event.request.type).to.equal("IntentRequest");
        if (!event.intent) {
            throw new Error("Intent should not be undefined");
        }
        chai_1.expect(event.intent.name).to.equal("LaunchIntent");
    });
    it("should give display as a supportedInterface when available", () => {
        const message = _.cloneDeep(require("../requests/botframework/microsoft.launch.json"));
        const event = new BotFrameworkEvent_1.BotFrameworkEvent({ message, stateData });
        chai_1.expect(event.supportedInterfaces).to.deep.equal(["Display"]);
    });
    it("should return empty supported interfaces if the entity is not present", () => {
        const message = _.cloneDeep(require("../requests/botframework/StaintIntent.json"));
        const event = new BotFrameworkEvent_1.BotFrameworkEvent({ message, stateData });
        chai_1.expect(event.supportedInterfaces).to.deep.equal([]);
    });
    it("should map an endOfConversation request to a voxa SessionEndedRequest", () => {
        const message = require("../requests/botframework/endOfRequest.json");
        const event = new BotFrameworkEvent_1.BotFrameworkEvent({ message, stateData });
        chai_1.expect(event.request.type).to.equal("SessionEndedRequest");
    });
    it("should return undefined when requesting user information", async () => {
        const message = require("../requests/botframework/endOfRequest.json");
        const event = new BotFrameworkEvent_1.BotFrameworkEvent({ message, stateData });
        chai_1.expect(await event.getUserInformation()).to.deep.equal({});
    });
    const utilitiesIntentMapping = {
        "Utilities.Cancel": "CancelIntent",
        "Utilities.Confirm": "YesIntent",
        "Utilities.Help": "HelpIntent",
        "Utilities.Repeat": "RepeatIntent",
        "Utilities.ShowNext": "NextIntent",
        "Utilities.ShowPrevious": "PreviousIntent",
        "Utilities.StartOver": "StartOverIntent",
        "Utilities.Stop": "StopIntent",
    };
    _.map(utilitiesIntentMapping, (to, from) => {
        it(`should map ${from} intento to ${to}`, () => {
            const message = _.cloneDeep(require("../requests/botframework/StaintIntent.json"));
            const intent = {
                name: from,
                params: {},
            };
            const event = new BotFrameworkEvent_1.BotFrameworkEvent({ message, intent, stateData });
            if (!event.intent) {
                throw new Error("Intent should not be undefined");
            }
            chai_1.expect(event.intent.name).to.equal(to);
        });
    });
    it("should correctly map the user", () => {
        const message = BotFrameworkPlatform_1.prepIncomingMessage(_.cloneDeep(require("../requests/botframework/StaintIntent.json")));
        const event = new BotFrameworkEvent_1.BotFrameworkEvent({ message, stateData });
        chai_1.expect(event.user).to.deep.equal({
            id: "LTSO852UtAD",
            userId: "LTSO852UtAD",
        });
    });
    it("builds the session", () => {
        const message = BotFrameworkPlatform_1.prepIncomingMessage(_.cloneDeep(require("../requests/botframework/StaintIntent.json")));
        const event = new BotFrameworkEvent_1.BotFrameworkEvent({ message, stateData });
        chai_1.expect(event.session.attributes).to.be.a("object");
        chai_1.expect(event.session.outputAttributes).to.be.a("object");
    });
});
//# sourceMappingURL=BotFrameworkEvent.spec.js.map