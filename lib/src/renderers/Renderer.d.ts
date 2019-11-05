import * as i18n from "i18next";
import { IVoxaEvent } from "../VoxaEvent";
export declare const tokenRegx: RegExp;
export interface IRendererConfig {
    variables?: any;
    views: i18n.Resource;
}
export interface IMessage {
    [name: string]: any;
    ask?: string;
    tell?: string;
    say?: string;
    reprompt?: string;
    card?: any;
    directives?: any[];
}
export declare type IRenderer = new (config: IRendererConfig) => Renderer;
export declare class Renderer {
    config: any;
    constructor(config: IRendererConfig);
    renderPath(view: string, voxaEvent: IVoxaEvent, variables?: any): Promise<any>;
    /**
     * it makes a deep search for strings that could have a variable on it
     * @param  any statement - can be a string, array, object or any other value
     * @param VoxaEvent voxaEvent
     * @return Promise             Promise with the statement rendered
     * @example
     * // return { Launch: 'Hi, morning', card: { type: 'Standard', title: 'title' ...}}
     * deepSearchRenderVariable({ Launch: 'hi, {time}', card: '{exitCard}' }, voxaEvent);
     */
    renderMessage(statement: any, voxaEvent: IVoxaEvent): Promise<any>;
    private renderStatement;
    private renderObjectStatement;
    private renderArrayStatement;
    /**
     * Takes a string statement and gets the value for all variables
     */
    private executeVariables;
}
