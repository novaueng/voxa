import { ApiBase } from "./ApiBase";
/**
 * Reminders API class reference
 * https://developer.amazon.com/docs/smapi/alexa-reminders-api-reference.html
 */
export declare class Reminders extends ApiBase {
    /**
     * Gets a reminder
     * https://developer.amazon.com/docs/smapi/alexa-reminders-api-reference.html#get-a-reminder
     */
    getReminder(alertToken: string): Promise<any>;
    /**
     * Gets all reminders
     * https://developer.amazon.com/docs/smapi/alexa-reminders-api-reference.html#get-all-reminders
     */
    getAllReminders(): Promise<any>;
    /**
     * Creates a reminder
     * https://developer.amazon.com/docs/smapi/alexa-reminders-api-reference.html#create-a-reminder
     */
    createReminder(reminder: ReminderBuilder): Promise<any>;
    /**
     * Updates a reminder
     * https://developer.amazon.com/docs/smapi/alexa-reminders-api-reference.html#update-a-reminder
     */
    updateReminder(alertToken: string, reminder: ReminderBuilder): Promise<any>;
    /**
     * Deletes a reminder
     * https://developer.amazon.com/docs/smapi/alexa-reminders-api-reference.html#delete-a-reminder
     */
    deleteReminder(alertToken: string): Promise<string>;
}
/**
 * Reminder Builder class reference
 */
export declare class ReminderBuilder {
    private createdTime?;
    private requestTime?;
    private triggerType;
    private offsetInSeconds?;
    private scheduledTime?;
    private timeZoneId;
    private recurrenceFreq;
    private recurrenceByDay?;
    private interval?;
    private content;
    private pushNotificationStatus;
    setCreatedTime(createdTime: string): ReminderBuilder;
    setRequestTime(requestTime: string): ReminderBuilder;
    setTriggerAbsolute(scheduledTime: string): ReminderBuilder;
    setTriggerRelative(offsetInSeconds: number): ReminderBuilder;
    setTimeZoneId(timeZoneId: string): ReminderBuilder;
    setRecurrenceFreqDaily(): ReminderBuilder;
    setRecurrenceFreqWeekly(): ReminderBuilder;
    setRecurrenceByDay(recurrenceByDay: string[]): ReminderBuilder;
    setRecurrenceInterval(interval: number): ReminderBuilder;
    addContent(locale: string, text: string): ReminderBuilder;
    enablePushNotification(): ReminderBuilder;
    disablePushNotification(): ReminderBuilder;
    build(): any;
}
