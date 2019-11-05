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
const ApiBase_1 = require("./ApiBase");
/**
 * Reminders API class reference
 * https://developer.amazon.com/docs/smapi/alexa-reminders-api-reference.html
 */
class Reminders extends ApiBase_1.ApiBase {
    /**
     * Gets a reminder
     * https://developer.amazon.com/docs/smapi/alexa-reminders-api-reference.html#get-a-reminder
     */
    getReminder(alertToken) {
        return this.getResult(`v1/alerts/reminders/${alertToken}`);
    }
    /**
     * Gets all reminders
     * https://developer.amazon.com/docs/smapi/alexa-reminders-api-reference.html#get-all-reminders
     */
    getAllReminders() {
        return this.getResult("v1/alerts/reminders");
    }
    /**
     * Creates a reminder
     * https://developer.amazon.com/docs/smapi/alexa-reminders-api-reference.html#create-a-reminder
     */
    createReminder(reminder) {
        return this.getResult("v1/alerts/reminders", "POST", reminder.build());
    }
    /**
     * Updates a reminder
     * https://developer.amazon.com/docs/smapi/alexa-reminders-api-reference.html#update-a-reminder
     */
    updateReminder(alertToken, reminder) {
        return this.getResult(`v1/alerts/reminders/${alertToken}`, "PUT", reminder.build());
    }
    /**
     * Deletes a reminder
     * https://developer.amazon.com/docs/smapi/alexa-reminders-api-reference.html#delete-a-reminder
     */
    deleteReminder(alertToken) {
        return this.getResult(`v1/alerts/reminders/${alertToken}`, "DELETE");
    }
}
exports.Reminders = Reminders;
/**
 * Reminder Builder class reference
 */
class ReminderBuilder {
    constructor() {
        this.triggerType = "";
        this.timeZoneId = "";
        this.recurrenceFreq = "";
        this.content = [];
        this.pushNotificationStatus = "DISABLED";
    }
    setCreatedTime(createdTime) {
        this.createdTime = createdTime;
        return this;
    }
    setRequestTime(requestTime) {
        this.requestTime = requestTime;
        return this;
    }
    setTriggerAbsolute(scheduledTime) {
        this.offsetInSeconds = undefined;
        this.scheduledTime = scheduledTime;
        this.triggerType = "SCHEDULED_ABSOLUTE";
        return this;
    }
    setTriggerRelative(offsetInSeconds) {
        this.offsetInSeconds = offsetInSeconds;
        this.scheduledTime = undefined;
        this.triggerType = "SCHEDULED_RELATIVE";
        return this;
    }
    setTimeZoneId(timeZoneId) {
        this.timeZoneId = timeZoneId;
        return this;
    }
    setRecurrenceFreqDaily() {
        this.recurrenceFreq = "DAILY";
        return this;
    }
    setRecurrenceFreqWeekly() {
        this.recurrenceFreq = "WEEKLY";
        return this;
    }
    setRecurrenceByDay(recurrenceByDay) {
        this.recurrenceByDay = recurrenceByDay;
        return this;
    }
    setRecurrenceInterval(interval) {
        this.interval = interval;
        return this;
    }
    addContent(locale, text) {
        this.content = this.content || [];
        this.content.push({ locale, text });
        return this;
    }
    enablePushNotification() {
        this.pushNotificationStatus = "ENABLED";
        return this;
    }
    disablePushNotification() {
        this.pushNotificationStatus = "DISABLED";
        return this;
    }
    build() {
        return {
            alertInfo: {
                spokenInfo: { content: this.content },
            },
            createdTime: this.createdTime,
            pushNotification: {
                status: this.pushNotificationStatus,
            },
            requestTime: this.requestTime,
            trigger: {
                offsetInSeconds: this.offsetInSeconds,
                recurrence: {
                    byDay: this.recurrenceByDay,
                    freq: this.recurrenceFreq,
                    interval: this.interval,
                },
                scheduledTime: this.scheduledTime,
                timeZoneId: this.timeZoneId,
                type: this.triggerType,
            },
        };
    }
}
exports.ReminderBuilder = ReminderBuilder;
//# sourceMappingURL=Reminders.js.map