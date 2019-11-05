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
Promise.resolve().then(() => require("mocha"));
const chai_1 = require("chai");
const VoxaReply_1 = require("../src/VoxaReply");
describe("VoxaReply", () => {
    describe("addToText", () => {
        it("should return the statement if no text is passed", () => {
            chai_1.expect(VoxaReply_1.addToText("", "statement")).to.equal("statement");
        });
        it("should append to the original text", () => {
            chai_1.expect(VoxaReply_1.addToText("text", "statement")).to.equal("text statement");
        });
    });
    describe("addToSSML", () => {
        it("should append a statement to ssml by inserting a newline between", () => {
            chai_1.expect(VoxaReply_1.addToSSML("<speak>Howdy</speak>", "there")).to.equal("<speak>Howdy\nthere</speak>");
        });
        it("handles SSML that contains newlines", () => {
            chai_1.expect(VoxaReply_1.addToSSML("<speak>Howdy\n and a good day to you</speak>", "there"))
                .to.equal("<speak>Howdy\n and a good day to you\nthere</speak>");
        });
        it("should replace & with amp;", () => {
            chai_1.expect(VoxaReply_1.addToSSML("", "&")).to.equal("<speak>&amp;</speak>");
        });
        it("should throw an error for invalid SSML;", () => {
            chai_1.expect(() => VoxaReply_1.addToSSML("", "<audio /> Test</audio>"))
                .to.throw("closing tag speak is expected inplace of audio.");
        });
    });
});
//# sourceMappingURL=VoxaReply.spec.js.map