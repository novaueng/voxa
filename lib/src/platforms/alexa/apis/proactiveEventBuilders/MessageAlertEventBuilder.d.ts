import { EventBuilder } from "./EventBuilder";
/**
 * Message Alert Events Builder class reference
 */
export declare class MessageAlertEventBuilder extends EventBuilder {
    messageGroup: any;
    state: any;
    constructor();
    setMessageGroup(creatorName: string, count: number, urgency?: MESSAGE_ALERT_URGENCY): MessageAlertEventBuilder;
    setState(status: MESSAGE_ALERT_STATUS, freshness?: MESSAGE_ALERT_FRESHNESS): MessageAlertEventBuilder;
    getPayload(): any;
}
export declare enum MESSAGE_ALERT_FRESHNESS {
    NEW = "NEW",
    OVERDUE = "OVERDUE"
}
export declare enum MESSAGE_ALERT_STATUS {
    FLAGGED = "FLAGGED",
    UNREAD = "UNREAD"
}
export declare enum MESSAGE_ALERT_URGENCY {
    URGENT = "URGENT"
}
