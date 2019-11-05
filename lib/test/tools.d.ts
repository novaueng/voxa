import { Context, interfaces, RequestEnvelope, Session, SessionEndedReason } from "ask-sdk-model";
import { APIGatewayProxyEvent, Callback as AWSLambdaCallback, Context as AWSLambdaContext } from "aws-lambda";
import { AlexaEvent } from "../src/platforms/alexa/AlexaEvent";
export declare class AlexaRequestBuilder {
    locale: string;
    version: string;
    applicationId: string;
    deviceId: string;
    userId: string;
    constructor(userId?: string, applicationId?: string, locale?: string);
    getSessionEndedRequest(reason?: SessionEndedReason, error?: any): RequestEnvelope;
    getDisplayElementSelectedRequest(token: string): RequestEnvelope;
    getAlexaPresentationAPLUserEvent(): RequestEnvelope;
    getCanFulfillIntentRequestRequest(intentName: string, slots?: any): RequestEnvelope;
    getCompletedDialog(intentName: string, slots?: any): RequestEnvelope;
    getIntentRequest(intentName: string, slots?: any): RequestEnvelope;
    getContextData(): Context;
    getSessionData(newSession?: boolean): Session;
    getLaunchRequest(): RequestEnvelope;
    getPlaybackStoppedRequest(token?: string): RequestEnvelope;
    getGameEngineInputHandlerEventRequest(buttonsRecognized?: number): RequestEnvelope;
    getConnectionsResponseRequest(name: string, token: string, payload: any, status?: interfaces.connections.ConnectionsStatus): RequestEnvelope;
    getMessageReceivedRequest(message: any): RequestEnvelope;
}
export declare function getLambdaContext(callback: AWSLambdaCallback<any>): AWSLambdaContext;
export declare function getAPIGatewayProxyEvent(method?: string, body?: string | null): APIGatewayProxyEvent;
export declare function isAlexaEvent(voxaEvent: any): voxaEvent is AlexaEvent;
