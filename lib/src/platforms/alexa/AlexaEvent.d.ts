import { RequestEnvelope } from "ask-sdk-model";
import { Context as AWSLambdaContext } from "aws-lambda";
import { Context as AzureContext } from "azure-functions-ts-essentials";
import { LambdaLogOptions } from "lambda-log";
import { IVoxaIntent, IVoxaUserProfile, VoxaEvent } from "../../VoxaEvent";
import { CustomerContact, DeviceAddress, DeviceSettings, InSkillPurchase, Lists, Reminders } from "./apis";
export declare class AlexaEvent extends VoxaEvent {
    readonly token: any;
    readonly supportedInterfaces: string[];
    intent?: IVoxaIntent;
    rawEvent: RequestEnvelope;
    alexa: {
        customerContact: CustomerContact;
        deviceAddress: DeviceAddress;
        deviceSettings: DeviceSettings;
        isp: InSkillPurchase;
        lists: Lists;
        reminders: Reminders;
    };
    requestToIntent: any;
    constructor(rawEvent: RequestEnvelope, logOptions?: LambdaLogOptions, executionContext?: AWSLambdaContext | AzureContext);
    getUserInformation(): Promise<IVoxaAlexaUserProfile>;
    protected initUser(): void;
    protected initApis(): void;
    protected initSession(): void;
    protected initIntents(): void;
}
export interface IVoxaAlexaUserProfile extends IVoxaUserProfile {
    userId: string;
    zipCode: string;
}
