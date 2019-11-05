"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isLocalizedRequest(request) {
    return (request.type && (request.type.includes("AudioPlayer.") ||
        request.type.includes("PlaybackController.") ||
        request.type.includes("Connections.") ||
        request.type.includes("GameEngine.") ||
        request.type.includes("System.") ||
        request.type === "Display.ElementSelected" ||
        request.type === "SessionEndedRequest" ||
        request.type === "IntentRequest" ||
        request.type === "LaunchRequest"));
}
exports.isLocalizedRequest = isLocalizedRequest;
//# sourceMappingURL=utils.js.map