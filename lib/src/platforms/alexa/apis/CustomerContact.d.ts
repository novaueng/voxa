import { RequestEnvelope } from "ask-sdk-model";
import { LambdaLog } from "lambda-log";
import { ApiBase } from "./ApiBase";
/**
 * CustomerContact API class reference
 * https://developer.amazon.com/docs/custom-skills/request-customer-contact-information-for-use-in-your-skill.html#get-customer-contact-information
 */
export declare class CustomerContact extends ApiBase {
    constructor(event: RequestEnvelope, log: LambdaLog);
    /**
     * Gets user's email address
     */
    getEmail(): Promise<string>;
    /**
     * Gets user's given name
     */
    getGivenName(): Promise<string>;
    /**
     * Gets user's name
     */
    getName(): Promise<string>;
    /**
     * Gets user's phone number
     */
    getPhoneNumber(): Promise<any>;
    /**
     * Gets user's full contact information
     */
    getFullUserInformation(): Promise<any>;
}
