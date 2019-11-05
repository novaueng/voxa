"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class DialogflowSession {
    constructor(conv) {
        this.outputAttributes = {};
        this.contexts = conv.contexts.input;
        this.sessionId = conv.id;
        this.new = conv.type === "NEW";
        this.attributes = this.getAttributes(conv);
    }
    getAttributes(conv) {
        const context = this.contexts.attributes;
        if (!context) {
            return {};
        }
        if (_.isString(context.parameters.attributes)) {
            return JSON.parse(context.parameters.attributes);
        }
        return context.parameters.attributes;
    }
}
exports.DialogflowSession = DialogflowSession;
//# sourceMappingURL=DialogflowSession.js.map