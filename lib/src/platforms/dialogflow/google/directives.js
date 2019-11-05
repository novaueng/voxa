"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_on_google_1 = require("actions-on-google");
const bluebird = require("bluebird");
const _ = require("lodash");
const directives_1 = require("../../../directives");
class DialogflowDirective {
    constructor(options, requiredCapability) {
        this.options = options;
        this.requiredCapability = requiredCapability;
    }
    hasRequiredCapability(event) {
        if (!this.requiredCapability) {
            return true;
        }
        return _.includes(event.supportedInterfaces, this.requiredCapability);
    }
    async getQuestion(QuestionClass, event) {
        if (_.isString(this.options)) {
            const options = await event.renderer.renderPath(this.options, event);
            return new QuestionClass(options);
        }
        return new QuestionClass(this.options);
    }
}
function createSystemIntentDirective(QuestionClass, key, requiredCapability) {
    var _a;
    return _a = class extends DialogflowDirective {
            constructor(options) {
                super(options, requiredCapability);
                this.options = options;
            }
            async writeToReply(reply, event, transition) {
                if (!this.hasRequiredCapability(event)) {
                    return;
                }
                const google = reply.payload.google;
                const question = await this.getQuestion(QuestionClass, event);
                google.systemIntent = {
                    data: question.inputValueData,
                    intent: question.intent,
                };
            }
        },
        _a.platform = "google",
        _a.key = key,
        _a;
}
function createRichResponseDirective(RichResponseItemClass, key, requiredCapability) {
    var _a;
    return _a = class extends DialogflowDirective {
            constructor(options) {
                super(options, requiredCapability);
                this.options = options;
            }
            async writeToReply(reply, event, transition) {
                if (!this.hasRequiredCapability(event)) {
                    return;
                }
                const google = reply.payload.google;
                if (!google.richResponse) {
                    throw new Error(`A simple response is required before a ${key}`);
                }
                const question = await this.getQuestion(RichResponseItemClass, event);
                google.richResponse.add(question);
            }
        },
        _a.platform = "google",
        _a.key = key,
        _a;
}
exports.LinkOutSuggestion = createRichResponseDirective(actions_on_google_1.LinkOutSuggestion, "dialogflowLinkOutSuggestion");
exports.NewSurface = createSystemIntentDirective(actions_on_google_1.NewSurface, "dialogflowNewSurface");
exports.List = createSystemIntentDirective(actions_on_google_1.List, "dialogflowList", "actions.capability.SCREEN_OUTPUT");
exports.Carousel = createSystemIntentDirective(actions_on_google_1.Carousel, "dialogflowCarousel", "actions.capability.SCREEN_OUTPUT");
exports.AccountLinkingCard = createSystemIntentDirective(actions_on_google_1.SignIn, "dialogflowAccountLinkingCard");
exports.Permission = createSystemIntentDirective(actions_on_google_1.Permission, "dialogflowPermission");
exports.DateTime = createSystemIntentDirective(actions_on_google_1.DateTime, "dialogflowDateTime");
exports.Confirmation = createSystemIntentDirective(actions_on_google_1.Confirmation, "dialogflowConfirmation");
exports.DeepLink = createSystemIntentDirective(actions_on_google_1.DeepLink, "dialogflowDeepLink");
exports.Place = createSystemIntentDirective(actions_on_google_1.Place, "dialogflowPlace");
exports.CompletePurchase = createSystemIntentDirective(actions_on_google_1.CompletePurchase, "googleCompletePurchase");
exports.TransactionDecision = createSystemIntentDirective(actions_on_google_1.TransactionDecision, "dialogflowTransactionDecision");
exports.TransactionRequirements = createSystemIntentDirective(actions_on_google_1.TransactionRequirements, "dialogflowTransactionRequirements");
exports.RegisterUpdate = createSystemIntentDirective(actions_on_google_1.RegisterUpdate, "dialogflowRegisterUpdate");
exports.UpdatePermission = createSystemIntentDirective(actions_on_google_1.UpdatePermission, "dialogflowUpdatePermission");
exports.BasicCard = createRichResponseDirective(actions_on_google_1.BasicCard, "dialogflowBasicCard", "actions.capability.SCREEN_OUTPUT");
exports.MediaResponse = createRichResponseDirective(actions_on_google_1.MediaResponse, "dialogflowMediaResponse", "actions.capability.AUDIO_OUTPUT");
exports.Table = createRichResponseDirective(actions_on_google_1.Table, "dialogflowTable", "actions.capability.SCREEN_OUTPUT");
exports.BrowseCarousel = createRichResponseDirective(actions_on_google_1.BrowseCarousel, "dialogflowBrowseCarousel", "actions.capability.SCREEN_OUTPUT");
class Suggestions {
    constructor(suggestions) {
        this.suggestions = suggestions;
    }
    async writeToReply(reply, event, transition) {
        let options = this.suggestions;
        if (_.isString(options)) {
            options = await event.renderer.renderPath(options, event);
        }
        const suggestions = new actions_on_google_1.Suggestions(options);
        const google = reply.payload.google;
        const richResponse = google.richResponse;
        richResponse.addSuggestion(suggestions);
    }
}
Suggestions.platform = "google";
Suggestions.key = "dialogflowSuggestions";
exports.Suggestions = Suggestions;
class Context {
    constructor(contextConfig) {
        this.contextConfig = contextConfig;
    }
    async writeToReply(reply, event, transition) {
        const conv = event.dialogflow
            .conv;
        conv.contexts.set(this.contextConfig.name, this.contextConfig.lifespan, this.contextConfig.parameters);
    }
}
Context.platform = "google";
Context.key = "dialogflowContext";
exports.Context = Context;
class Say extends directives_1.Say {
    async writeToReply(reply, event, transition) {
        const google = reply.payload.google;
        let richResponse = google.richResponse;
        if (!richResponse) {
            richResponse = new actions_on_google_1.RichResponse([]);
        }
        google.richResponse = richResponse;
        let viewPaths = this.viewPaths;
        if (_.isString(viewPaths)) {
            viewPaths = [viewPaths];
        }
        await bluebird.mapSeries(viewPaths, async (view) => {
            const statement = await event.renderer.renderPath(view, event);
            if (transition.dialogflowSplitSimpleResponses) {
                richResponse.add(new actions_on_google_1.SimpleResponse(""));
            }
            reply.addStatement(directives_1.sampleOrItem(statement, event.platform));
        });
    }
}
Say.key = "say";
Say.platform = "google";
exports.Say = Say;
//# sourceMappingURL=directives.js.map