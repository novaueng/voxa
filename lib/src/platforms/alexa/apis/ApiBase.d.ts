import { RequestEnvelope } from "ask-sdk-model";
import { LambdaLog } from "lambda-log";
export declare class ApiBase {
    log: LambdaLog;
    errorCodeSafeToIgnore: number;
    tag: string;
    rawEvent: RequestEnvelope;
    constructor(event: RequestEnvelope, log: LambdaLog);
    protected getResult(path?: string, method?: string, body?: any): Promise<any>;
    protected checkError(error: any): undefined;
    protected getToken(): any;
    protected getEndpoint(): any;
}
