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
function isCard(card) {
    if (!("type" in card)) {
        return false;
    }
    return _.includes(["Standard", "Simple", "LinkAccount", "AskForPermissionsConsent"], card.type);
}
class AlexaDirective {
    addDirective(reply) {
        const response = reply.response;
        if (!response.directives) {
            response.directives = [];
        }
        if (!this.directive) {
            throw new Error("The directive can't be empty");
        }
        if (_.isArray(this.directive)) {
            response.directives = _.concat(response.directives, this.directive);
        }
        else {
            response.directives.push(this.directive);
        }
    }
}
exports.AlexaDirective = AlexaDirective;
class MultimediaAlexaDirective extends AlexaDirective {
    validateReply(reply) {
        if (reply.hasDirective("AudioPlayer.Play")) {
            throw new Error("Do not include both an AudioPlayer.Play" +
                " directive and a VideoApp.Launch directive in the same response");
        }
    }
}
exports.MultimediaAlexaDirective = MultimediaAlexaDirective;
class HomeCard {
    constructor(viewPath) {
        this.viewPath = viewPath;
    }
    async writeToReply(reply, event, transition) {
        if (reply.hasDirective("card")) {
            throw new Error("At most one card can be specified in a response");
        }
        let card;
        if (_.isString(this.viewPath)) {
            card = await event.renderer.renderPath(this.viewPath, event);
            if (!isCard(card)) {
                throw new Error("The view should return a Card like object");
            }
        }
        else if (isCard(this.viewPath)) {
            card = this.viewPath;
        }
        else {
            throw new Error("Argument should be a viewPath or a Card like object");
        }
        reply.response.card = card;
    }
}
HomeCard.platform = "alexa";
HomeCard.key = "alexaCard";
exports.HomeCard = HomeCard;
class Hint {
    constructor(viewPath) {
        this.viewPath = viewPath;
    }
    async writeToReply(reply, event, transition) {
        if (reply.hasDirective("Hint")) {
            throw new Error("At most one Hint directive can be specified in a response");
        }
        const response = reply.response || {};
        if (!response.directives) {
            response.directives = [];
        }
        const text = await event.renderer.renderPath(this.viewPath, event);
        response.directives.push({
            hint: {
                text,
                type: "PlainText",
            },
            type: "Hint",
        });
        reply.response = response;
    }
}
Hint.platform = "alexa";
Hint.key = "alexaHint";
exports.Hint = Hint;
class DialogDelegate extends AlexaDirective {
    constructor(slots) {
        super();
        this.slots = slots;
    }
    async writeToReply(reply, event, transition) {
        this.buildDirective(event);
        this.buildSlots(event);
        this.addDirective(reply);
    }
    buildSlots(event) {
        if (!event.intent) {
            throw new Error("An intent is required");
        }
        if (!this.slots) {
            return;
        }
        const directiveSlots = _(this.slots)
            .map((value, key) => {
            const data = {
                confirmationStatus: "NONE",
                name: key,
            };
            if (value) {
                data.value = value;
            }
            return [key, data];
        })
            .fromPairs()
            .value();
        this.directive.updatedIntent = {
            confirmationStatus: "NONE",
            name: event.intent.name,
            slots: directiveSlots,
        };
    }
    buildDirective(event) {
        this.directive = {
            type: "Dialog.Delegate",
        };
    }
}
DialogDelegate.platform = "alexa";
DialogDelegate.key = "alexaDialogDelegate";
exports.DialogDelegate = DialogDelegate;
class DialogElicitSlot extends AlexaDirective {
    constructor(options) {
        super();
        this.options = options;
    }
    static validate(options, reply, event, transition) {
        if (reply.hasDirective("Dialog.ElicitSlot")) {
            throw new Error("At most one Dialog.ElicitSlot directive can be specified in a response");
        }
        if (transition.to &&
            transition.to !== "die" &&
            transition.to !== _.get(event, "rawEvent.request.intent.name")) {
            throw new Error("You cannot transition to a new intent while using a Dialog.ElicitSlot directive");
        }
        if (!options.slotToElicit) {
            throw new Error("slotToElicit is required for the Dialog.ElicitSlot directive");
        }
        if (!_.has(event, "rawEvent.request.dialogState") ||
            _.get(event, "rawEvent.request.dialogState") === "COMPLETED") {
            throw new Error("Intent is missing dialogState or has already completed this dialog and cannot elicit any slots");
        }
    }
    async writeToReply(reply, event, transition) {
        DialogElicitSlot.validate(this.options, reply, event, transition);
        this.buildDirective(event);
        // Alexa is always going to return to this intent with the results of this dialog
        // so we can't move anywhere else.
        transition.flow = "yield";
        transition.to = _.get(event, "rawEvent.request.intent.name");
        this.addDirective(reply);
    }
    buildDirective(event) {
        const intent = _.get(event, "rawEvent.request.intent");
        const slots = intent.slots;
        if (this.options.slots) {
            _.forOwn(this.options.slots, (value, key) => {
                if (_.has(slots, key)) {
                    if (!_.has(value, "name")) {
                        _.set(value, "name", key);
                    }
                    slots[key] = value;
                }
            });
        }
        this.directive = {
            slotToElicit: this.options.slotToElicit,
            type: "Dialog.ElicitSlot",
            updatedIntent: {
                confirmationStatus: "NONE",
                name: intent.name,
                slots,
            },
        };
    }
}
DialogElicitSlot.platform = "alexa";
DialogElicitSlot.key = "alexaElicitDialog";
exports.DialogElicitSlot = DialogElicitSlot;
class RenderTemplate extends AlexaDirective {
    constructor(viewPath) {
        super();
        if (_.isString(viewPath)) {
            this.viewPath = viewPath;
        }
        else {
            this.directive = viewPath;
        }
    }
    async writeToReply(reply, event, transition) {
        this.validateReply(reply);
        if (!_.includes(event.supportedInterfaces, "Display")) {
            return;
        }
        if (this.viewPath) {
            this.directive = await event.renderer.renderPath(this.viewPath, event);
        }
        this.addDirective(reply);
    }
    validateReply(reply) {
        if (reply.hasDirective("Display.RenderTemplate")) {
            throw new Error("At most one Display.RenderTemplate directive can be specified in a response");
        }
    }
}
RenderTemplate.key = "alexaRenderTemplate";
RenderTemplate.platform = "alexa";
exports.RenderTemplate = RenderTemplate;
class APLTemplate extends AlexaDirective {
    constructor(viewPath) {
        super();
        if (_.isString(viewPath)) {
            this.viewPath = viewPath;
        }
        else {
            this.directive = viewPath;
        }
    }
    async writeToReply(reply, event, transition) {
        this.validateReply(reply);
        if (!_.includes(event.supportedInterfaces, "Alexa.Presentation.APL")) {
            return;
        }
        if (this.viewPath) {
            this.directive = await event.renderer.renderPath(this.viewPath, event);
        }
        this.addDirective(reply);
    }
    validateReply(reply) {
        if (reply.hasDirective("Alexa.Presentation.APL.RenderDocument")) {
            throw new Error("At most one Alexa.Presentation.APL.RenderDocument directive can be specified in a response");
        }
    }
}
APLTemplate.key = "alexaAPLTemplate";
APLTemplate.platform = "alexa";
exports.APLTemplate = APLTemplate;
class APLCommand extends AlexaDirective {
    constructor(viewPath) {
        super();
        if (_.isString(viewPath)) {
            this.viewPath = viewPath;
        }
        else {
            this.directive = viewPath;
        }
    }
    async writeToReply(reply, event, transition) {
        this.validateReply(reply);
        if (!_.includes(event.supportedInterfaces, "Alexa.Presentation.APL")) {
            return;
        }
        if (this.viewPath) {
            this.directive = await event.renderer.renderPath(this.viewPath, event);
        }
        this.addDirective(reply);
    }
    validateReply(reply) {
        if (reply.hasDirective("Alexa.Presentation.APL.ExecuteCommands")) {
            throw new Error("At most one Alexa.Presentation.APL.ExecuteCommands directive can be specified in a response");
        }
    }
}
APLCommand.key = "alexaAPLCommand";
APLCommand.platform = "alexa";
exports.APLCommand = APLCommand;
class AccountLinkingCard {
    async writeToReply(reply, event, transition) {
        if (reply.hasDirective("card")) {
            throw new Error("At most one card can be specified in a response");
        }
        const card = { type: "LinkAccount" };
        reply.response.card = card;
    }
}
AccountLinkingCard.key = "alexaAccountLinkingCard";
AccountLinkingCard.platform = "alexa";
exports.AccountLinkingCard = AccountLinkingCard;
class PlayAudio extends MultimediaAlexaDirective {
    constructor(data) {
        super();
        this.data = data;
    }
    async writeToReply(reply, event, transition) {
        this.validateReply(reply);
        this.directive = {
            audioItem: {
                metadata: this.data.metadata || {},
                stream: {
                    offsetInMilliseconds: this.data.offsetInMilliseconds || 0,
                    token: this.data.token,
                    url: this.data.url,
                },
            },
            playBehavior: this.data.behavior || "REPLACE_ALL",
            type: "AudioPlayer.Play",
        };
        this.addDirective(reply);
    }
}
PlayAudio.key = "alexaPlayAudio";
PlayAudio.platform = "alexa";
exports.PlayAudio = PlayAudio;
class StopAudio extends AlexaDirective {
    constructor() {
        super(...arguments);
        this.directive = {
            type: "AudioPlayer.Stop",
        };
    }
    async writeToReply(reply, event, transition) {
        this.addDirective(reply);
    }
}
StopAudio.key = "alexaStopAudio";
StopAudio.platform = "alexa";
exports.StopAudio = StopAudio;
class GadgetControllerLightDirective extends AlexaDirective {
    constructor(directive) {
        super();
        this.directive = directive;
    }
    async writeToReply(reply, event, transition) {
        this.addDirective(reply);
    }
}
GadgetControllerLightDirective.key = "alexaGadgetControllerLightDirective";
GadgetControllerLightDirective.platform = "alexa";
exports.GadgetControllerLightDirective = GadgetControllerLightDirective;
class GameEngineStartInputHandler extends AlexaDirective {
    constructor(directive) {
        super();
        this.directive = directive;
    }
    async writeToReply(reply, event, transition) {
        this.addDirective(reply);
        const response = reply.response;
        delete response.shouldEndSession;
    }
}
GameEngineStartInputHandler.key = "alexaGameEngineStartInputHandler";
GameEngineStartInputHandler.platform = "alexa";
exports.GameEngineStartInputHandler = GameEngineStartInputHandler;
class GameEngineStopInputHandler extends AlexaDirective {
    constructor(originatingRequestId) {
        super();
        this.originatingRequestId = originatingRequestId;
    }
    async writeToReply(reply, event, transition) {
        this.directive = {
            originatingRequestId: this.originatingRequestId,
            type: "GameEngine.StopInputHandler",
        };
        this.addDirective(reply);
    }
}
GameEngineStopInputHandler.key = "alexaGameEngineStopInputHandler";
GameEngineStopInputHandler.platform = "alexa";
exports.GameEngineStopInputHandler = GameEngineStopInputHandler;
class ConnectionsSendRequest extends AlexaDirective {
    constructor(name, payload, token) {
        super();
        this.payload = payload;
        this.token = token;
        this.type = "Connections.SendRequest";
        if (_.isString(name)) {
            this.name = name;
        }
        else {
            this.directive = name;
        }
    }
    async writeToReply(reply, event, transition) {
        if (this.name) {
            this.directive = {
                name: this.name,
                payload: this.payload,
                token: this.token || "token",
                type: "Connections.SendRequest",
            };
        }
        this.addDirective(reply);
    }
}
ConnectionsSendRequest.key = "alexaConnectionsSendRequest";
ConnectionsSendRequest.platform = "alexa";
exports.ConnectionsSendRequest = ConnectionsSendRequest;
class VideoAppLaunch extends MultimediaAlexaDirective {
    constructor(options) {
        super();
        this.options = options;
    }
    async writeToReply(reply, event, transition) {
        this.validateReply(reply);
        if (!_.includes(event.supportedInterfaces, "VideoApp")) {
            return;
        }
        let options;
        if (_.isString(this.options)) {
            options = await event.renderer.renderPath(this.options, event);
        }
        else {
            options = this.options;
        }
        this.directive = {
            type: "VideoApp.Launch",
            videoItem: {
                metadata: {
                    subtitle: options.subtitle,
                    title: options.title,
                },
                source: options.source,
            },
        };
        this.addDirective(reply);
    }
}
VideoAppLaunch.key = "alexaVideoAppLaunch";
VideoAppLaunch.platform = "alexa";
exports.VideoAppLaunch = VideoAppLaunch;
//# sourceMappingURL=directives.js.map