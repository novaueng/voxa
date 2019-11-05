"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function register(skill) {
    skill.onRequestStarted((voxaEvent) => {
        const fromState = voxaEvent.session.new
            ? "entry"
            : voxaEvent.session.attributes.state || "entry";
        voxaEvent.session.outputAttributes.flow = [fromState];
    });
    skill.onAfterStateChanged((voxaEvent, reply, transition) => {
        voxaEvent.session.outputAttributes.flow =
            voxaEvent.session.outputAttributes.flow || [];
        voxaEvent.session.outputAttributes.flow.push(transition.to);
        return transition;
    });
}
exports.register = register;
//# sourceMappingURL=state-flow.js.map