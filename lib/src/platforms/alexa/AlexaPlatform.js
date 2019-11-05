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
const errors_1 = require("../../errors");
const VoxaPlatform_1 = require("../VoxaPlatform");
const AlexaEvent_1 = require("./AlexaEvent");
const AlexaReply_1 = require("./AlexaReply");
const directives_1 = require("./directives");
const AlexaRequests = [
    "AudioPlayer.PlaybackStarted",
    "AudioPlayer.PlaybackFinished",
    "AudioPlayer.PlaybackNearlyFinished",
    "AudioPlayer.PlaybackStopped",
    "AudioPlayer.PlaybackFailed",
    "System.ExceptionEncountered",
    "PlaybackController.NextCommandIssued",
    "PlaybackController.PauseCommandIssued",
    "PlaybackController.PlayCommandIssued",
    "PlaybackController.PreviousCommandIssued",
    "AlexaSkillEvent.ProactiveSubscriptionChanged",
    "AlexaSkillEvent.SkillAccountLinked",
    "AlexaSkillEvent.SkillEnabled",
    "AlexaSkillEvent.SkillDisabled",
    "AlexaSkillEvent.SkillPermissionAccepted",
    "AlexaSkillEvent.SkillPermissionChanged",
    "AlexaHouseholdListEvent.ItemsCreated",
    "AlexaHouseholdListEvent.ItemsUpdated",
    "AlexaHouseholdListEvent.ItemsDeleted",
    "Connections.Response",
    "Display.ElementSelected",
    "CanFulfillIntentRequest",
    "GameEngine.InputHandlerEvent",
    "Alexa.Presentation.APL.UserEvent",
    "Messaging.MessageReceived",
];
class AlexaPlatform extends VoxaPlatform_1.VoxaPlatform {
    constructor(voxaApp, config = {}) {
        super(voxaApp, config);
        this.name = "alexa";
        this.EventClass = AlexaEvent_1.AlexaEvent;
        this.config = config;
        this.app.onCanFulfillIntentRequest((event, reply) => {
            if (_.includes(this.config.defaultFulfillIntents, event.intent.name)) {
                reply.fulfillIntent("YES");
                _.each(event.intent.params, (value, slotName) => {
                    reply.fulfillSlot(slotName, "YES", "YES");
                });
            }
            return reply;
        });
    }
    getDirectiveHandlers() {
        return [
            directives_1.AccountLinkingCard,
            directives_1.ConnectionsSendRequest,
            directives_1.DialogDelegate,
            directives_1.DialogElicitSlot,
            directives_1.GadgetControllerLightDirective,
            directives_1.GameEngineStartInputHandler,
            directives_1.GameEngineStopInputHandler,
            directives_1.Hint,
            directives_1.HomeCard,
            directives_1.PlayAudio,
            directives_1.VideoAppLaunch,
            directives_1.RenderTemplate,
            directives_1.APLTemplate,
            directives_1.APLCommand,
            directives_1.StopAudio,
        ];
    }
    getPlatformRequests() {
        return AlexaRequests;
    }
    async execute(rawEvent, context) {
        this.checkAppIds(rawEvent);
        const alexaEvent = (await this.getEvent(rawEvent, context));
        const alexaReply = this.getReply(alexaEvent);
        try {
            this.app.onRequestStarted(this.checkSessionEndedRequest, true, "alexa");
            return this.app.execute(alexaEvent, alexaReply);
        }
        catch (error) {
            return this.app.handleErrors(alexaEvent, error, alexaReply);
        }
    }
    getReply(event) {
        return new AlexaReply_1.AlexaReply();
    }
    checkSessionEndedRequest(alexaEvent) {
        const { request } = alexaEvent.rawEvent;
        if (request.type === "SessionEndedRequest" && request.reason === "ERROR") {
            throw new errors_1.OnSessionEndedError(request.error);
        }
    }
    checkAppIds(rawEvent) {
        if (!this.config.appIds) {
            return;
        }
        // Validate that this AlexaRequest originated from authorized source.
        const appId = rawEvent.context.System.application.applicationId;
        const expectedAppids = _.isArray(this.config.appIds)
            ? this.config.appIds
            : [this.config.appIds];
        if (!_.includes(expectedAppids, appId)) {
            throw new Error("Invalid applicationId");
        }
    }
}
exports.AlexaPlatform = AlexaPlatform;
//# sourceMappingURL=AlexaPlatform.js.map