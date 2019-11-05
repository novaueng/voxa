"use strict";
/*
 * Copyright (c) 2018 Rain Agency <contact@rain.agency>
 * Author: Rain Agency <contact@rain.agency>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const EventBuilder_1 = require("./EventBuilder");
/**
 * Weather Alert Events Builder class reference
 */
class WeatherAlertEventBuilder extends EventBuilder_1.EventBuilder {
    constructor() {
        super("AMAZON.WeatherAlert.Activated");
        this.alertType = WEATHER_ALERT_TYPE.DEFAULT;
    }
    setHurricane() {
        this.setAlertType(WEATHER_ALERT_TYPE.HURRICANE);
        return this;
    }
    setSnowStorm() {
        this.setAlertType(WEATHER_ALERT_TYPE.SNOW_STORM);
        return this;
    }
    setThunderStorm() {
        this.setAlertType(WEATHER_ALERT_TYPE.THUNDER_STORM);
        return this;
    }
    setTornado() {
        this.setAlertType(WEATHER_ALERT_TYPE.TORNADO);
        return this;
    }
    getPayload() {
        return {
            weatherAlert: {
                alertType: this.alertType,
                source: "localizedattribute:source",
            },
        };
    }
    setAlertType(alertType) {
        this.alertType = alertType;
    }
}
exports.WeatherAlertEventBuilder = WeatherAlertEventBuilder;
var WEATHER_ALERT_TYPE;
(function (WEATHER_ALERT_TYPE) {
    WEATHER_ALERT_TYPE["DEFAULT"] = "";
    WEATHER_ALERT_TYPE["HURRICANE"] = "HURRICANE";
    WEATHER_ALERT_TYPE["SNOW_STORM"] = "SNOW_STORM";
    WEATHER_ALERT_TYPE["THUNDER_STORM"] = "THUNDER_STORM";
    WEATHER_ALERT_TYPE["TORNADO"] = "TORNADO";
})(WEATHER_ALERT_TYPE = exports.WEATHER_ALERT_TYPE || (exports.WEATHER_ALERT_TYPE = {}));
//# sourceMappingURL=WeatherAlertEventBuilder.js.map