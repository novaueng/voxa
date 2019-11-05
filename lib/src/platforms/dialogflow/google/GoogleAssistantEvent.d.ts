import { GoogleCloudDialogflowV2WebhookRequest } from "actions-on-google";
import { Context as AWSLambdaContext } from "aws-lambda";
import { Context as AzureContext } from "azure-functions-ts-essentials";
import { TokenPayload } from "google-auth-library/build/src/auth/loginticket";
import { LambdaLogOptions } from "lambda-log";
import { IVoxaUserProfile } from "../../../VoxaEvent";
import { DialogflowEvent } from "../DialogflowEvent";
import { DigitalGoods } from "./apis/DigitalGoods";
export declare class GoogleAssistantEvent extends DialogflowEvent {
    google: {
        digitalGoods: DigitalGoods;
    };
    constructor(rawEvent: GoogleCloudDialogflowV2WebhookRequest, logOptions?: LambdaLogOptions, executionContext?: AWSLambdaContext | AzureContext);
    verifyProfile(): Promise<TokenPayload | undefined>;
    getUserInformation(): Promise<IVoxaGoogleUserProfile>;
    afterPlatformInitialized(): void;
    /**
     * conv.user.id is a deprecated feature that will be removed soon
     * this makes it so skills using voxa are future proof
     *
     * We use conv.user.id if it's available, but we store it in userStorage,
     * If there's no conv.user.id we generate a uuid.v1 and store it in userStorage
     *
     * After that we'll default to the userStorage value
     */
    protected getUserId(conv: any): string;
}
export interface IVoxaGoogleUserProfile extends IVoxaUserProfile {
    aud: string;
    emailVerified: boolean;
    exp: number;
    familyName: string;
    givenName: string;
    iat: number;
    iss: string;
    locale: string;
    sub: string;
}
