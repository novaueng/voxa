/// <reference types="node" />
export { OnSessionEndedError } from "./OnSessionEndedError";
export { NotImplementedError } from "./NotImplementedError";
export { TimeoutError } from "./TimeoutError";
export { errorHandler } from "./handler";
export { SSMLError } from "./SSMLError";
export declare const UnknownState: {
    new (value: string): {
        [key: string]: any;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const UnknownRequestType: {
    new (value: string): {
        [key: string]: any;
        name: string;
        message: string;
        stack?: string | undefined;
    };
    captureStackTrace(targetObject: Object, constructorOpt?: Function | undefined): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
