import { AuthenticationBase } from "./AuthenticationBase";
import { EventBuilder } from "./proactiveEventBuilders/EventBuilder";
export declare class ProactiveEvents extends AuthenticationBase {
    /**
     * Creates proactive event
     * https://developer.amazon.com/docs/smapi/proactive-events-api.html
     */
    createEvent(endpoint: string, body: EventBuilder, isDevelopment?: boolean): Promise<any>;
}
