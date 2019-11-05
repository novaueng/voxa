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
const _ = require("lodash");
const ApiBase_1 = require("./ApiBase");
class Lists extends ApiBase_1.ApiBase {
    /**
     * Gets information from the default Shopping List
     * https://developer.amazon.com/docs/custom-skills/list-faq.html
     */
    getDefaultShoppingList() {
        return this.getDefaultList("SHOPPING_ITEM");
    }
    /**
     * Gets information from the default To-Do List
     * https://developer.amazon.com/docs/custom-skills/list-faq.html
     */
    getDefaultToDoList() {
        return this.getDefaultList("TASK");
    }
    /**
     * Gets metadata from all lists in user"s account
     * https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html#getListsMetadata
     */
    getListMetadata() {
        return this.getResult();
    }
    /**
     * Gets list"s information. Items are included
     * https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html#getList
     * @param status list status, defaults to active (only value accepted for now)
     */
    getListById(listId, status = "active") {
        return this.getResult(`${listId}/${status}`);
    }
    /**
     * Looks for a list by name, if not found, it creates it, and returns it
     */
    async getOrCreateList(name) {
        const listsMetadata = await this.getListMetadata();
        const listMeta = _.find(listsMetadata.lists, { name });
        if (listMeta) {
            listMeta.listId = listMeta.listId || "";
            return this.getListById(listMeta.listId);
        }
        return this.createList(name);
    }
    /**
     * Creates an empty list. The state default value is active
     * https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html#createList
     */
    createList(name, state = "active") {
        return this.getResult("", "POST", { name, state });
    }
    /**
     * Updates list"s values like: name, state and version
     * https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html#updateList
     */
    updateList(listId, name, state, version) {
        if (typeof name === "object") {
            return this.getResult(`${listId}`, "PUT", name);
        }
        state = state || "active";
        return this.getResult(`${listId}`, "PUT", { name, state, version });
    }
    /**
     * Updates list"s values like: name, state and version
     * https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html#deletelist
     */
    deleteList(listId) {
        return this.getResult(`${listId}`, "DELETE");
    }
    /**
     * Gets information from a list"s item
     * https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html#getListItem
     */
    getListItem(listId, itemId) {
        return this.getResult(`${listId}/items/${itemId}`);
    }
    /**
     * Creates an item in a list
     * https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html#createListItem
     */
    createItem(listId, value, status = "active") {
        return this.getResult(`${listId}/items`, "POST", { value, status });
    }
    /**
     * Updates information from an item in a list: value, status and version
     * https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html#updateListItem
     */
    updateItem(listId, itemId, value, status, version) {
        if (typeof value === "object") {
            return this.getResult(`${listId}/items/${itemId}`, "PUT", value);
        }
        return this.getResult(`${listId}/items/${itemId}`, "PUT", {
            status,
            value,
            version,
        });
    }
    /**
     * Deletes an item from a list
     * https://developer.amazon.com/docs/custom-skills/access-the-alexa-shopping-and-to-do-lists.html#deleteListItem
     */
    deleteItem(listId, itemId) {
        return this.getResult(`${listId}/items/${itemId}`, "DELETE");
    }
    getToken() {
        return _.get(this.rawEvent, "context.System.user.permissions.consentToken");
    }
    // eslint-disable-next-line class-methods-use-this
    getEndpoint() {
        return "https://api.amazonalexa.com/v2/householdlists";
    }
    /**
     * Gets information from the default lists
     * https://developer.amazon.com/docs/custom-skills/list-faq.html
     */
    async getDefaultList(listSuffix) {
        const metadata = await this.getResult();
        const defaultList = _.find(metadata.lists, (currentList) => {
            // According to the alexa lists FAQ available in
            // https://developer.amazon.com/docs/custom-skills/list-faq.html
            // this is the standard way to get the user"s default Shopping List
            const buf = Buffer.from(currentList.listId, "base64");
            return _.endsWith(buf.toString(), listSuffix);
        });
        return defaultList;
    }
}
exports.Lists = Lists;
//# sourceMappingURL=Lists.js.map