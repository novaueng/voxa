import { EventBuilder } from "./EventBuilder";
/**
 * Order Status Events Builder class reference
 */
export declare class OrderStatusEventBuilder extends EventBuilder {
    state: any;
    constructor();
    setStatus(status: ORDER_STATUS, expectedArrival?: string, enterTimestamp?: string): OrderStatusEventBuilder;
    getPayload(): any;
}
export declare enum ORDER_STATUS {
    ORDER_DELIVERED = "ORDER_DELIVERED",
    ORDER_OUT_FOR_DELIVERY = "ORDER_OUT_FOR_DELIVERY",
    ORDER_PREPARING = "ORDER_PREPARING",
    ORDER_RECEIVED = "ORDER_RECEIVED",
    ORDER_SHIPPED = "ORDER_SHIPPED",
    PREORDER_RECEIVED = "PREORDER_RECEIVED"
}
