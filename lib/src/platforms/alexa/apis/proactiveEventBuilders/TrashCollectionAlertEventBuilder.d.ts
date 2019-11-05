import { EventBuilder } from "./EventBuilder";
/**
 * Trash Collection Alert Events Builder class reference
 */
export declare class TrashCollectionAlertEventBuilder extends EventBuilder {
    alert: any;
    constructor();
    setAlert(collectionDayOfWeek: GARBAGE_COLLECTION_DAY, ...garbageTypes: GARBAGE_TYPE[]): TrashCollectionAlertEventBuilder;
    getPayload(): any;
}
export declare enum GARBAGE_COLLECTION_DAY {
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY"
}
export declare enum GARBAGE_TYPE {
    BOTTLES = "BOTTLES",
    BULKY = "BULKY",
    BURNABLE = "BURNABLE",
    CANS = "CANS",
    CLOTHING = "CLOTHING",
    COMPOSTABLE = "COMPOSTABLE",
    CRUSHABLE = "CRUSHABLE",
    GARDEN_WASTE = "GARDEN_WASTE",
    GLASS = "GLASS",
    HAZARDOUS = "HAZARDOUS",
    HOME_APPLIANCES = "HOME_APPLIANCES",
    KITCHEN_WASTE = "KITCHEN_WASTE",
    LANDFILL = "LANDFILL",
    PET_BOTTLES = "PET_BOTTLES",
    RECYCLABLE_PLASTICS = "RECYCLABLE_PLASTICS",
    WASTE_PAPER = "WASTE_PAPER"
}
