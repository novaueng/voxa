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
const DeviceBase_1 = require("./DeviceBase");
class DeviceSettings extends DeviceBase_1.DeviceBase {
    constructor(event, log) {
        super(event, log);
        this.tag = "DeviceSettings";
        this.errorCodeSafeToIgnore = 204;
    }
    /**
     * Gets distance unit associated to device settings
     * https://developer.amazon.com/docs/smapi/alexa-settings-api-reference.html#get-the-distance-measurement-unit
     */
    getDistanceUnits() {
        return this.getResult(`v2/devices/${this.deviceId}/settings/System.distanceUnits`).catch((err) => this.checkError(err));
    }
    /**
     * Gets temperature unit associated to device settings
     * https://developer.amazon.com/docs/smapi/alexa-settings-api-reference.html#get-the-temperature-measurement-unit
     */
    getTemperatureUnits() {
        return this.getResult(`v2/devices/${this.deviceId}/settings/System.temperatureUnits`).catch((err) => this.checkError(err));
    }
    /**
     * Gets the timezone specified in device settings
     * https://developer.amazon.com/docs/smapi/alexa-settings-api-reference.html#get-the-timezone
     */
    getTimezone() {
        return this.getResult(`v2/devices/${this.deviceId}/settings/System.timeZone`).catch((err) => this.checkError(err));
    }
    /**
     * Gets timezone, distance and temperature units associated
     * to device settings in a single object
     * https://developer.amazon.com/docs/smapi/alexa-settings-api-reference.html
     */
    async getSettings() {
        const infoRequests = [
            this.getDistanceUnits(),
            this.getTemperatureUnits(),
            this.getTimezone(),
        ];
        const [distanceUnits, temperatureUnits, timezone] = await Promise.all(infoRequests);
        return {
            distanceUnits,
            temperatureUnits,
            timezone,
        };
    }
}
exports.DeviceSettings = DeviceSettings;
//# sourceMappingURL=DeviceSettings.js.map