import { RequestEnvelope } from "ask-sdk-model";
import { LambdaLog } from "lambda-log";
import { DeviceBase } from "./DeviceBase";
export declare class DeviceSettings extends DeviceBase {
    constructor(event: RequestEnvelope, log: LambdaLog);
    /**
     * Gets distance unit associated to device settings
     * https://developer.amazon.com/docs/smapi/alexa-settings-api-reference.html#get-the-distance-measurement-unit
     */
    getDistanceUnits(): Promise<string>;
    /**
     * Gets temperature unit associated to device settings
     * https://developer.amazon.com/docs/smapi/alexa-settings-api-reference.html#get-the-temperature-measurement-unit
     */
    getTemperatureUnits(): Promise<string>;
    /**
     * Gets the timezone specified in device settings
     * https://developer.amazon.com/docs/smapi/alexa-settings-api-reference.html#get-the-timezone
     */
    getTimezone(): Promise<string>;
    /**
     * Gets timezone, distance and temperature units associated
     * to device settings in a single object
     * https://developer.amazon.com/docs/smapi/alexa-settings-api-reference.html
     */
    getSettings(): Promise<{
        distanceUnits: string;
        temperatureUnits: string;
        timezone: string;
    }>;
}
