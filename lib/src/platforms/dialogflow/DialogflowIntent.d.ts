import { DialogflowConversation } from "actions-on-google";
import { IVoxaIntent } from "../../VoxaEvent";
export declare class DialogflowIntent implements IVoxaIntent {
    name: string;
    params: any;
    rawIntent: DialogflowConversation;
    constructor(conv: DialogflowConversation);
    private getParams;
}
