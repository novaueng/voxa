import { interfaces, RequestEnvelope, services } from "ask-sdk-model";
import { LambdaLog } from "lambda-log";
import * as rp from "request-promise";
import { ConnectionsSendRequest } from "../directives";
export interface IPurchasePayload {
    InSkillProduct: interfaces.monetization.v1.InSkillProduct;
    upsellMessage?: string;
}
export declare class InSkillPurchase {
    log: LambdaLog;
    static buy(productId: string, token: string): ConnectionsSendRequest;
    static cancel(productId: string, token: string): ConnectionsSendRequest;
    static upsell(productId: string, upsellMessage: string, token: string): ConnectionsSendRequest;
    protected static sendConnectionSendRequest(method: string, productId: string, token: string, upsellMessage?: string): ConnectionsSendRequest;
    protected static formatPayload(productId: string, upsellMessage?: string): IPurchasePayload;
    rawEvent: RequestEnvelope;
    constructor(event: RequestEnvelope, log: LambdaLog);
    isAllowed(): boolean;
    buyByReferenceName(referenceName: string, token: string): Promise<ConnectionsSendRequest>;
    cancelByReferenceName(referenceName: string, token: string): Promise<ConnectionsSendRequest>;
    upsellByReferenceName(referenceName: string, upsellMessage: string, token: string): Promise<ConnectionsSendRequest>;
    getProductByReferenceName(referenceName: string): Promise<services.monetization.InSkillProduct | object>;
    getProductList(): rp.RequestPromise;
}
