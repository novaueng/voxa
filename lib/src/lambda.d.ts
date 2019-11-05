/// <reference types="node" />
import { Context as AWSLambdaContext } from "aws-lambda";
export declare function timeout(context: AWSLambdaContext): {
    timerPromise: Promise<void>;
    timer: NodeJS.Timer | undefined;
};
export declare function isLambdaContext(context: any): context is AWSLambdaContext;
