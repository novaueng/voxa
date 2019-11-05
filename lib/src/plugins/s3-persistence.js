"use strict";
/*
 * Copyright (c) 2019 Rain Agency <contact@rain.agency>
 * Author: Rain Agency <contact@rain.agency>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const _ = require("lodash");
const path = require("path");
let defaultConfig = {
    bucketName: "",
};
function s3Persistence(voxaApp, config) {
    const bucketName = config.bucketName || process.env.S3_PERSISTENCE_BUCKET;
    if (!bucketName) {
        throw Error("Missing bucketName");
    }
    defaultConfig = _.merge(defaultConfig, config);
    defaultConfig.bucketName = bucketName;
    defaultConfig.s3Client = config.s3Client || new AWS.S3(config.aws);
    defaultConfig.pathPrefix = config.pathPrefix || "";
    voxaApp.onRequestStarted(onRequestStarted);
    voxaApp.onBeforeReplySent(onBeforeReplySent);
}
exports.s3Persistence = s3Persistence;
async function onRequestStarted(voxaEvent) {
    try {
        const objectId = path.join(defaultConfig.pathPrefix, voxaEvent.user.userId);
        const getParams = {
            Bucket: defaultConfig.bucketName,
            Key: objectId,
        };
        let result = {};
        try {
            result = await defaultConfig.s3Client.getObject(getParams).promise();
        }
        catch (error) {
            if (error.code !== "NoSuchKey") {
                throw error;
            }
        }
        const body = result.Body ? result.Body.toString() : "{}";
        const data = JSON.parse(body);
        voxaEvent.log.debug("Data fetched:", { data });
        voxaEvent.model.user = data;
        return voxaEvent;
    }
    catch (error) {
        throw error;
    }
}
async function onBeforeReplySent(voxaEvent, reply) {
    const objectId = path.join(defaultConfig.pathPrefix, voxaEvent.user.userId);
    const putParams = {
        Body: JSON.stringify(voxaEvent.model.user),
        Bucket: defaultConfig.bucketName,
        Key: objectId,
    };
    try {
        await defaultConfig.s3Client
            .putObject(putParams)
            .promise();
    }
    catch (error) {
        throw error;
    }
    return reply;
}
//# sourceMappingURL=s3-persistence.js.map