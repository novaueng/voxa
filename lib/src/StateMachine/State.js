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
const _ = require("lodash");
class State {
    constructor(name, handler, intents = [], platform = "core") {
        this.name = name;
        this.platform = platform;
        this.intents = [];
        if (_.isFunction(handler)) {
            this.handler = handler;
        }
        else {
            this.handler = this.getSimpleTransitionHandler(handler);
        }
        if (_.isString(intents)) {
            this.intents = [intents];
        }
        else {
            this.intents = intents;
        }
    }
    async handle(voxaEvent) {
        return this.handler(voxaEvent);
    }
    getSimpleTransitionHandler(transition) {
        return async (voxaEvent) => _.cloneDeep(transition);
    }
}
exports.State = State;
//# sourceMappingURL=State.js.map