"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _ = require("lodash");
require("mocha");
const dialogflow_1 = require("../../../src/platforms/dialogflow");
const VoxaApp_1 = require("../../../src/VoxaApp");
const variables_1 = require("./../../variables");
const views_1 = require("./../../views");
const i18n = require("i18next");
/* tslint:disable-next-line:no-var-requires */
const facebookOpenGraphTemplatePayload = require("../../requests/dialogflow/facebookOpenGraphTemplatePayload.json");
describe("Facebook Directives", () => {
    let event;
    let app;
    let dialogflowAgent;
    before(() => {
        i18n.init({
            load: "all",
            nonExplicitWhitelist: true,
            resources: views_1.views,
        });
    });
    beforeEach(() => {
        app = new VoxaApp_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
        dialogflowAgent = new dialogflow_1.FacebookPlatform(app);
        event = _.cloneDeep(require("../../requests/dialogflow/launchIntent.json"));
    });
    describe("FacebookAccountLink", () => {
        it("should add a facebook account link button using a reply view", async () => {
            app.onIntent("LaunchIntent", {
                flow: "yield",
                reply: "Facebook.AccountLink",
                to: "entry",
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const reply = await dialogflowAgent.execute(event);
            chai_1.expect(reply.fulfillmentText).to.equal("Text!");
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.attachment.payload).to.deep.equal({
                buttons: [
                    {
                        type: dialogflow_1.FACEBOOK_BUTTONS.ACCOUNT_LINK,
                        url: "https://www.messenger.com",
                    },
                ],
                template_type: "button",
                text: "Text!",
            });
        });
        it("should add a facebook account link button", async () => {
            app.onIntent("LaunchIntent", {
                facebookAccountLink: "https://www.messenger.com",
                flow: "yield",
                sayp: "Say!",
                textp: "Text!",
                to: "entry",
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const reply = await dialogflowAgent.execute(event);
            const { payload } = reply.fulfillmentMessages[0].payload.facebook.attachment;
            chai_1.expect(payload).to.deep.equal({
                buttons: [
                    {
                        type: dialogflow_1.FACEBOOK_BUTTONS.ACCOUNT_LINK,
                        url: "https://www.messenger.com",
                    },
                ],
                template_type: "button",
                text: "Text!",
            });
        });
    });
    describe("FacebookAccountUnlink", () => {
        it("should add a facebook account unlink button using a reply view", async () => {
            app.onIntent("LaunchIntent", {
                flow: "yield",
                reply: "Facebook.AccountUnlink",
                to: "entry",
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const reply = await dialogflowAgent.execute(event);
            chai_1.expect(reply.fulfillmentText).to.equal("Text!");
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.attachment.payload).to.deep.equal({
                buttons: [
                    {
                        type: dialogflow_1.FACEBOOK_BUTTONS.ACCOUNT_UNLINK,
                    },
                ],
                template_type: "button",
                text: "Text!",
            });
        });
        it("should add a facebook account unlink button", async () => {
            app.onIntent("LaunchIntent", {
                facebookAccountUnlink: true,
                flow: "yield",
                sayp: "Say!",
                textp: "Text!",
                to: "entry",
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const reply = await dialogflowAgent.execute(event);
            const { payload } = reply.fulfillmentMessages[0].payload.facebook.attachment;
            chai_1.expect(payload).to.deep.equal({
                buttons: [
                    {
                        type: dialogflow_1.FACEBOOK_BUTTONS.ACCOUNT_UNLINK,
                    },
                ],
                template_type: "button",
                text: "Text!",
            });
        });
    });
    describe("FacebookSuggestionChips", () => {
        it("should add a FacebookSuggestionChips using a reply view", async () => {
            app.onIntent("LaunchIntent", {
                flow: "yield",
                reply: "Facebook.Suggestions",
                to: "entry",
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const reply = await dialogflowAgent.execute(event);
            chai_1.expect(reply.fulfillmentText).to.equal("Pick a suggestion");
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.attachment.payload).to.deep.equal({
                buttons: [
                    {
                        payload: "Suggestion 1",
                        title: "Suggestion 1",
                        type: dialogflow_1.FACEBOOK_BUTTONS.POSTBACK,
                    },
                    {
                        payload: "Suggestion 2",
                        title: "Suggestion 2",
                        type: dialogflow_1.FACEBOOK_BUTTONS.POSTBACK,
                    },
                ],
                template_type: "button",
                text: "Pick a suggestion",
            });
        });
        it("should add a FacebookSuggestionChips", async () => {
            app.onIntent("LaunchIntent", {
                facebookSuggestionChips: ["yes", "no"],
                flow: "yield",
                sayp: "Say!",
                textp: "Text!",
                to: "entry",
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const reply = await dialogflowAgent.execute(event);
            const { payload } = reply.fulfillmentMessages[0].payload.facebook.attachment;
            chai_1.expect(payload).to.deep.equal({
                buttons: [
                    {
                        payload: "yes",
                        title: "yes",
                        type: dialogflow_1.FACEBOOK_BUTTONS.POSTBACK,
                    },
                    {
                        payload: "no",
                        title: "no",
                        type: dialogflow_1.FACEBOOK_BUTTONS.POSTBACK,
                    },
                ],
                template_type: "button",
                text: "Text!",
            });
        });
    });
    describe("FacebookQuickReplyLocation", () => {
        it("should send a quick reply for location request using a reply view", async () => {
            app.onIntent("LaunchIntent", {
                flow: "yield",
                reply: "Facebook.QuickReplyLocation",
                to: "entry",
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const reply = await dialogflowAgent.execute(event);
            chai_1.expect(reply.fulfillmentText).to.equal("Text!");
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal("Text!");
            chai_1.expect(reply.fulfillmentMessages[1].payload.facebook.text).to.equal("Send me your location");
            chai_1.expect(reply.fulfillmentMessages[1].payload.facebook.quick_replies).to.deep.equal([
                {
                    content_type: "location",
                },
            ]);
        });
        it("should send a quick reply for location request", async () => {
            app.onIntent("LaunchIntent", {
                facebookQuickReplyLocation: "Send me your location",
                flow: "yield",
                sayp: "Say!",
                textp: "Text!",
                to: "entry",
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const reply = await dialogflowAgent.execute(event);
            const { payload } = reply.fulfillmentMessages[1].payload.facebook;
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal("Text!");
            chai_1.expect(reply.fulfillmentMessages[1].payload.facebook.text).to.equal("Send me your location");
            chai_1.expect(reply.fulfillmentMessages[1].payload.facebook.quick_replies).to.deep.equal([
                {
                    content_type: "location",
                },
            ]);
        });
    });
    describe("FacebookQuickReplyPhoneNumber", () => {
        it("should send a quick reply for phone number request using a reply view", async () => {
            app.onIntent("LaunchIntent", {
                flow: "yield",
                reply: "Facebook.QuickReplyPhoneNumber",
                to: "entry",
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const reply = await dialogflowAgent.execute(event);
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal("Text!");
            chai_1.expect(reply.fulfillmentMessages[1].payload.facebook.text).to.equal("Send me your phone number");
            chai_1.expect(reply.fulfillmentMessages[1].payload.facebook.quick_replies).to.deep.equal([
                {
                    content_type: "user_phone_number",
                },
            ]);
        });
        it("should send a quick reply for phone number request", async () => {
            app.onIntent("LaunchIntent", {
                facebookQuickReplyPhoneNumber: "Send me your phone number",
                flow: "yield",
                sayp: "Say!",
                textp: "Text!",
                to: "entry",
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const reply = await dialogflowAgent.execute(event);
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal("Text!");
            chai_1.expect(reply.fulfillmentMessages[1].payload.facebook.text).to.equal("Send me your phone number");
            chai_1.expect(reply.fulfillmentMessages[1].payload.facebook.quick_replies).to.deep.equal([
                {
                    content_type: "user_phone_number",
                },
            ]);
        });
    });
    describe("FacebookQuickReplyText", () => {
        it("should send a quick reply for options request from a single item", async () => {
            const quickReplyMessage = "What's your favorite shape?";
            const quickReplySingleElement = {
                imageUrl: "https://www.example.com/imgs/imageExample.png",
                payload: "square",
                title: "Square Multicolor",
            };
            app.onIntent("LaunchIntent", (voxaEvent) => {
                const facebookQuickReplyText = new dialogflow_1.FacebookQuickReplyText(quickReplyMessage, quickReplySingleElement);
                return {
                    directives: [facebookQuickReplyText],
                    flow: "yield",
                    sayp: "Say!",
                    textp: "Text!",
                    to: "entry",
                };
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const reply = await dialogflowAgent.execute(event);
            const quickReplyExpect = _.cloneDeep(quickReplySingleElement);
            quickReplyExpect.image_url = quickReplySingleElement.imageUrl;
            quickReplyExpect.content_type = "text";
            _.unset(quickReplyExpect, "imageUrl");
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal("Text!");
            chai_1.expect(reply.fulfillmentMessages[1].payload.facebook.text).to.equal(quickReplyMessage);
            chai_1.expect(reply.fulfillmentMessages[1].payload.facebook.quick_replies).to.deep.equal([quickReplyExpect]);
        });
        it("should send a quick reply for options request from an array", async () => {
            const quickReplyTextArray = [
                {
                    imageUrl: "https://www.example.com/imgs/imageExample.png",
                    payload: "square",
                    title: "Square Multicolor",
                },
                {
                    imageUrl: "https://www.w3schools.com/colors/img_colormap.gif",
                    payload: "hexagonal",
                    title: "Hexagonal multicolor",
                },
            ];
            app.onIntent("LaunchIntent", (voxaEvent) => {
                const facebookQuickReplyText = new dialogflow_1.FacebookQuickReplyText("What's your favorite shape?", quickReplyTextArray);
                return {
                    directives: [facebookQuickReplyText],
                    flow: "yield",
                    sayp: "Say!",
                    textp: "Text!",
                    to: "entry",
                };
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const reply = await dialogflowAgent.execute(event);
            const quickReplyExpect = _.cloneDeep(quickReplyTextArray);
            quickReplyExpect[0].image_url = quickReplyExpect[0].imageUrl;
            quickReplyExpect[1].image_url = quickReplyExpect[1].imageUrl;
            quickReplyExpect[0].content_type = "text";
            quickReplyExpect[1].content_type = "text";
            _.unset(quickReplyExpect[0], "imageUrl");
            _.unset(quickReplyExpect[1], "imageUrl");
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal("Text!");
            chai_1.expect(reply.fulfillmentMessages[1].payload.facebook.text).to.equal("What's your favorite shape?");
            chai_1.expect(reply.fulfillmentMessages[1].payload.facebook.quick_replies).to.deep.equal(quickReplyExpect);
        });
    });
    describe("FacebookQuickReplyUserEmail", () => {
        it("should send a quick reply for user's email request using a reply view", async () => {
            app.onIntent("LaunchIntent", {
                flow: "yield",
                reply: "Facebook.QuickReplyUserEmail",
                to: "entry",
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const reply = await dialogflowAgent.execute(event);
            chai_1.expect(reply.fulfillmentText).to.equal("Text!");
            chai_1.expect(reply.fulfillmentMessages[1].payload.facebook.text).to.equal("Send me your email");
            chai_1.expect(reply.fulfillmentMessages[1].payload.facebook.quick_replies).to.deep.equal([
                {
                    content_type: "user_email",
                },
            ]);
        });
        it("should send a quick reply for user's email request", async () => {
            app.onIntent("LaunchIntent", {
                facebookQuickReplyUserEmail: "Send me your email",
                flow: "yield",
                sayp: "Say!",
                textp: "Text!",
                to: "entry",
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const reply = await dialogflowAgent.execute(event);
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal("Text!");
            chai_1.expect(reply.fulfillmentMessages[1].payload.facebook.text).to.equal("Send me your email");
            chai_1.expect(reply.fulfillmentMessages[1].payload.facebook.quick_replies).to.deep.equal([
                {
                    content_type: "user_email",
                },
            ]);
        });
    });
    describe("FacebookButtonTemplate", () => {
        it("should send a FacebookButtonTemplate using a reply view", async () => {
            app.onIntent("LaunchIntent", {
                flow: "yield",
                reply: "Facebook.ButtonTemplate",
                to: "entry",
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const facebookButtonTemplatePayload = require("../../requests/dialogflow/facebookButtonTemplatePayload.json");
            const reply = await dialogflowAgent.execute(event);
            const { payload } = reply.fulfillmentMessages[1].payload.facebook.attachment;
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal("Text!");
            chai_1.expect(payload).to.deep.equal(facebookButtonTemplatePayload);
        });
        it("should send a FacebookButtonTemplate", async () => {
            app.onIntent("LaunchIntent", (voxaEvent) => {
                const buttonBuilder1 = new dialogflow_1.FacebookButtonTemplateBuilder();
                const buttonBuilder2 = new dialogflow_1.FacebookButtonTemplateBuilder();
                const buttonBuilder3 = new dialogflow_1.FacebookButtonTemplateBuilder();
                const facebookTemplateBuilder = new dialogflow_1.FacebookTemplateBuilder();
                buttonBuilder1
                    .setPayload("payload")
                    .setTitle("View More")
                    .setType(dialogflow_1.FACEBOOK_BUTTONS.POSTBACK);
                buttonBuilder2
                    .setPayload("1234567890")
                    .setTitle("Call John")
                    .setType(dialogflow_1.FACEBOOK_BUTTONS.PHONE_NUMBER);
                buttonBuilder3
                    .setTitle("Go to Twitter")
                    .setType(dialogflow_1.FACEBOOK_BUTTONS.WEB_URL)
                    .setUrl("http://www.twitter.com");
                facebookTemplateBuilder
                    .addButton(buttonBuilder1.build())
                    .addButton(buttonBuilder2.build())
                    .addButton(buttonBuilder3.build())
                    .setText("What do you want to do?");
                return {
                    facebookButtonTemplate: facebookTemplateBuilder.build(),
                    flow: "yield",
                    sayp: "Say!",
                    textp: "Text!",
                    to: "entry",
                };
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const facebookButtonTemplatePayload = require("../../requests/dialogflow/facebookButtonTemplatePayload.json");
            const reply = await dialogflowAgent.execute(event);
            const { payload } = reply.fulfillmentMessages[1].payload.facebook.attachment;
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal("Text!");
            chai_1.expect(payload).to.deep.equal(facebookButtonTemplatePayload);
        });
    });
    describe("FacebookCarousel", () => {
        it("should send a FacebookCarousel template using a reply view", async () => {
            app.onIntent("LaunchIntent", {
                flow: "yield",
                reply: "Facebook.Carousel",
                to: "entry",
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const facebookCarouselPayload = require("../../requests/dialogflow/facebookCarouselPayload.json");
            const reply = await dialogflowAgent.execute(event);
            const { payload } = reply.fulfillmentMessages[1].payload.facebook.attachment;
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal("Text!");
            chai_1.expect(payload).to.deep.equal(facebookCarouselPayload);
        });
        it("should send a FacebookCarousel template", async () => {
            app.onIntent("LaunchIntent", (voxaEvent) => {
                const buttonBuilder1 = new dialogflow_1.FacebookButtonTemplateBuilder();
                const buttonBuilder2 = new dialogflow_1.FacebookButtonTemplateBuilder();
                const elementBuilder1 = new dialogflow_1.FacebookElementTemplateBuilder();
                const elementBuilder2 = new dialogflow_1.FacebookElementTemplateBuilder();
                const facebookTemplateBuilder = new dialogflow_1.FacebookTemplateBuilder();
                buttonBuilder1
                    .setTitle("Go to see this URL")
                    .setType(dialogflow_1.FACEBOOK_BUTTONS.WEB_URL)
                    .setUrl("https://www.example.com/imgs/imageExample.png");
                buttonBuilder2
                    .setPayload("value")
                    .setTitle("Send this to chat")
                    .setType(dialogflow_1.FACEBOOK_BUTTONS.POSTBACK);
                elementBuilder1
                    .addButton(buttonBuilder1.build())
                    .addButton(buttonBuilder2.build())
                    .setDefaultActionUrl("https://www.example.com/imgs/imageExample.png")
                    .setDefaultMessengerExtensions(false)
                    .setDefaultWebviewHeightRatio(dialogflow_1.FACEBOOK_WEBVIEW_HEIGHT_RATIO.COMPACT)
                    .setImageUrl("https://www.w3schools.com/colors/img_colormap.gif")
                    .setSubtitle("subtitle")
                    .setTitle("title");
                elementBuilder2
                    .addButton(buttonBuilder1.build())
                    .addButton(buttonBuilder2.build())
                    .setDefaultActionUrl("https://www.example.com/imgs/imageExample.png")
                    .setDefaultMessengerExtensions(false)
                    .setDefaultWebviewHeightRatio(dialogflow_1.FACEBOOK_WEBVIEW_HEIGHT_RATIO.TALL)
                    .setImageUrl("https://www.w3schools.com/colors/img_colormap.gif")
                    .setSubtitle("subtitle")
                    .setTitle("title");
                facebookTemplateBuilder
                    .addElement(elementBuilder1.build())
                    .addElement(elementBuilder2.build())
                    .setImageAspectRatio(dialogflow_1.FACEBOOK_IMAGE_ASPECT_RATIO.HORIZONTAL);
                return {
                    facebookCarousel: facebookTemplateBuilder.build(),
                    flow: "yield",
                    sayp: "Say!",
                    textp: "Text!",
                    to: "entry",
                };
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const facebookCarouselPayload = require("../../requests/dialogflow/facebookCarouselPayload.json");
            const reply = await dialogflowAgent.execute(event);
            const { payload } = reply.fulfillmentMessages[1].payload.facebook.attachment;
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal("Text!");
            chai_1.expect(payload).to.deep.equal(facebookCarouselPayload);
        });
    });
    describe("FacebookList", () => {
        it("should send a FacebookList template using a reply view", async () => {
            app.onIntent("LaunchIntent", {
                flow: "yield",
                reply: "Facebook.List",
                to: "entry",
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const facebookListPayload = require("../../requests/dialogflow/facebookListPayload.json");
            const reply = await dialogflowAgent.execute(event);
            const { payload } = reply.fulfillmentMessages[1].payload.facebook.attachment;
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal("Text!");
            chai_1.expect(payload).to.deep.equal(facebookListPayload);
        });
        it("should send a FacebookList template", async () => {
            app.onIntent("LaunchIntent", (voxaEvent) => {
                const buttonBuilder1 = new dialogflow_1.FacebookButtonTemplateBuilder();
                const buttonBuilder2 = new dialogflow_1.FacebookButtonTemplateBuilder();
                const elementBuilder1 = new dialogflow_1.FacebookElementTemplateBuilder();
                const elementBuilder2 = new dialogflow_1.FacebookElementTemplateBuilder();
                const elementBuilder3 = new dialogflow_1.FacebookElementTemplateBuilder();
                const facebookTemplateBuilder = new dialogflow_1.FacebookTemplateBuilder();
                buttonBuilder1
                    .setPayload("payload")
                    .setTitle("View More")
                    .setType(dialogflow_1.FACEBOOK_BUTTONS.POSTBACK);
                buttonBuilder2
                    .setFallbackUrl("https://www.example.com")
                    .setMessengerExtensions(false)
                    .setTitle("View")
                    .setType(dialogflow_1.FACEBOOK_BUTTONS.WEB_URL)
                    .setUrl("https://www.scottcountyiowa.com/sites/default/files/images/pages/IMG_6541-960x720_0.jpg")
                    .setWebviewHeightRatio(dialogflow_1.FACEBOOK_WEBVIEW_HEIGHT_RATIO.FULL);
                elementBuilder1
                    .addButton(buttonBuilder2.build())
                    .setImageUrl("https://www.scottcountyiowa.com/sites/default/files/images/pages/IMG_6541-960x720_0.jpg")
                    .setSubtitle("See all our colors")
                    .setTitle("Classic T-Shirt Collection")
                    .setDefaultActionFallbackUrl("https://www.example.com");
                elementBuilder2
                    .setDefaultActionUrl("https://www.w3schools.com")
                    .setDefaultWebviewHeightRatio(dialogflow_1.FACEBOOK_WEBVIEW_HEIGHT_RATIO.TALL)
                    .setImageUrl("https://www.scottcountyiowa.com/sites/default/files/images/pages/IMG_6541-960x720_0.jpg")
                    .setSubtitle("See all our colors")
                    .setTitle("Classic T-Shirt Collection")
                    .setSharable(false);
                buttonBuilder2.setWebviewHeightRatio(dialogflow_1.FACEBOOK_WEBVIEW_HEIGHT_RATIO.TALL);
                elementBuilder3
                    .addButton(buttonBuilder2.build())
                    .setDefaultActionUrl("https://www.w3schools.com")
                    .setDefaultWebviewHeightRatio(dialogflow_1.FACEBOOK_WEBVIEW_HEIGHT_RATIO.TALL)
                    .setImageUrl("https://www.scottcountyiowa.com/sites/default/files/images/pages/IMG_6541-960x720_0.jpg")
                    .setSubtitle("100% Cotton, 200% Comfortable")
                    .setTitle("Classic T-Shirt Collection");
                facebookTemplateBuilder
                    .addButton(buttonBuilder1.build())
                    .addElement(elementBuilder1.build())
                    .addElement(elementBuilder2.build())
                    .addElement(elementBuilder3.build())
                    .setSharable(true)
                    .setTopElementStyle(dialogflow_1.FACEBOOK_TOP_ELEMENT_STYLE.LARGE);
                return {
                    facebookList: facebookTemplateBuilder.build(),
                    flow: "yield",
                    sayp: "Say!",
                    textp: "Text!",
                    to: "entry",
                };
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const facebookListPayload = require("../../requests/dialogflow/facebookListPayload.json");
            const reply = await dialogflowAgent.execute(event);
            const { payload } = reply.fulfillmentMessages[1].payload.facebook.attachment;
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal("Text!");
            chai_1.expect(payload).to.deep.equal(facebookListPayload);
        });
    });
    describe("FacebookOpenGraphTemplate", () => {
        it("should send a FacebookOpenGraphTemplate using a reply view", async () => {
            app.onIntent("LaunchIntent", {
                flow: "yield",
                reply: "Facebook.OpenGraphTemplate",
                to: "entry",
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const reply = await dialogflowAgent.execute(event);
            const { payload } = reply.fulfillmentMessages[1].payload.facebook.attachment;
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal("Text!");
            chai_1.expect(payload).to.deep.equal(facebookOpenGraphTemplatePayload);
        });
        it("should send a FacebookOpenGraphTemplate", async () => {
            app.onIntent("LaunchIntent", (voxaEvent) => {
                const elementBuilder1 = new dialogflow_1.FacebookElementTemplateBuilder();
                const buttonBuilder1 = new dialogflow_1.FacebookButtonTemplateBuilder();
                const buttonBuilder2 = new dialogflow_1.FacebookButtonTemplateBuilder();
                const facebookTemplateBuilder = new dialogflow_1.FacebookTemplateBuilder();
                buttonBuilder1
                    .setTitle("Go to Wikipedia")
                    .setType(dialogflow_1.FACEBOOK_BUTTONS.WEB_URL)
                    .setUrl("https://en.wikipedia.org/wiki/Rickrolling");
                buttonBuilder2
                    .setTitle("Go to Twitter")
                    .setType(dialogflow_1.FACEBOOK_BUTTONS.WEB_URL)
                    .setUrl("http://www.twitter.com");
                elementBuilder1
                    .addButton(buttonBuilder1.build())
                    .addButton(buttonBuilder2.build())
                    .setUrl("https://open.spotify.com/track/7GhIk7Il098yCjg4BQjzvb");
                facebookTemplateBuilder
                    .addElement(elementBuilder1.build());
                return {
                    facebookOpenGraphTemplate: facebookTemplateBuilder.build(),
                    flow: "yield",
                    sayp: "Say!",
                    textp: "Text!",
                    to: "entry",
                };
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const reply = await dialogflowAgent.execute(event);
            const { payload } = reply.fulfillmentMessages[1].payload.facebook.attachment;
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.text).to.equal("Text!");
            chai_1.expect(payload).to.deep.equal(facebookOpenGraphTemplatePayload);
        });
    });
    describe("Multiple directives", () => {
        it("should send a text, accountlink, suggestion chip and " +
            "FacebookOpenGraphTemplate directive in the right order using a reply view", async () => {
            app.onIntent("LaunchIntent", {
                flow: "continue",
                reply: "Facebook.AccountLink",
                to: "state1",
            });
            app.onState("state1", {
                flow: "continue",
                reply: "Facebook.Suggestions",
                to: "state2",
            });
            app.onState("state2", {
                flow: "yield",
                reply: "Facebook.OpenGraphTemplate",
                to: "entry",
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const reply = await dialogflowAgent.execute(event);
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.attachment.payload).to.deep.equal({
                buttons: [
                    {
                        type: dialogflow_1.FACEBOOK_BUTTONS.ACCOUNT_LINK,
                        url: "https://www.messenger.com",
                    },
                ],
                template_type: "button",
                text: "Text!",
            });
            chai_1.expect(reply.fulfillmentMessages[1].payload.facebook.attachment.payload).to.deep.equal({
                buttons: [
                    {
                        payload: "Suggestion 1",
                        title: "Suggestion 1",
                        type: dialogflow_1.FACEBOOK_BUTTONS.POSTBACK,
                    },
                    {
                        payload: "Suggestion 2",
                        title: "Suggestion 2",
                        type: dialogflow_1.FACEBOOK_BUTTONS.POSTBACK,
                    },
                ],
                template_type: "button",
                text: "Pick a suggestion",
            });
            chai_1.expect(reply.fulfillmentMessages[2].payload.facebook.text).to.deep.equal("Text!");
            chai_1.expect(reply.fulfillmentMessages[3].payload.facebook.attachment.payload).to.deep.equal(facebookOpenGraphTemplatePayload);
        });
        it("should send a text, accountlink, suggestion chip and " +
            "FacebookOpenGraphTemplate directive in the right order", async () => {
            app.onIntent("LaunchIntent", {
                facebookAccountLink: "https://www.messenger.com",
                flow: "continue",
                sayp: "Say!",
                textp: "Text!",
                to: "state1",
            });
            app.onState("state1", {
                facebookSuggestionChips: ["yes", "no"],
                flow: "continue",
                to: "state2",
            });
            app.onState("state2", (voxaEvent) => {
                const elementBuilder1 = new dialogflow_1.FacebookElementTemplateBuilder();
                const buttonBuilder1 = new dialogflow_1.FacebookButtonTemplateBuilder();
                const buttonBuilder2 = new dialogflow_1.FacebookButtonTemplateBuilder();
                const facebookTemplateBuilder = new dialogflow_1.FacebookTemplateBuilder();
                buttonBuilder1
                    .setTitle("Go to Wikipedia")
                    .setType(dialogflow_1.FACEBOOK_BUTTONS.WEB_URL)
                    .setUrl("https://en.wikipedia.org/wiki/Rickrolling");
                buttonBuilder2
                    .setTitle("Go to Twitter")
                    .setType(dialogflow_1.FACEBOOK_BUTTONS.WEB_URL)
                    .setUrl("http://www.twitter.com");
                elementBuilder1
                    .addButton(buttonBuilder1.build())
                    .addButton(buttonBuilder2.build())
                    .setUrl("https://open.spotify.com/track/7GhIk7Il098yCjg4BQjzvb");
                facebookTemplateBuilder
                    .addElement(elementBuilder1.build());
                return {
                    facebookOpenGraphTemplate: facebookTemplateBuilder.build(),
                    flow: "yield",
                    to: "entry",
                };
            });
            event = _.cloneDeep(require("../../requests/dialogflow/facebookLaunchIntent.json"));
            const reply = await dialogflowAgent.execute(event);
            chai_1.expect(reply.fulfillmentMessages[0].payload.facebook.attachment.payload).to.deep.equal({
                buttons: [
                    {
                        type: dialogflow_1.FACEBOOK_BUTTONS.ACCOUNT_LINK,
                        url: "https://www.messenger.com",
                    },
                ],
                template_type: "button",
                text: "Text!",
            });
            chai_1.expect(reply.fulfillmentMessages[1].payload.facebook.attachment.payload).to.deep.equal({
                buttons: [
                    {
                        payload: "yes",
                        title: "yes",
                        type: dialogflow_1.FACEBOOK_BUTTONS.POSTBACK,
                    },
                    {
                        payload: "no",
                        title: "no",
                        type: dialogflow_1.FACEBOOK_BUTTONS.POSTBACK,
                    },
                ],
                template_type: "button",
                text: "Text!",
            });
            chai_1.expect(reply.fulfillmentMessages[2].payload.facebook.attachment.payload).to.deep.equal(facebookOpenGraphTemplatePayload);
        });
    });
});
//# sourceMappingURL=directives.spec.js.map