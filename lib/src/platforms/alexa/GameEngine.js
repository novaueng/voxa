"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
/*
 * The Game Engine interface enables your skill to receive input from Echo Buttons
 */
class GameEngine {
    static getEventsBuilder(name) {
        return new EventsBuilder(name);
    }
    static getDeviationRecognizerBuilder(name) {
        return new DeviationRecognizerBuilder(name);
    }
    static getPatternRecognizerBuilder(name) {
        return new PatternRecognizerBuilder(name);
    }
    static getProgressRecognizerBuilder(name) {
        return new ProgressRecognizerBuilder(name);
    }
    /*
     * Stops Echo Button events from being sent to your skill.
     * https://developer.amazon.com/docs/gadget-skills/gameengine-interface-reference.html#stop
     */
    static stopInputHandler(originatingRequestId) {
        return {
            originatingRequestId,
            type: "GameEngine.StopInputHandler",
        };
    }
    setEvents(...eventArray) {
        this.events = this.events || {};
        this.mergeParameterArray(eventArray, this.events, EventsBuilder);
        return this;
    }
    setRecognizers(...recognizerArray) {
        this.recognizers = this.recognizers || {};
        this.mergeParameterArray(recognizerArray, this.recognizers, RecognizerBuilder);
        return this;
    }
    /*
     * Configures and starts the Input Handler to send Echo Button events to your skill.
     * https://developer.amazon.com/docs/gadget-skills/gameengine-interface-reference.html#start
     */
    startInputHandler(timeout, proxies) {
        return {
            events: this.events,
            proxies,
            recognizers: this.recognizers,
            timeout,
            type: "GameEngine.StartInputHandler",
        };
    }
    mergeParameterArray(parameterArray, parameter, type) {
        _.forEach(parameterArray, (param) => {
            if (param instanceof type) {
                parameter = _.merge(parameter, param.build());
            }
            else {
                parameter = _.merge(parameter, param);
            }
        });
    }
}
exports.GameEngine = GameEngine;
/*
 * The recognizers object contains one or more objects that represent different
 * types of recognizers: the patternRecognizer, deviationRecognizer, or progressRecognizer
 */
class RecognizerBuilder {
    constructor(recognizerName, type) {
        this.recognizers = {};
        this.recognizerName = recognizerName;
        this.recognizers[recognizerName] = { type };
    }
    setProperty(property) {
        this.recognizers[this.recognizerName] = _.merge(this.recognizers[this.recognizerName], property);
    }
    build() {
        return this.recognizers;
    }
}
exports.RecognizerBuilder = RecognizerBuilder;
class DeviationRecognizerBuilder extends RecognizerBuilder {
    constructor(name) {
        super(name, "deviation");
    }
    recognizer(recognizer) {
        this.setProperty({ recognizer });
        return this;
    }
}
exports.DeviationRecognizerBuilder = DeviationRecognizerBuilder;
class PatternRecognizerBuilder extends RecognizerBuilder {
    constructor(name) {
        super(name, "match");
    }
    /*
     * For more information about the event report values, follow this link:
     * https://developer.amazon.com/docs/gadget-skills/gameengine-interface-reference.html#patternrecognizer
     */
    anchor(anchor) {
        this.setProperty({ anchor });
        return this;
    }
    fuzzy(fuzzy) {
        this.setProperty({ fuzzy });
        return this;
    }
    gadgetIds(gadgetIds) {
        this.setProperty({ gadgetIds });
        return this;
    }
    actions(actions) {
        this.setProperty({ actions });
        return this;
    }
    pattern(pattern) {
        this.setProperty({ pattern });
        return this;
    }
}
exports.PatternRecognizerBuilder = PatternRecognizerBuilder;
class ProgressRecognizerBuilder extends RecognizerBuilder {
    constructor(name) {
        super(name, "progress");
    }
    recognizer(recognizer) {
        this.setProperty({ recognizer });
        return this;
    }
    completion(completion) {
        this.setProperty({ completion });
        return this;
    }
}
exports.ProgressRecognizerBuilder = ProgressRecognizerBuilder;
/*
 * The events object is where you define the conditions that must be met for
 * your skill to be notified of Echo Button input.
 */
class EventsBuilder {
    constructor(eventName) {
        this.events = {};
        this.eventName = eventName;
    }
    setProperty(property) {
        this.events[this.eventName] = _.merge(this.events[this.eventName], property);
        return this;
    }
    meets(meets) {
        this.setProperty({ meets });
        return this;
    }
    fails(fails) {
        this.setProperty({ fails });
        return this;
    }
    /*
     * For more information about the event report values, follow this link:
     * https://developer.amazon.com/docs/gadget-skills/gameengine-interface-reference.html#events
     */
    reports(reports) {
        this.setProperty({ reports });
        return this;
    }
    shouldEndInputHandler(shouldEndInputHandler) {
        this.setProperty({ shouldEndInputHandler });
        return this;
    }
    maximumInvocations(maximumInvocations) {
        this.setProperty({ maximumInvocations });
        return this;
    }
    triggerTimeMilliseconds(triggerTimeMilliseconds) {
        this.setProperty({ triggerTimeMilliseconds });
        return this;
    }
    build() {
        return this.events;
    }
}
exports.EventsBuilder = EventsBuilder;
/*
 * For more information about the event report values, follow this link:
 * https://developer.amazon.com/docs/gadget-skills/gameengine-interface-reference.html#events
 */
exports.EVENT_REPORT_ENUM = {
    HISTORY: "history",
    MATCHES: "matches",
    NOTHING: "nothing",
};
/*
 * For more information about the event report values, follow this link:
 * https://developer.amazon.com/docs/gadget-skills/gameengine-interface-reference.html#patternrecognizer
 */
exports.ANCHOR_ENUM = {
    ANYWHERE: "anywhere",
    END: "end",
    START: "start",
};
//# sourceMappingURL=GameEngine.js.map