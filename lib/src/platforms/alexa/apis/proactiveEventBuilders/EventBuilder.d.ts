/**
 * Events Builder class reference
 */
export declare class EventBuilder {
    private expiryTime;
    private timestamp;
    private localizedAttributes;
    private name;
    private payload;
    private referenceId;
    private relevantAudience;
    constructor(name?: string);
    addContent(locale: string, localizedKey: string, localizedValue: string): EventBuilder;
    setExpiryTime(expiryTime: string): EventBuilder;
    setPayload(payload: any): EventBuilder;
    setReferenceId(referenceId: string): EventBuilder;
    setMulticast(): EventBuilder;
    setTimestamp(timestamp: string): EventBuilder;
    setUnicast(userId: string): EventBuilder;
    getPayload(): any;
    build(): any;
}
