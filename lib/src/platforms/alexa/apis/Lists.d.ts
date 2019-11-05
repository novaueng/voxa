import { services } from "ask-sdk-model";
import { ApiBase } from "./ApiBase";
export declare class Lists extends ApiBase {
    /**
     * Gets information from the default Shopping List
     * https://developer.amazon.com/docs/custom-skills/list-faq.html
     */
    getDefaultShoppingList(): Promise<services.listManagement.AlexaListMetadata>;
    /**
     * Gets information from the default To-Do List
     * https://developer.amazon.com/docs/custom-skills/list-faq.html
     */
    getDefaultToDoList(): Promise<services.listManagement.AlexaListMetadata>;
    /**
     * Gets metadata from all lists in user"s account
     * https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html#getListsMetadata
     */
    getListMetadata(): Promise<services.listManagement.AlexaListsMetadata>;
    /**
     * Gets list"s information. Items are included
     * https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html#getList
     * @param status list status, defaults to active (only value accepted for now)
     */
    getListById(listId: string, status?: string): Promise<services.listManagement.AlexaList>;
    /**
     * Looks for a list by name, if not found, it creates it, and returns it
     */
    getOrCreateList(name: string): Promise<services.listManagement.AlexaList | services.listManagement.AlexaListMetadata>;
    /**
     * Creates an empty list. The state default value is active
     * https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html#createList
     */
    createList(name: string, state?: string): Promise<services.listManagement.AlexaListMetadata>;
    /**
     * Updates list"s values like: name, state and version
     * https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html#updateList
     */
    updateList(listId: string, name: string, state?: string, version?: number): Promise<services.listManagement.AlexaListMetadata>;
    /**
     * Updates list"s values like: name, state and version
     * https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html#deletelist
     */
    deleteList(listId: string): Promise<any>;
    /**
     * Gets information from a list"s item
     * https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html#getListItem
     */
    getListItem(listId: string, itemId: string): Promise<services.listManagement.AlexaListItem>;
    /**
     * Creates an item in a list
     * https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html#createListItem
     */
    createItem(listId: string, value: string, status?: string): Promise<services.listManagement.AlexaListItem>;
    /**
     * Updates information from an item in a list: value, status and version
     * https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html#updateListItem
     */
    updateItem(listId: string, itemId: string, value: string, status?: string, version?: number): Promise<services.listManagement.AlexaListItem>;
    /**
     * Deletes an item from a list
     * https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html#deleteListItem
     */
    deleteItem(listId: string, itemId: string): Promise<any>;
    protected getToken(): any;
    protected getEndpoint(): string;
    /**
     * Gets information from the default lists
     * https://developer.amazon.com/docs/custom-skills/list-faq.html
     */
    private getDefaultList;
}
