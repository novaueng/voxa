import { IBag, IVoxaEvent } from "./VoxaEvent";
export interface IVoxaReply {
    hasMessages: boolean;
    hasDirectives: boolean;
    hasTerminated: boolean;
    /**
     * empty the reply
     */
    clear: () => void;
    /**
     * end the conversation
     */
    terminate: () => void;
    /**
     * will return the ssml
     */
    speech: string;
    reprompt?: string;
    /**
     * should return plain text for platforms that support it,
     * for example microsoft bot framework chat, dialog flow
     */
    plain?: string;
    /**
     * adds an SSML or plain statement
     */
    addStatement: (statement: string, isPlain?: boolean) => void;
    /**
     * adds an SSML or plain statement
     */
    addReprompt: (statement: string) => void;
    hasDirective: (type: string | RegExp) => boolean;
    /**
     *  saveSession should store the attributes object into a storage that is scoped to the session.
     *  Attributes stored to the session should be made available in the platform's subsequent event
     *  under `event.session.attributes`. In this way, devs can use the session carry data forward
     *  through the conversation.
     */
    saveSession: (attributes: IBag, event: IVoxaEvent) => Promise<void>;
}
export declare function addToSSML(ssml: string | undefined, statement: string): string;
export declare function addToText(text: string | undefined, statement: string): string;
