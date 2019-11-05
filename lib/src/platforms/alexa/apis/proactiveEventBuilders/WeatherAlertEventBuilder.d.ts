import { EventBuilder } from "./EventBuilder";
/**
 * Weather Alert Events Builder class reference
 */
export declare class WeatherAlertEventBuilder extends EventBuilder {
    alertType: WEATHER_ALERT_TYPE;
    constructor();
    setHurricane(): WeatherAlertEventBuilder;
    setSnowStorm(): WeatherAlertEventBuilder;
    setThunderStorm(): WeatherAlertEventBuilder;
    setTornado(): WeatherAlertEventBuilder;
    getPayload(): any;
    private setAlertType;
}
export declare enum WEATHER_ALERT_TYPE {
    DEFAULT = "",
    HURRICANE = "HURRICANE",
    SNOW_STORM = "SNOW_STORM",
    THUNDER_STORM = "THUNDER_STORM",
    TORNADO = "TORNADO"
}
