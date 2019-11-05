import { AuthenticationBase } from "./AuthenticationBase";
export declare class Messaging extends AuthenticationBase {
    /**
     * Sends message to a skill
     * https://developer.amazon.com/docs/smapi/skill-messaging-api-reference.html#skill-messaging-api-usage
     */
    sendMessage(request: IMessageRequest): Promise<any>;
}
export interface IMessageRequest {
    endpoint: string;
    userId: string;
    data: any;
    expiresAfterSeconds?: number;
}
