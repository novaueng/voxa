import { services } from "ask-sdk-model";
import { DeviceBase } from "./DeviceBase";
export declare class DeviceAddress extends DeviceBase {
    /**
     * Gets the full address associated with the device specified by deviceId.
     * https://developer.amazon.com/docs/custom-skills/device-address-api.html#getAddress
     */
    getAddress(): Promise<services.deviceAddress.Address>;
    /**
     * Gets the country/region and postal code associated with a device
     * specified by deviceId. The endpoint is case-sensitive.
     * https://developer.amazon.com/docs/custom-skills/device-address-api.html#getCountryAndPostalCode
     */
    getCountryRegionPostalCode(): Promise<services.deviceAddress.ShortAddress>;
}
