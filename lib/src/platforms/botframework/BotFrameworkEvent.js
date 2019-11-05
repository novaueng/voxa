"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const VoxaEvent_1 = require("../../VoxaEvent");
const MicrosoftCortanaIntents = {
    "Microsoft.Launch": "LaunchIntent",
    "Microsoft.NoIntent": "NoIntent",
    "Microsoft.YesIntent": "YesIntent",
};
class BotFrameworkEvent extends VoxaEvent_1.VoxaEvent {
    constructor(rawEvent, logOptions, context) {
        super(rawEvent, logOptions, context);
        this.requestToRequest = {
            endOfConversation: "SessionEndedRequest",
        };
        this.utilitiesIntentMapping = {
            "Utilities.Cancel": "CancelIntent",
            "Utilities.Confirm": "YesIntent",
            // ther's no evident map of this ones so i just leave them as is
            // "Utilities.FinishTask": "",
            // "Utilities.GoBack": "",
            "Utilities.Help": "HelpIntent",
            "Utilities.Repeat": "RepeatIntent",
            "Utilities.ShowNext": "NextIntent",
            "Utilities.ShowPrevious": "PreviousIntent",
            "Utilities.StartOver": "StartOverIntent",
            "Utilities.Stop": "StopIntent",
        };
        this.request = this.getRequest();
        this.mapRequestToRequest();
        if (rawEvent.intent) {
            this.request.type = "IntentRequest";
            this.intent = this.mapUtilitiesIntent(rawEvent.intent);
        }
        else {
            this.mapRequestToIntent();
            this.getIntentFromEntity();
        }
        this.initUser();
    }
    get supportedInterfaces() {
        const entity = getEntity(this.rawEvent.message, "DeviceInfo");
        if (!entity) {
            return [];
        }
        return entity.supportsDisplay === "true" ? ["Display"] : [];
    }
    async getUserInformation() {
        // TODO: RETURN USER'S INFORMATION
        return {};
    }
    initSession() {
        const privateConversationData = this.rawEvent.stateData.privateConversationData || {};
        const sessionId = _.get(this.rawEvent.message, "address.conversation.id");
        this.session = {
            attributes: privateConversationData,
            new: _.isEmpty(privateConversationData),
            outputAttributes: {},
            sessionId,
        };
    }
    getIntentFromEntity() {
        if (!isIMessage(this.rawEvent.message)) {
            return;
        }
        const intentEntity = getEntity(this.rawEvent.message, "Intent");
        if (!intentEntity) {
            return;
        }
        if (intentEntity.name === "None") {
            return;
        }
        this.request.type = "IntentRequest";
        this.intent = {
            name: MicrosoftCortanaIntents[intentEntity.name] || intentEntity.name,
            params: {},
            rawIntent: intentEntity,
        };
    }
    mapUtilitiesIntent(intent) {
        if (this.utilitiesIntentMapping[intent.name]) {
            intent.name = this.utilitiesIntentMapping[intent.name];
        }
        return intent;
    }
    initUser() {
        const userId = _.get(this.rawEvent.message, "address.user.id") || "";
        const user = {
            id: userId,
            userId,
        };
        if (isIMessage(this.rawEvent.message)) {
            const auth = getEntity(this.rawEvent.message, "AuthorizationToken");
            if (auth) {
                user.accessToken = auth.token;
            }
        }
        this.user = user;
    }
    mapRequestToIntent() {
        if (isIConversationUpdate(this.rawEvent.message) &&
            this.rawEvent.message.address.channelId === "webchat") {
            // in webchat we get a conversationUpdate event when the application window is open and another when the
            // user sends his first message, we want to identify that and only do a LaunchIntent for the first one
            const membersAdded = this.rawEvent.message
                .membersAdded;
            const bot = this.rawEvent.message.address.bot;
            if (membersAdded && bot && membersAdded.length === 1) {
                if (membersAdded[0].id === bot.id) {
                    this.intent = {
                        name: "LaunchIntent",
                        params: {},
                        rawIntent: {},
                    };
                    this.request.type = "IntentRequest";
                    return;
                }
            }
        }
        else {
            super.mapRequestToIntent();
        }
    }
    getRequest() {
        const type = this.rawEvent.message.type;
        let locale;
        if (isIMessage(this.rawEvent.message)) {
            if (this.rawEvent.message.textLocale) {
                locale = this.rawEvent.message.textLocale;
            }
            if (this.rawEvent.message.entities) {
                const entity = getEntity(this.rawEvent.message, "clientInfo");
                if (entity && entity.locale) {
                    locale = entity.locale;
                }
            }
        }
        return { type, locale };
    }
}
exports.BotFrameworkEvent = BotFrameworkEvent;
function isIMessage(event) {
    return event.type === "message";
}
exports.isIMessage = isIMessage;
function isIConversationUpdate(event) {
    return event.type === "conversationUpdate";
}
exports.isIConversationUpdate = isIConversationUpdate;
function getEntity(msg, type) {
    if (!msg.entities) {
        return;
    }
    return _.find(msg.entities, (entity) => entity.type === type);
}
exports.getEntity = getEntity;
//# sourceMappingURL=BotFrameworkEvent.js.map