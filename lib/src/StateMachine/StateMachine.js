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
const errors_1 = require("../errors");
const State_1 = require("./State");
const transitions_1 = require("./transitions");
class StateMachine {
    constructor(config) {
        this.states = _.cloneDeep(config.states);
        this.onBeforeStateChangedCallbacks = config.onBeforeStateChanged || [];
        this.onAfterStateChangeCallbacks = config.onAfterStateChanged || [];
        this.onUnhandledStateCallback = config.onUnhandledState;
        this.states.push(new State_1.State("die", { flow: "terminate" }));
    }
    async runTransition(fromState, voxaEvent, reply, recursions = 0) {
        if (recursions > 10) {
            throw new Error("State Machine Recursion Error");
        }
        const transition = await this.stateTransition(fromState, voxaEvent, reply, recursions);
        let sysTransition = await this.checkOnUnhandledState(voxaEvent, reply, transition);
        sysTransition = await this.onAfterStateChanged(voxaEvent, reply, sysTransition);
        if (sysTransition.shouldTerminate) {
            reply.terminate();
        }
        if (sysTransition.shouldContinue) {
            return this.runTransition(sysTransition.to, voxaEvent, reply, recursions + 1);
        }
        return sysTransition;
    }
    async stateTransition(fromState, voxaEvent, reply, recursions) {
        try {
            if (fromState === "entry") {
                this.currentState = this.getCurrentState(voxaEvent.intent.name, voxaEvent.intent.name, voxaEvent.platform.name);
            }
            else {
                this.currentState = this.getCurrentState(fromState, voxaEvent.intent.name, voxaEvent.platform.name);
            }
        }
        catch (error) {
            /*
             * Returning to the global handler here only makes sense if we didn't already made that,
             * meaning that it could only be done in the first recursion. There's tests covering this scenario
             * in tests/States.spec.ts
             */
            if (fromState !== "entry" && recursions < 1) {
                return this.stateTransition("entry", voxaEvent, reply, recursions);
            }
            if (error instanceof errors_1.UnknownState) {
                if (!this.onUnhandledStateCallback) {
                    throw new Error(`${voxaEvent.intent.name} went unhandled`);
                }
                return this.onUnhandledStateCallback(voxaEvent, voxaEvent.intent.name);
            }
            throw error;
        }
        await this.runOnBeforeStateChanged(voxaEvent, reply);
        let transition = await this.currentState.handle(voxaEvent);
        voxaEvent.log.debug(`${this.currentState.name} transition resulted in`, {
            transition,
        });
        try {
            if (!transition && fromState !== "entry") {
                this.currentState = this.getCurrentState(voxaEvent.intent.name, voxaEvent.intent.name, voxaEvent.platform.name);
                transition = await this.currentState.handle(voxaEvent);
            }
        }
        catch (error) {
            if (error instanceof errors_1.UnknownState) {
                return transition;
            }
            throw error;
        }
        return transition;
    }
    async onAfterStateChanged(voxaEvent, reply, transition) {
        voxaEvent.log.debug("Running onAfterStateChangeCallbacks");
        await bluebird.mapSeries(this.onAfterStateChangeCallbacks, (fn) => {
            return fn(voxaEvent, reply, transition);
        });
        voxaEvent.log.debug("Transition is now", { transition });
        return transition;
    }
    async checkOnUnhandledState(voxaEvent, reply, transition) {
        if (!_.isEmpty(transition) || transition) {
            return new transitions_1.SystemTransition(transition);
        }
        if (!this.onUnhandledStateCallback) {
            throw new Error(`${voxaEvent.intent.name} went unhandled`);
        }
        const tr = await this.onUnhandledStateCallback(voxaEvent, this.currentState.name);
        return new transitions_1.SystemTransition(tr);
    }
    async runOnBeforeStateChanged(voxaEvent, reply) {
        const onBeforeState = this.onBeforeStateChangedCallbacks;
        voxaEvent.log.debug("Running onBeforeStateChanged");
        await bluebird.mapSeries(onBeforeState, (fn) => {
            return fn(voxaEvent, reply, this.currentState);
        });
    }
    getCurrentState(currentStateName, intentName, platform) {
        const states = _(this.states)
            .filter({ name: currentStateName })
            .filter((s) => {
            return s.platform === platform || s.platform === "core";
        })
            // Sometimes a user might have defined more than one controller for the same state,
            // in that case we want to get the one for the current intent
            .filter((s) => {
            return s.intents.length === 0 || _.includes(s.intents, intentName);
        })
            .value();
        if (states.length === 0) {
            throw new errors_1.UnknownState(currentStateName);
        }
        if (states.length === 1) {
            return states[0];
        }
        // If the code reaches this point, that means the `states` array may contain
        // one state without an intents array filter and/or
        // one or more controllers with an intents array that contains the intent name.
        // The controller with an intents array is given more priority than the one with no intents array,
        // so the first controller that contains the intent name in its intents array is returned.
        return (states.find((s) => s.intents.length && s.intents.includes(intentName)) || states[0] // If no state with name is found, the first state is returned by default as an State object is always needed
        );
    }
}
exports.StateMachine = StateMachine;
//# sourceMappingURL=StateMachine.js.map