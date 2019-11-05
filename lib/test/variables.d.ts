import { Hint, HomeCard } from "../src/platforms/alexa/directives";
import { IFacebookPayloadTemplate } from "../src/platforms/dialogflow";
import { IVoxaEvent } from "../src/VoxaEvent";
export declare const variables: {
    card2: () => HomeCard;
    exitArray: () => ({
        a: number;
        b?: undefined;
        c?: undefined;
    } | {
        b: number;
        a?: undefined;
        c?: undefined;
    } | {
        c: number;
        a?: undefined;
        b?: undefined;
    })[];
    exitCard: () => {
        image: {
            largeImageUrl: string;
            smallImageUrl: string;
        };
        text: string;
        title: string;
        type: string;
    };
    exitDirectiveMessage: () => {
        text: string;
        type: string;
    };
    hintDirective: () => Hint;
    items: (request: IVoxaEvent) => any;
    time: () => "Morning" | "Afternoon" | "Evening";
    site: () => string;
    count: (request: IVoxaEvent) => Promise<any>;
    numberOne: (request: IVoxaEvent) => 1 | "one" | "ein";
    listsWithItems: (request: IVoxaEvent) => string;
    customerContactCountry: (request: IVoxaEvent) => any;
    customerContactEmail: (request: IVoxaEvent) => any;
    customerContactGivenName: (request: IVoxaEvent) => any;
    customerContactNumber: (request: IVoxaEvent) => any;
    deviceInfo: (request: IVoxaEvent) => any;
    name: (request: IVoxaEvent) => any;
    settingsInfo: (request: IVoxaEvent) => any;
    reminderAllContent: (request: IVoxaEvent) => string;
    reminderContent: (request: IVoxaEvent) => any;
    reminderId: (request: IVoxaEvent) => any;
    facebookButtonTemplate: (request: IVoxaEvent) => IFacebookPayloadTemplate;
    facebookCarousel: (request: IVoxaEvent) => IFacebookPayloadTemplate;
    facebookList: (request: IVoxaEvent) => IFacebookPayloadTemplate;
    facebookOpenGraphTemplate: (request: IVoxaEvent) => IFacebookPayloadTemplate;
};
