import * as AWS from "aws-sdk";
import { VoxaApp } from "../VoxaApp";
export interface IS3Persistence {
    aws?: AWS.S3.ClientConfiguration;
    bucketName?: string;
    pathPrefix?: string;
    s3Client?: AWS.S3;
}
export declare function s3Persistence(voxaApp: VoxaApp, config: IS3Persistence): void;
