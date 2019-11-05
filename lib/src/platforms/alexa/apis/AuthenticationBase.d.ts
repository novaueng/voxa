/**
 * Messaging API class reference
 * https://developer.amazon.com/docs/smapi/skill-messaging-api-reference.html
 */
export declare class AuthenticationBase {
    clientId: string;
    clientSecret: string;
    constructor(clientId: string, clientSecret: string);
    /**
     * Gets new access token
     * https://developer.amazon.com/docs/smapi/configure-an-application-or-service-to-send-messages-to-your-skill.html
     */
    getAuthenticationToken(scope: string): Promise<any>;
}
