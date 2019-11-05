import { Context as AzureContext } from "azure-functions-ts-essentials";
export declare function isAzureContext(context: any): context is AzureContext;
/**
 * This is just a helper for some azure specific tests
 */
export declare function azureLog(): IAzureLog;
interface IAzureLog {
    (...message: any[]): void;
    error(...message: any[]): void;
    warn(...message: any[]): void;
    info(...message: any[]): void;
    verbose(...message: any[]): void;
    metric(...message: any[]): void;
}
export {};
