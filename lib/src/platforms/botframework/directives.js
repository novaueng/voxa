"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const _ = require("lodash");
class RenderDirective {
    constructor(options) {
        this.options = options;
    }
    renderOptions(event) {
        if (_.isString(this.options)) {
            return event.renderer.renderPath(this.options, event);
        }
        return this.options;
    }
}
exports.RenderDirective = RenderDirective;
class SigninCard {
    constructor(signInOptions) {
        this.signInOptions = signInOptions;
    }
    async writeToReply(reply, event, transition) {
        const card = new botbuilder_1.SigninCard();
        card.button(this.signInOptions.buttonTitle, this.signInOptions.url);
        card.text(this.signInOptions.cardText);
        const attachments = reply.attachments || [];
        attachments.push(card.toAttachment());
        reply.attachments = attachments;
    }
}
SigninCard.platform = "botframework";
SigninCard.key = "botframeworkSigninCard";
exports.SigninCard = SigninCard;
class HeroCard extends RenderDirective {
    async writeToReply(reply, event, transition) {
        const card = await this.renderOptions(event);
        const attachments = reply.attachments || [];
        attachments.push(card.toAttachment());
        reply.attachments = attachments;
    }
}
HeroCard.platform = "botframework";
HeroCard.key = "botframeworkHeroCard";
exports.HeroCard = HeroCard;
class SuggestedActions extends RenderDirective {
    async writeToReply(reply, event, transition) {
        const suggestedActionsType = await this.renderOptions(event);
        const suggestedActions = suggestedActionsType.toSuggestedActions
            ? suggestedActionsType.toSuggestedActions()
            : suggestedActionsType;
        reply.suggestedActions = suggestedActions;
    }
}
SuggestedActions.key = "botframeworkSuggestedActions";
SuggestedActions.platform = "botframework";
exports.SuggestedActions = SuggestedActions;
class AudioCard extends RenderDirective {
    async writeToReply(reply, event, transition) {
        const audioCard = await this.renderOptions(event);
        const attachment = audioCard.toAttachment
            ? audioCard.toAttachment()
            : audioCard;
        if (reply.hasMessages) {
            // we want to send stuff before the audio card
            reply.inputHint = "ignoringInput";
            await reply.send();
            reply.clear();
        }
        // and now we add the card
        const attachments = reply.attachments || [];
        attachments.push(attachment);
        reply.attachments = attachments;
        reply.terminate();
        transition.flow = "terminate";
        return reply.send();
    }
}
AudioCard.key = "botframeworkAudioCard";
AudioCard.platform = "botframework";
exports.AudioCard = AudioCard;
function createMessageDirective(key, messageKey) {
    var _a;
    return _a = class {
            constructor(options) {
                this.options = options;
            }
            async writeToReply(reply, event, transition) {
                reply[messageKey] = this.options;
            }
        },
        _a.key = key,
        _a.platform = "botframework",
        _a;
}
exports.AttachmentLayout = createMessageDirective("botframeworkAttachmentLayout", "attachmentLayout");
exports.Attachments = createMessageDirective("botframeworkAttachments", "attachments");
//# sourceMappingURL=directives.js.map