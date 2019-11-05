"use strict";
/*
 * Directives are functions that apply changes on the reply object. They can be registered as keys on the voxa
 * application and then used on transitions
 *
 * For example, the reply directive is used as part of the transition to render ask, say, tell, reprompt or directives.
 *
 * return { reply: 'View' }
 */
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird = require("bluebird");
const _ = require("lodash");
function sampleOrItem(statement, platform) {
    if (_.isArray(statement)) {
        if (platform.config.test) {
            return _.head(statement);
        }
        return _.sample(statement);
    }
    return statement;
}
exports.sampleOrItem = sampleOrItem;
class Reprompt {
    constructor(viewPath) {
        this.viewPath = viewPath;
    }
    async writeToReply(reply, event, transition) {
        const statement = await event.renderer.renderPath(this.viewPath, event);
        reply.addReprompt(sampleOrItem(statement, event.platform));
    }
}
Reprompt.key = "reprompt";
Reprompt.platform = "core";
exports.Reprompt = Reprompt;
class Ask {
    constructor(viewPaths) {
        this.viewPaths = _.isString(viewPaths) ? [viewPaths] : viewPaths;
    }
    async writeToReply(reply, event, transition) {
        transition.flow = "yield";
        transition.say = this.viewPaths;
        for (const viewPath of this.viewPaths) {
            const statement = await event.renderer.renderPath(viewPath, event);
            if (!statement.ask) {
                reply.addStatement(sampleOrItem(statement, event.platform));
            }
            else {
                this.addStatementToReply(statement, reply, event);
            }
        }
    }
    addStatementToReply(statement, reply, event) {
        reply.addStatement(sampleOrItem(statement.ask, event.platform));
        if (statement.reprompt) {
            reply.addReprompt(sampleOrItem(statement.reprompt, event.platform));
        }
    }
}
Ask.key = "ask";
Ask.platform = "core";
exports.Ask = Ask;
class Say {
    constructor(viewPaths) {
        this.viewPaths = viewPaths;
    }
    async writeToReply(reply, event, transition) {
        let viewPaths = this.viewPaths;
        if (_.isString(viewPaths)) {
            viewPaths = [viewPaths];
        }
        await bluebird.mapSeries(viewPaths, async (view) => {
            const statement = await event.renderer.renderPath(view, event);
            reply.addStatement(sampleOrItem(statement, event.platform));
        });
    }
}
Say.key = "say";
Say.platform = "core";
exports.Say = Say;
class SayP {
    constructor(statement) {
        this.statement = statement;
    }
    async writeToReply(reply, event, transition) {
        reply.addStatement(this.statement);
    }
}
SayP.key = "sayp";
SayP.platform = "core";
exports.SayP = SayP;
class Tell {
    constructor(viewPath) {
        this.viewPath = viewPath;
    }
    async writeToReply(reply, event, transition) {
        const statement = await event.renderer.renderPath(this.viewPath, event);
        reply.addStatement(sampleOrItem(statement, event.platform));
        reply.terminate();
        transition.flow = "terminate";
        transition.say = this.viewPath;
    }
}
Tell.key = "tell";
Tell.platform = "core";
exports.Tell = Tell;
class Text {
    constructor(viewPaths) {
        this.viewPaths = viewPaths;
    }
    async writeToReply(reply, event, transition) {
        let viewPaths = this.viewPaths;
        if (_.isString(viewPaths)) {
            viewPaths = [viewPaths];
        }
        await bluebird.mapSeries(viewPaths, async (view) => {
            const statement = await event.renderer.renderPath(view, event);
            reply.addStatement(sampleOrItem(statement, event.platform), true);
        });
    }
}
Text.key = "text";
Text.platform = "core";
exports.Text = Text;
class TextP {
    constructor(text) {
        this.text = text;
    }
    async writeToReply(reply, event, transition) {
        reply.addStatement(this.text, true);
    }
}
TextP.key = "textp";
TextP.platform = "core";
exports.TextP = TextP;
//# sourceMappingURL=directives.js.map