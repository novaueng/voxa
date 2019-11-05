"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const uuid_1 = require("uuid");
class AlexaRequestBuilder {
    constructor(userId, applicationId, locale = "en-US") {
        this.locale = locale;
        this.version = "1.0";
        this.userId = userId || `amzn1.ask.account.${uuid_1.v1()}`;
        this.applicationId = applicationId || `amzn1.ask.skill.${uuid_1.v1()}`;
        this.deviceId = applicationId || `amzn1.ask.device.${uuid_1.v1()}`;
    }
    getSessionEndedRequest(reason = "ERROR", error) {
        return {
            context: this.getContextData(),
            request: {
                error,
                locale: this.locale,
                reason,
                requestId: `EdwRequestId.${uuid_1.v1()}`,
                timestamp: new Date().toISOString(),
                type: "SessionEndedRequest",
            },
            session: this.getSessionData(),
            version: this.version,
        };
    }
    getDisplayElementSelectedRequest(token) {
        return {
            context: this.getContextData(),
            request: {
                locale: this.locale,
                requestId: `EdwRequestId.${uuid_1.v1()}`,
                timestamp: new Date().toISOString(),
                token,
                type: "Display.ElementSelected",
            },
            session: this.getSessionData(),
            version: this.version,
        };
    }
    getAlexaPresentationAPLUserEvent() {
        return {
            context: this.getContextData(),
            request: {
                arguments: [],
                requestId: `EdwRequestId.${uuid_1.v1()}`,
                timestamp: new Date().toISOString(),
                type: "Alexa.Presentation.APL.UserEvent",
            },
            session: this.getSessionData(),
            version: this.version,
        };
    }
    getCanFulfillIntentRequestRequest(intentName, slots) {
        if (!slots) {
            slots = {};
        }
        else {
            slots = _(slots)
                .keys()
                .map((key) => [key, { name: key, value: slots[key] }])
                .fromPairs()
                .value();
        }
        return {
            context: this.getContextData(),
            request: {
                intent: { name: intentName, slots, confirmationStatus: "NONE" },
                locale: this.locale,
                requestId: `EdwRequestId.${uuid_1.v1()}`,
                timestamp: new Date().toISOString(),
                type: "CanFulfillIntentRequest",
            },
            session: this.getSessionData(),
            version: this.version,
        };
    }
    getCompletedDialog(intentName, slots) {
        if (!slots) {
            slots = {};
        }
        else {
            slots = _(slots)
                .keys()
                .map((key) => [key, { name: key, value: slots[key] }])
                .fromPairs()
                .value();
        }
        return {
            context: this.getContextData(),
            request: {
                dialogState: "COMPLETED",
                intent: { name: intentName, slots, confirmationStatus: "NONE" },
                locale: this.locale,
                requestId: `EdwRequestId.${uuid_1.v1()}`,
                timestamp: new Date().toISOString(),
                type: "IntentRequest",
            },
            session: this.getSessionData(),
            version: this.version,
        };
    }
    getIntentRequest(intentName, slots) {
        if (!slots) {
            slots = {};
        }
        else {
            slots = _(slots)
                .keys()
                .map((key) => [key, { name: key, value: slots[key] }])
                .fromPairs()
                .value();
        }
        return {
            context: this.getContextData(),
            request: {
                dialogState: "STARTED",
                intent: { name: intentName, slots, confirmationStatus: "NONE" },
                locale: this.locale,
                requestId: `EdwRequestId.${uuid_1.v1()}`,
                timestamp: new Date().toISOString(),
                type: "IntentRequest",
            },
            session: this.getSessionData(),
            version: this.version,
        };
    }
    getContextData() {
        return {
            AudioPlayer: {
                playerActivity: "IDLE",
            },
            System: {
                apiAccessToken: uuid_1.v1(),
                apiEndpoint: "https://api.amazonalexa.com",
                application: { applicationId: this.applicationId },
                device: {
                    deviceId: this.deviceId,
                    supportedInterfaces: {
                        "Alexa.Presentation.APL": {},
                        "AudioPlayer": {},
                        "Display": {},
                        "VideoApp": {},
                    },
                },
                user: {
                    permissions: {
                        consentToken: uuid_1.v1(),
                    },
                    userId: this.userId,
                },
            },
        };
    }
    getSessionData(newSession = true) {
        return {
            // randomized for every session and set before calling the handler
            application: { applicationId: this.applicationId },
            attributes: {},
            new: newSession,
            sessionId: `SessionId.${uuid_1.v1()}`,
            user: {
                permissions: {
                    consentToken: "",
                },
                userId: this.userId,
            },
        };
    }
    getLaunchRequest() {
        return {
            context: this.getContextData(),
            request: {
                locale: this.locale,
                requestId: "EdwRequestId." + uuid_1.v1(),
                timestamp: new Date().toISOString(),
                type: "LaunchRequest",
            },
            session: this.getSessionData(),
            version: this.version,
        };
    }
    getPlaybackStoppedRequest(token) {
        const request = {
            locale: this.locale,
            requestId: "EdwRequestId." + uuid_1.v1(),
            timestamp: new Date().toISOString(),
            token,
            type: "AudioPlayer.PlaybackStopped",
        };
        return {
            context: this.getContextData(),
            request,
            session: this.getSessionData(),
            version: this.version,
        };
    }
    getGameEngineInputHandlerEventRequest(buttonsRecognized = 1) {
        const request = {
            events: [],
            locale: this.locale,
            requestId: `amzn1.echo-api.request.${uuid_1.v1()}`,
            timestamp: new Date().toISOString(),
            type: "GameEngine.InputHandlerEvent",
        };
        const eventArray = [];
        eventArray.push({
            inputEvents: [],
            name: "sample_event",
        });
        let id = 1;
        _.times(buttonsRecognized, () => {
            const event = {
                action: "down",
                color: "000000",
                feature: "press",
                gadgetId: `id${id}`,
                timestamp: "timestamp",
            };
            id += 1;
            eventArray[0].inputEvents.push(event);
        });
        request.events = eventArray;
        return {
            context: this.getContextData(),
            request,
            session: this.getSessionData(false),
            version: this.version,
        };
    }
    getConnectionsResponseRequest(name, token, payload, status) {
        status = status || { code: "200", message: "OK" };
        const request = {
            locale: this.locale,
            name,
            payload,
            requestId: `EdwRequestId.${uuid_1.v1()}`,
            status,
            timestamp: new Date().toISOString(),
            token,
            type: "Connections.Response",
        };
        return {
            context: this.getContextData(),
            request,
            session: this.getSessionData(false),
            version: this.version,
        };
    }
    getMessageReceivedRequest(message) {
        return {
            context: this.getContextData(),
            request: {
                locale: this.locale,
                message,
                requestId: `EdwRequestId.${uuid_1.v1()}`,
                timestamp: new Date().toISOString(),
                type: "Messaging.MessageReceived",
            },
            session: this.getSessionData(),
            version: this.version,
        };
    }
}
exports.AlexaRequestBuilder = AlexaRequestBuilder;
function getLambdaContext(callback) {
    return {
        awsRequestId: "aws://",
        callbackWaitsForEmptyEventLoop: false,
        functionName: "functionName",
        functionVersion: "0.1",
        invokedFunctionArn: "arn://",
        logGroupName: "",
        logStreamName: "",
        memoryLimitInMB: 128,
        getRemainingTimeInMillis: () => 1000,
        done: callback,
        fail: (err) => {
            if (_.isString(err)) {
                return callback(new Error(err));
            }
            return callback(err);
        },
        succeed: (msg) => callback(undefined, msg),
    };
}
exports.getLambdaContext = getLambdaContext;
function getAPIGatewayProxyEvent(method = "GET", body = null) {
    return {
        body,
        headers: {},
        httpMethod: method,
        isBase64Encoded: false,
        multiValueHeaders: {},
        multiValueQueryStringParameters: {},
        path: "/",
        pathParameters: null,
        queryStringParameters: null,
        requestContext: {
            accountId: "",
            apiId: "",
            connectedAt: 0,
            httpMethod: method,
            identity: {
                accessKey: null,
                accountId: null,
                apiKey: null,
                apiKeyId: null,
                caller: null,
                cognitoAuthenticationProvider: null,
                cognitoAuthenticationType: null,
                cognitoIdentityId: null,
                cognitoIdentityPoolId: null,
                sourceIp: "",
                user: null,
                userAgent: null,
                userArn: null,
            },
            path: "/",
            requestId: "",
            requestTimeEpoch: 123,
            resourceId: "",
            resourcePath: "/",
            stage: "",
        },
        resource: "",
        stageVariables: null,
    };
}
exports.getAPIGatewayProxyEvent = getAPIGatewayProxyEvent;
function isAlexaEvent(voxaEvent) {
    return voxaEvent.alexa !== undefined;
}
exports.isAlexaEvent = isAlexaEvent;
//# sourceMappingURL=tools.js.map