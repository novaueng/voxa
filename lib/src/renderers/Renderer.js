"use strict";
/*
 * Copyright (c) 2018 Rain Agency <contact@rain.agency>
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
const bluebird = require("bluebird");
const _ = require("lodash");
exports.tokenRegx = /{([\s\S]+?)}/g;
class Renderer {
    constructor(config) {
        if (!config.variables) {
            config.variables = {};
        }
        if (!config.views) {
            throw new Error("DefaultRenderer config should include views");
        }
        this.config = config;
    }
    async renderPath(view, voxaEvent, variables) {
        const locale = voxaEvent.request.locale;
        const platform = voxaEvent.platform.name;
        let message = voxaEvent.t(view, {
            defaultValue: view,
            returnObjects: true,
        });
        if (platform && _.get(message, platform)) {
            message = _.get(message, platform);
        }
        if (_.isString(message) && message === view) {
            throw new Error(`View ${view} for ${locale} locale is missing`);
        }
        return this.renderMessage(message, voxaEvent);
    }
    /**
     * it makes a deep search for strings that could have a variable on it
     * @param  any statement - can be a string, array, object or any other value
     * @param VoxaEvent voxaEvent
     * @return Promise             Promise with the statement rendered
     * @example
     * // return { Launch: 'Hi, morning', card: { type: 'Standard', title: 'title' ...}}
     * deepSearchRenderVariable({ Launch: 'hi, {time}', card: '{exitCard}' }, voxaEvent);
     */
    async renderMessage(statement, voxaEvent) {
        if (_.isArray(statement)) {
            return this.renderArrayStatement(statement, voxaEvent);
        }
        if (_.isObject(statement)) {
            return this.renderObjectStatement(statement, voxaEvent);
        }
        if (_.isString(statement)) {
            return await this.renderStatement(statement, voxaEvent);
        }
        return statement;
    }
    async renderStatement(statement, voxaEvent) {
        const vars = await this.executeVariables(statement, voxaEvent);
        const data = _(vars)
            .chunk(2)
            .fromPairs()
            .value();
        const dataKeys = _.keys(data);
        const dataValues = _.values(data);
        if (_.isEmpty(statement.replace(exports.tokenRegx, "").trim()) &&
            dataKeys.length === 1) {
            const singleValue = _.head(dataValues);
            return _.isObject(singleValue)
                ? singleValue
                : _.template(statement)(data);
        }
        return _.template(statement)(data);
    }
    async renderObjectStatement(statement, voxaEvent) {
        const objPromises = _.chain(statement)
            .toPairs()
            .map(_.spread((key, value) => [key, this.renderMessage(value, voxaEvent)]))
            .flattenDeep()
            .value();
        const result = await Promise.all(objPromises);
        return _.chain(result)
            .chunk(2)
            .fromPairs()
            .value();
    }
    async renderArrayStatement(statement, voxaEvent) {
        return bluebird.map(statement, (statementItem) => this.renderMessage(statementItem, voxaEvent));
    }
    /**
     * Takes a string statement and gets the value for all variables
     */
    async executeVariables(statement, voxaEvent) {
        _.templateSettings.interpolate = exports.tokenRegx;
        const tokenKeys = _.uniq(statement.match(exports.tokenRegx) || []).map((str) => str.substring(1, str.length - 1));
        const qVariables = _(tokenKeys)
            .map((token) => {
            if (!this.config.variables[token]) {
                throw new Error(`No such variable in views, ${token}`);
            }
            return [token, this.config.variables[token](voxaEvent)];
        })
            .flatten()
            .value();
        return Promise.all(qVariables);
    }
}
exports.Renderer = Renderer;
//# sourceMappingURL=Renderer.js.map