import { GoogleActionsTransactionsV3CompletePurchaseValuePurchaseStatus, GoogleActionsTransactionsV3SkuIdSkuType, GoogleCloudDialogflowV2WebhookRequest } from "actions-on-google";
import { LambdaLog } from "lambda-log";
import { ApiBase } from "./ApiBase";
import { ITransactionOptions } from "./ITransactionOptions";
/**
 * DigitalGoods API class reference
 * https://developers.google.com/actions/transactions/digital/dev-guide-digital
 */
export declare class DigitalGoods extends ApiBase {
    tag: string;
    constructor(event: GoogleCloudDialogflowV2WebhookRequest, log: LambdaLog, options: ITransactionOptions);
    /**
     * Gets Entitlements from PlayStore
     */
    getInAppEntitlements(skus: string[]): Promise<any>;
    /**
     * Gets Subscriptions from PlayStore
     */
    getSubscriptions(skus: string[]): Promise<any>;
    /**
     * Gets Skus from PlayStore
     */
    getSkus(skus: string[], type: GoogleActionsTransactionsV3SkuIdSkuType): Promise<any>;
    /**
     * Gets Google Transactions Status
     */
    getPurchaseStatus(): GoogleActionsTransactionsV3CompletePurchaseValuePurchaseStatus;
    /**
     * Checks if purchase status is PURCHASE_STATUS_ALREADY_OWNED
     */
    isPurchaseStatusAlreadyOwned(): boolean;
    /**
     * Checks if purchase status is PURCHASE_STATUS_ITEM_CHANGE_REQUESTED
     */
    isPurchaseStatusChangeRequested(): boolean;
    /**
     * Checks if purchase status is PURCHASE_STATUS_ERROR
     */
    isPurchaseStatusError(): boolean;
    /**
     * Checks if purchase status is PURCHASE_STATUS_ITEM_UNAVAILABLE
     */
    isPurchaseStatusItemUnavailable(): boolean;
    /**
     * Checks if purchase status is PURCHASE_STATUS_OK
     */
    isPurchaseStatusOk(): boolean;
    /**
     * Checks if purchase status is PURCHASE_STATUS_USER_CANCELLED
     */
    isPurchaseStatusUserCancelled(): boolean;
}
