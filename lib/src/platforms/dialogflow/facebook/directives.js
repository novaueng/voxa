"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
function createQuickReplyDirective(contentType, key) {
    var _a;
    return _a = class {
            constructor(message, replyArray) {
                this.message = message;
                this.replyArray = replyArray;
            }
            async writeToReply(reply, event, transition) {
                const dialogflowReply = reply;
                const quickReplies = [];
                if (_.isEmpty(this.replyArray)) {
                    quickReplies.push({
                        content_type: contentType,
                    });
                }
                else {
                    if (!_.isArray(this.replyArray)) {
                        this.replyArray = [this.replyArray];
                    }
                    _.forEach(this.replyArray, (item) => {
                        quickReplies.push({
                            content_type: contentType,
                            image_url: item.imageUrl,
                            payload: item.payload,
                            title: item.title,
                        });
                    });
                }
                let text;
                try {
                    text = await event.renderer.renderPath(this.message, event);
                }
                catch (err) {
                    // THE VALUE SENT IS A REAL STRING AND NOT A PATH TO A VIEW
                    text = this.message;
                }
                const facebookPayload = {
                    payload: {
                        facebook: {
                            quick_replies: quickReplies,
                            text,
                        },
                    },
                };
                dialogflowReply.fulfillmentMessages.push(facebookPayload);
                dialogflowReply.source = event.platform.name;
            }
        },
        _a.platform = "facebook",
        _a.key = key,
        _a;
}
function createGenericTemplateDirective(key, templateType) {
    var _a;
    return _a = class {
            constructor(config) {
                this.config = config;
            }
            async writeToReply(reply, event, transition) {
                const dialogflowReply = reply;
                let configElements;
                let configButtons;
                let configSharable;
                let configText;
                let configTopElementStyle;
                if (_.isString(this.config)) {
                    const payloadTemplate = await event.renderer.renderPath(this.config, event);
                    configButtons = payloadTemplate.buttons;
                    configElements = payloadTemplate.elements;
                    configSharable = payloadTemplate.sharable;
                    configText = payloadTemplate.text;
                    configTopElementStyle = payloadTemplate.topElementStyle;
                }
                else {
                    configButtons = this.config.buttons;
                    configElements = this.config.elements;
                    configSharable = this.config.sharable;
                    configText = this.config.text;
                    configTopElementStyle = this.config.topElementStyle;
                }
                const elements = getTemplateElements(configElements);
                const facebookPayload = {
                    buttons: configButtons,
                    sharable: configSharable,
                    template_type: templateType,
                    text: configText,
                    top_element_style: configTopElementStyle,
                };
                if (!_.isEmpty(elements)) {
                    facebookPayload.elements = elements;
                }
                const customFacebookPayload = {
                    payload: {
                        facebook: {
                            attachment: {
                                payload: _.omitBy(facebookPayload, _.isNil),
                                type: "template",
                            },
                        },
                    },
                };
                dialogflowReply.fulfillmentMessages.push(customFacebookPayload);
                dialogflowReply.source = event.platform.name;
            }
        },
        _a.platform = "facebook",
        _a.key = key,
        _a;
}
function getTemplateElements(configElements) {
    const elements = [];
    _.forEach(configElements, (item) => {
        let defaultAction;
        if (item.defaultActionUrl) {
            defaultAction = {
                fallback_url: item.defaultActionFallbackUrl,
                messenger_extensions: item.defaultMessengerExtensions,
                type: "web_url",
                url: item.defaultActionUrl,
                webview_height_ratio: item.defaultWebviewHeightRatio,
            };
            defaultAction = _.omitBy(defaultAction, _.isNil);
        }
        const buttons = _.map(item.buttons, (x) => {
            const buttonFormatted = _.pick(x, ["payload", "title", "type", "url"]);
            buttonFormatted.fallback_url = x.fallbackUrl;
            buttonFormatted.messenger_extensions = x.messengerExtensions;
            buttonFormatted.webview_height_ratio = x.webviewHeightRatio;
            return _.omitBy(buttonFormatted, _.isNil);
        });
        const elementItem = {
            buttons,
            default_action: defaultAction,
            image_url: item.imageUrl,
            subtitle: item.subtitle,
            title: item.title,
            url: item.url,
        };
        elements.push(_.omitBy(elementItem, _.isEmpty));
    });
    return elements;
}
class FacebookAccountLink {
    constructor(url) {
        this.url = url;
    }
    async writeToReply(reply, event, transition) {
        const dialogflowReply = reply;
        let renderedUrl;
        try {
            renderedUrl = await event.renderer.renderPath(this.url, event);
        }
        catch (err) {
            // THE VALUE SENT IS A REAL STRING AND NOT A PATH TO A VIEW
            renderedUrl = this.url;
        }
        const fulfillmentText = getTextFromTextTemplate(dialogflowReply);
        const facebookPayload = this.getFacebookPayload(renderedUrl, fulfillmentText);
        dialogflowReply.source = event.platform.name;
        dialogflowReply.fulfillmentMessages.push(facebookPayload);
    }
    getFacebookPayload(renderedUrl, fulfillmentText) {
        return {
            payload: {
                facebook: {
                    attachment: {
                        payload: {
                            buttons: [
                                {
                                    type: FACEBOOK_BUTTONS.ACCOUNT_LINK,
                                    url: renderedUrl,
                                },
                            ],
                            template_type: "button",
                            text: fulfillmentText,
                        },
                        type: "template",
                    },
                },
            },
        };
    }
}
FacebookAccountLink.platform = "facebook";
FacebookAccountLink.key = "facebookAccountLink";
exports.FacebookAccountLink = FacebookAccountLink;
class FacebookAccountUnlink {
    async writeToReply(reply, event, transition) {
        const dialogflowReply = reply;
        const facebookPayload = {
            payload: {
                facebook: {
                    attachment: {
                        payload: {
                            buttons: [
                                {
                                    type: FACEBOOK_BUTTONS.ACCOUNT_UNLINK,
                                },
                            ],
                            template_type: "button",
                            text: getTextFromTextTemplate(dialogflowReply),
                        },
                        type: "template",
                    },
                },
            },
        };
        dialogflowReply.fulfillmentMessages.push(facebookPayload);
        dialogflowReply.source = event.platform.name;
    }
}
FacebookAccountUnlink.platform = "facebook";
FacebookAccountUnlink.key = "facebookAccountUnlink";
exports.FacebookAccountUnlink = FacebookAccountUnlink;
class FacebookSuggestionChips {
    constructor(suggestions) {
        this.suggestions = suggestions;
    }
    async writeToReply(reply, event, transition) {
        const suggestionChips = await this.getSuggestionChips(event);
        const dialogflowReply = reply;
        const facebookPayload = {
            payload: {
                facebook: {
                    attachment: {
                        payload: {
                            buttons: suggestionChips,
                            template_type: "button",
                            text: getTextFromTextTemplate(dialogflowReply),
                        },
                        type: "template",
                    },
                },
            },
        };
        dialogflowReply.fulfillmentMessages.push(facebookPayload);
        dialogflowReply.source = event.platform.name;
    }
    async getSuggestionChips(event) {
        let options = this.suggestions;
        if (_.isString(options)) {
            options = await event.renderer.renderPath(options, event);
        }
        const suggestionChips = [];
        _.forEach(options, (item) => {
            const button = {
                payload: item,
                title: item,
                type: "postback",
            };
            suggestionChips.push(button);
        });
        return suggestionChips;
    }
}
FacebookSuggestionChips.platform = "facebook";
FacebookSuggestionChips.key = "facebookSuggestionChips";
exports.FacebookSuggestionChips = FacebookSuggestionChips;
function getTextFromTextTemplate(dialogflowReply) {
    const textTemplate = _.findLast(dialogflowReply.fulfillmentMessages, (x) => _.has(x, "payload.facebook.text"));
    if (textTemplate) {
        _.pull(dialogflowReply.fulfillmentMessages, textTemplate);
        return textTemplate.payload.facebook.text;
    }
    return dialogflowReply.fulfillmentText;
}
exports.FacebookQuickReplyLocation = createQuickReplyDirective("location", "facebookQuickReplyLocation");
exports.FacebookQuickReplyPhoneNumber = createQuickReplyDirective("user_phone_number", "facebookQuickReplyPhoneNumber");
exports.FacebookQuickReplyText = createQuickReplyDirective("text", "facebookQuickReplyText");
exports.FacebookQuickReplyUserEmail = createQuickReplyDirective("user_email", "facebookQuickReplyUserEmail");
var FACEBOOK_BUTTONS;
(function (FACEBOOK_BUTTONS) {
    FACEBOOK_BUTTONS["ACCOUNT_LINK"] = "account_link";
    FACEBOOK_BUTTONS["ACCOUNT_UNLINK"] = "account_unlink";
    FACEBOOK_BUTTONS["ELEMENT_SHARE"] = "element_share";
    FACEBOOK_BUTTONS["GAME_PLAY"] = "game_play";
    FACEBOOK_BUTTONS["PAYMENT"] = "payment";
    FACEBOOK_BUTTONS["PHONE_NUMBER"] = "phone_number";
    FACEBOOK_BUTTONS["POSTBACK"] = "postback";
    FACEBOOK_BUTTONS["WEB_URL"] = "web_url";
})(FACEBOOK_BUTTONS = exports.FACEBOOK_BUTTONS || (exports.FACEBOOK_BUTTONS = {}));
var FACEBOOK_IMAGE_ASPECT_RATIO;
(function (FACEBOOK_IMAGE_ASPECT_RATIO) {
    FACEBOOK_IMAGE_ASPECT_RATIO["HORIZONTAL"] = "horizontal";
    FACEBOOK_IMAGE_ASPECT_RATIO["SQUARE"] = "square";
})(FACEBOOK_IMAGE_ASPECT_RATIO = exports.FACEBOOK_IMAGE_ASPECT_RATIO || (exports.FACEBOOK_IMAGE_ASPECT_RATIO = {}));
var FACEBOOK_WEBVIEW_HEIGHT_RATIO;
(function (FACEBOOK_WEBVIEW_HEIGHT_RATIO) {
    FACEBOOK_WEBVIEW_HEIGHT_RATIO["COMPACT"] = "compact";
    FACEBOOK_WEBVIEW_HEIGHT_RATIO["TALL"] = "tall";
    FACEBOOK_WEBVIEW_HEIGHT_RATIO["FULL"] = "full";
})(FACEBOOK_WEBVIEW_HEIGHT_RATIO = exports.FACEBOOK_WEBVIEW_HEIGHT_RATIO || (exports.FACEBOOK_WEBVIEW_HEIGHT_RATIO = {}));
var FACEBOOK_TOP_ELEMENT_STYLE;
(function (FACEBOOK_TOP_ELEMENT_STYLE) {
    FACEBOOK_TOP_ELEMENT_STYLE["COMPACT"] = "compact";
    FACEBOOK_TOP_ELEMENT_STYLE["LARGE"] = "large";
})(FACEBOOK_TOP_ELEMENT_STYLE = exports.FACEBOOK_TOP_ELEMENT_STYLE || (exports.FACEBOOK_TOP_ELEMENT_STYLE = {}));
exports.FacebookButtonTemplate = createGenericTemplateDirective("facebookButtonTemplate", "button");
exports.FacebookCarousel = createGenericTemplateDirective("facebookCarousel", "generic");
exports.FacebookList = createGenericTemplateDirective("facebookList", "list");
exports.FacebookOpenGraphTemplate = createGenericTemplateDirective("facebookOpenGraphTemplate", "open_graph");
//# sourceMappingURL=directives.js.map