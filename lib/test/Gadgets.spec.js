"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _ = require("lodash");
const src_1 = require("../src");
const tools_1 = require("./tools");
const variables_1 = require("./variables");
const views_1 = require("./views");
const COLORS = [
    {
        dark: "FFFFFF",
        hex: "F44336",
        name: "red",
    },
    {
        dark: "FFFFFF",
        hex: "F44336",
        name: "blue",
    },
    {
        dark: "FFFFFF",
        hex: "F44336",
        name: "green",
    },
    {
        dark: "FFFFFF",
        hex: "F44336",
        name: "yellow",
    },
];
const actionDown = "down";
const proxies = _.map(COLORS, "name");
const rollCallPattern = _.map(proxies, (color) => ({ gadgetIds: [color], action: actionDown }));
const rb = new tools_1.AlexaRequestBuilder();
describe("Gadgets", () => {
    let event;
    let app;
    let alexaSkill;
    beforeEach(() => {
        app = new src_1.VoxaApp({ views: views_1.views, variables: variables_1.variables });
        alexaSkill = new src_1.AlexaPlatform(app);
    });
    it("should send GameEngine.StartInputHandler directive", async () => {
        event = rb.getLaunchRequest();
        app.onIntent("LaunchIntent", () => {
            const alexaGameEngineStartInputHandler = rollCall();
            return {
                alexaGameEngineStartInputHandler,
                tell: "Buttons.Discover",
            };
        });
        const reply = await alexaSkill.execute(event);
        const responseDirectives = _.get(reply, "response.directives");
        chai_1.expect(_.get(reply, "response.outputSpeech.ssml")).to.include("Press 2 or up to 4 buttons to wake them up.");
        chai_1.expect(reply.response.reprompt).to.be.undefined;
        chai_1.expect(responseDirectives[0].events.sample_event).to.be.ok;
        chai_1.expect(responseDirectives[0].events.timeout).to.be.ok;
        chai_1.expect(responseDirectives[0].recognizers.sample_event).to.be.ok;
        chai_1.expect(responseDirectives[0].proxies).to.deep.equal(proxies);
        chai_1.expect(responseDirectives[0].timeout).to.equal(15000);
        chai_1.expect(responseDirectives[0].type).to.equal("GameEngine.StartInputHandler");
        chai_1.expect(_.get(reply, "sessionAttributes.state")).to.equal("die");
        chai_1.expect(reply.response.shouldEndSession).to.be.undefined;
    });
    it("should recognize 2 buttons, send a SetLight directive and ask to recognize buttons again", async () => {
        event = rb.getGameEngineInputHandlerEventRequest(2);
        app.onIntent("GameEngine.InputHandlerEvent", (voxaEvent) => {
            voxaEvent.model.originatingRequestId =
                voxaEvent.rawEvent.request.originatingRequestId;
            const gameEvents = voxaEvent.rawEvent.request.events[0] || [];
            const inputEvents = _(gameEvents.inputEvents)
                .groupBy("gadgetId")
                .map((value) => value[0])
                .value();
            const directives = [];
            let customId = 0;
            _.forEach(inputEvents, (gadgetEvent) => {
                customId += 1;
                const id = `g${customId}`;
                if (!_.includes(voxaEvent.model.buttons, id)) {
                    const buttonIndex = _.size(voxaEvent.model.buttons);
                    const targetGadgets = [gadgetEvent.gadgetId];
                    let lightDirective;
                    _.set(voxaEvent.model, `buttonIds.${id}`, gadgetEvent.gadgetId);
                    voxaEvent.model.buttons = [];
                    voxaEvent.model.buttons.push(id);
                    const triggerEventTimeMs = 0;
                    const gadgetController = new src_1.GadgetController();
                    const animationBuilder = src_1.GadgetController.getAnimationsBuilder();
                    const sequenceBuilder = src_1.GadgetController.getSequenceBuilder();
                    sequenceBuilder
                        .duration(1000)
                        .blend(false)
                        .color(COLORS[buttonIndex].dark);
                    animationBuilder
                        .repeat(100)
                        .targetLights(["1"])
                        .sequence([sequenceBuilder]);
                    lightDirective = gadgetController
                        .setAnimations(animationBuilder)
                        .setTriggerEvent(src_1.TRIGGER_EVENT_ENUM.NONE)
                        .setLight(targetGadgets, triggerEventTimeMs);
                    directives.push(lightDirective);
                    const otherAnimationBuilder = src_1.GadgetController.getAnimationsBuilder();
                    const otherSequenceBuilder = src_1.GadgetController.getSequenceBuilder();
                    otherSequenceBuilder
                        .duration(500)
                        .blend(false)
                        .color(COLORS[buttonIndex].hex);
                    otherAnimationBuilder
                        .repeat(1)
                        .targetLights(["1"])
                        .sequence([otherSequenceBuilder.build()]);
                    lightDirective = gadgetController
                        .setAnimations(otherAnimationBuilder.build())
                        .setTriggerEvent(src_1.TRIGGER_EVENT_ENUM.BUTTON_DOWN)
                        .setLight(targetGadgets, triggerEventTimeMs);
                    directives.push(lightDirective);
                }
            });
            const alexaGameEngineStartInputHandler = rollCall(true);
            return {
                alexaGadgetControllerLightDirective: directives,
                alexaGameEngineStartInputHandler,
                tell: "Buttons.Next",
            };
        });
        const reply = await alexaSkill.execute(event);
        const responseDirectives = _.get(reply, "response.directives");
        chai_1.expect(_.get(reply, "response.outputSpeech.ssml")).to.include("Guess the next pattern.");
        chai_1.expect(reply.response.reprompt).to.be.undefined;
        chai_1.expect(responseDirectives).to.have.lengthOf(5);
        _.forEach(_.initial(responseDirectives), (item) => {
            chai_1.expect(_.get(item, "type")).to.equal("GadgetController.SetLight");
            chai_1.expect(_.get(item, "version")).to.equal(1);
            chai_1.expect(_.get(item, "parameters.triggerEventTimeMs")).to.equal(0);
            chai_1.expect(_.get(item, "parameters.animations")).to.have.lengthOf(2);
        });
        chai_1.expect(responseDirectives[4].events.sample_event).to.be.ok;
        chai_1.expect(responseDirectives[4].events.timeout).to.be.ok;
        chai_1.expect(responseDirectives[4].recognizers.deviation.type).to.equal("deviation");
        chai_1.expect(responseDirectives[4].recognizers.deviation.recognizer).to.equal("sample_event");
        chai_1.expect(responseDirectives[4].recognizers.progress.type).to.equal("progress");
        chai_1.expect(responseDirectives[4].recognizers.progress.recognizer).to.equal("sample_event");
        chai_1.expect(responseDirectives[4].recognizers.progress.completion).to.equal(500);
        chai_1.expect(responseDirectives[4].recognizers.sample_event).to.be.ok;
        chai_1.expect(responseDirectives[4].proxies).to.deep.equal(proxies);
        chai_1.expect(responseDirectives[4].timeout).to.equal(15000);
        chai_1.expect(responseDirectives[4].type).to.equal("GameEngine.StartInputHandler");
        chai_1.expect(_.get(reply, "sessionAttributes.state")).to.equal("die");
        chai_1.expect(reply.response.shouldEndSession).to.be.undefined;
    });
    it("should send GameEngine.StopInputHandler directive", async () => {
        event = rb.getIntentRequest("ExitIntent");
        event.session.attributes.originatingRequestId = "originatingRequestId";
        app.onIntent("ExitIntent", (voxaEvent) => {
            const { originatingRequestId } = voxaEvent.model;
            return {
                alexaGameEngineStopInputHandler: originatingRequestId,
                tell: "Buttons.Bye",
            };
        });
        const reply = await alexaSkill.execute(event);
        chai_1.expect(_.get(reply, "response.outputSpeech.ssml")).to.include("Thanks for playing with echo buttons.");
        chai_1.expect(reply.response.reprompt).to.be.undefined;
        chai_1.expect(_.get(reply, "response.directives[0].type")).to.equal("GameEngine.StopInputHandler");
        chai_1.expect(_.get(reply, "sessionAttributes.state")).to.equal("die");
        chai_1.expect(reply.response.shouldEndSession).to.equal(true);
    });
});
function rollCall(shouldAddOtherBuilders) {
    const gameEngineTimeout = 15000;
    const gameEngine = new src_1.GameEngine();
    const eventBuilder = src_1.GameEngine.getEventsBuilder("sample_event");
    const timeoutEventBuilder = src_1.GameEngine.getEventsBuilder("timeout");
    const recognizerBuilder = src_1.GameEngine.getPatternRecognizerBuilder("sample_event");
    eventBuilder
        .fails(["fails"])
        .meets(["sample_event"])
        .maximumInvocations(1)
        .reports(src_1.EVENT_REPORT_ENUM.MATCHES)
        .shouldEndInputHandler(true)
        .triggerTimeMilliseconds(1000);
    timeoutEventBuilder
        .meets(["timed out"])
        .reports(src_1.EVENT_REPORT_ENUM.HISTORY)
        .shouldEndInputHandler(true);
    recognizerBuilder
        .actions("actions")
        .fuzzy(true)
        .gadgetIds(["gadgetIds"])
        .anchor(src_1.ANCHOR_ENUM.ANYWHERE)
        .pattern(rollCallPattern);
    if (shouldAddOtherBuilders) {
        const deviationBuilder = src_1.GameEngine.getDeviationRecognizerBuilder("deviation");
        const progressBuilder = src_1.GameEngine.getProgressRecognizerBuilder("progress");
        deviationBuilder.recognizer("sample_event");
        progressBuilder.completion(500).recognizer("sample_event");
        gameEngine.setRecognizers(deviationBuilder, progressBuilder);
    }
    return gameEngine
        .setEvents(eventBuilder, timeoutEventBuilder.build())
        .setRecognizers(recognizerBuilder.build())
        .startInputHandler(gameEngineTimeout, proxies);
}
//# sourceMappingURL=Gadgets.spec.js.map