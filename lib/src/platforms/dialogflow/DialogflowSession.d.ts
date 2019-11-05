import { Contexts, DialogflowConversation } from "actions-on-google";
import { IBag, IVoxaSession } from "../../VoxaEvent";
export declare class DialogflowSession implements IVoxaSession {
    attributes: IBag;
    outputAttributes: IBag;
    new: boolean;
    sessionId: string;
    contexts: Contexts;
    constructor(conv: DialogflowConversation);
    private getAttributes;
}
