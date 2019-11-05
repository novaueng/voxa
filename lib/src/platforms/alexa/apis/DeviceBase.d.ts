import { RequestEnvelope } from "ask-sdk-model";
import { LambdaLog } from "lambda-log";
import { ApiBase } from "./ApiBase";
export declare class DeviceBase extends ApiBase {
    deviceId: string;
    constructor(event: RequestEnvelope, log: LambdaLog);
}
