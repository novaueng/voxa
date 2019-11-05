import { GoogleCloudDialogflowV2WebhookRequest } from "actions-on-google";
import { LambdaLog } from "lambda-log";
import { ITransactionOptions } from "./ITransactionOptions";
export declare class ApiBase {
    log: LambdaLog;
    transactionOptions?: ITransactionOptions | undefined;
    tag: string;
    rawEvent: GoogleCloudDialogflowV2WebhookRequest;
    constructor(event: GoogleCloudDialogflowV2WebhookRequest, log: LambdaLog, transactionOptions?: ITransactionOptions | undefined);
    /**
     * Gets Google's Credentials: access_token, refresh_token, expiration_date, token_type
     */
    protected getCredentials(): Promise<any>;
    private getClient;
}
