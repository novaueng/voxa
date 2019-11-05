import { EventBuilder } from "./EventBuilder";
/**
 * Occasion Events Builder class reference
 */
export declare class OccasionEventBuilder extends EventBuilder {
    occasion: any;
    state: any;
    constructor();
    setOccasion(bookingTime: string, occasionType: OCCASION_TYPE): OccasionEventBuilder;
    setStatus(confirmationStatus: OCCASION_CONFIRMATION_STATUS): OccasionEventBuilder;
    getPayload(): any;
}
export declare enum OCCASION_CONFIRMATION_STATUS {
    CANCELED = "CANCELED",
    CONFIRMED = "CONFIRMED",
    CREATED = "CREATED",
    REQUESTED = "REQUESTED",
    RESCHEDULED = "RESCHEDULED",
    UPDATED = "UPDATED"
}
export declare enum OCCASION_TYPE {
    APPOINTMENT = "APPOINTMENT",
    APPOINTMENT_REQUEST = "APPOINTMENT_REQUEST",
    RESERVATION = "RESERVATION",
    RESERVATION_REQUEST = "RESERVATION_REQUEST"
}
