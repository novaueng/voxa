import { EventBuilder } from "./EventBuilder";
/**
 * Media Content Events Builder class reference
 */
export declare class MediaContentEventBuilder extends EventBuilder {
    availability: any;
    content: any;
    constructor();
    setAvailability(method: MEDIA_CONTENT_METHOD): MediaContentEventBuilder;
    setContentType(contentType: MEDIA_CONTENT_TYPE): MediaContentEventBuilder;
    getPayload(): any;
}
export declare enum MEDIA_CONTENT_METHOD {
    AIR = "AIR",
    DROP = "DROP",
    PREMIERE = "PREMIERE",
    RELEASE = "RELEASE",
    STREAM = "STREAM"
}
export declare enum MEDIA_CONTENT_TYPE {
    ALBUM = "ALBUM",
    BOOK = "BOOK",
    EPISODE = "EPISODE",
    GAME = "GAME",
    MOVIE = "MOVIE",
    SINGLE = "SINGLE"
}
