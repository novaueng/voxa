"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Variables for tests
 *
 * Copyright (c) 2016 Rain Agency.
 * Licensed under the MIT license.
 */
const _ = require("lodash");
const directives_1 = require("../src/platforms/alexa/directives");
const dialogflow_1 = require("../src/platforms/dialogflow");
exports.variables = {
    card2: () => {
        return new directives_1.HomeCard({
            image: {
                largeImageUrl: "http://example.com/large.jpg",
                smallImageUrl: "http://example.com/small.jpg",
            },
            title: "Title",
            type: "Standard",
        });
    },
    exitArray: function exitArray() {
        return [{ a: 1 }, { b: 2 }, { c: 3 }];
    },
    exitCard: function exitCard() {
        return {
            image: {
                largeImageUrl: "largeImage.jpg",
                smallImageUrl: "smallImage.jpg",
            },
            text: "text",
            title: "title",
            type: "Standard",
        };
    },
    exitDirectiveMessage: function exitDirectiveMessage() {
        return {
            text: "Thanks for playing!",
            type: "PlainText",
        };
    },
    hintDirective: () => {
        return new directives_1.Hint("this is the hint");
    },
    items: function items(request) {
        return request.model.items;
    },
    time: function time() {
        const today = new Date();
        const curHr = today.getHours();
        if (curHr < 12) {
            return "Morning";
        }
        if (curHr < 18) {
            return "Afternoon";
        }
        return "Evening";
    },
    site: function site() {
        return "example.com";
    },
    count: function count(request) {
        return Promise.resolve(request.model.count);
    },
    numberOne: function numberOne(request) {
        if (request.request.locale === "en-US") {
            return "one";
        }
        else if (request.request.locale === "de-DE") {
            return "ein";
        }
        return 1;
    },
    listsWithItems: function listsWithItems(request) {
        return `${_.join(_.initial(request.model.listsWithItems), ", ")}, and ${_.last(request.model.listsWithItems)}`;
    },
    customerContactCountry: function customerContactCountry(request) {
        return request.model.info.countryCode;
    },
    customerContactEmail: function customerContactEmail(request) {
        return request.model.info.email;
    },
    customerContactGivenName: function customerContactGivenName(request) {
        return request.model.info.givenName;
    },
    customerContactNumber: function customerContactNumber(request) {
        return request.model.info.phoneNumber;
    },
    deviceInfo: function deviceInfo(request) {
        return request.model.deviceInfo;
    },
    name: function name(request) {
        return request.model.info.name;
    },
    settingsInfo: function settingsInfo(request) {
        return request.model.settingsInfo;
    },
    reminderAllContent: function reminderAllContent(request) {
        const reminderContent = _.map(request.model.reminders, (x) => x.alertInfo.spokenInfo.content[0].text);
        return reminderContent.join(", ");
    },
    reminderContent: function reminderContent(request) {
        return request.model.reminder.alertInfo.spokenInfo.content[0].text;
    },
    reminderId: function reminderId(request) {
        return request.model.reminder.alertToken;
    },
    facebookButtonTemplate: function facebookButtonTemplate(request) {
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
        return facebookTemplateBuilder.build();
    },
    facebookCarousel: function facebookCarousel(request) {
        const buttons = [
            {
                title: "Go to see this URL",
                type: dialogflow_1.FACEBOOK_BUTTONS.WEB_URL,
                url: "https://www.example.com/imgs/imageExample.png",
            },
            {
                payload: "value",
                title: "Send this to chat",
                type: dialogflow_1.FACEBOOK_BUTTONS.POSTBACK,
            },
        ];
        const carousel = {
            elements: [
                {
                    buttons,
                    defaultActionUrl: "https://www.example.com/imgs/imageExample.png",
                    defaultMessengerExtensions: false,
                    defaultWebviewHeightRatio: dialogflow_1.FACEBOOK_WEBVIEW_HEIGHT_RATIO.COMPACT,
                    imageUrl: "https://www.w3schools.com/colors/img_colormap.gif",
                    subtitle: "subtitle",
                    title: "title",
                },
                {
                    buttons,
                    defaultActionUrl: "https://www.example.com/imgs/imageExample.png",
                    defaultMessengerExtensions: false,
                    defaultWebviewHeightRatio: dialogflow_1.FACEBOOK_WEBVIEW_HEIGHT_RATIO.TALL,
                    imageUrl: "https://www.w3schools.com/colors/img_colormap.gif",
                    subtitle: "subtitle",
                    title: "title",
                },
            ],
        };
        return carousel;
    },
    facebookList: function facebookList(request) {
        const buttons = [
            {
                payload: "payload",
                title: "View More",
                type: dialogflow_1.FACEBOOK_BUTTONS.POSTBACK,
            },
        ];
        const list = {
            buttons,
            elements: [
                {
                    buttons: [
                        {
                            fallbackUrl: "https://www.example.com",
                            messengerExtensions: false,
                            title: "View",
                            type: dialogflow_1.FACEBOOK_BUTTONS.WEB_URL,
                            url: "https://www.scottcountyiowa.com/sites/default/files/images/pages/IMG_6541-960x720_0.jpg",
                            webviewHeightRatio: dialogflow_1.FACEBOOK_WEBVIEW_HEIGHT_RATIO.FULL,
                        },
                    ],
                    imageUrl: "https://www.scottcountyiowa.com/sites/default/files/images/pages/IMG_6541-960x720_0.jpg",
                    subtitle: "See all our colors",
                    title: "Classic T-Shirt Collection",
                },
                {
                    defaultActionUrl: "https://www.w3schools.com",
                    defaultWebviewHeightRatio: dialogflow_1.FACEBOOK_WEBVIEW_HEIGHT_RATIO.TALL,
                    imageUrl: "https://www.scottcountyiowa.com/sites/default/files/images/pages/IMG_6541-960x720_0.jpg",
                    subtitle: "See all our colors",
                    title: "Classic T-Shirt Collection",
                },
                {
                    buttons: [
                        {
                            fallbackUrl: "https://www.example.com",
                            messengerExtensions: false,
                            title: "View",
                            type: dialogflow_1.FACEBOOK_BUTTONS.WEB_URL,
                            url: "https://www.scottcountyiowa.com/sites/default/files/images/pages/IMG_6541-960x720_0.jpg",
                            webviewHeightRatio: dialogflow_1.FACEBOOK_WEBVIEW_HEIGHT_RATIO.TALL,
                        },
                    ],
                    defaultActionUrl: "https://www.w3schools.com",
                    defaultWebviewHeightRatio: dialogflow_1.FACEBOOK_WEBVIEW_HEIGHT_RATIO.TALL,
                    imageUrl: "https://www.scottcountyiowa.com/sites/default/files/images/pages/IMG_6541-960x720_0.jpg",
                    subtitle: "100% Cotton, 200% Comfortable",
                    title: "Classic T-Shirt Collection",
                },
            ],
            sharable: true,
            topElementStyle: dialogflow_1.FACEBOOK_TOP_ELEMENT_STYLE.LARGE,
        };
        return list;
    },
    facebookOpenGraphTemplate: function facebookOpenGraphTemplate(request) {
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
        facebookTemplateBuilder.addElement(elementBuilder1.build());
        return facebookTemplateBuilder.build();
    },
};
//# sourceMappingURL=variables.js.map