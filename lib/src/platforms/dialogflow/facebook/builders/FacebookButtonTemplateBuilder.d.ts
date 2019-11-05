import { FACEBOOK_BUTTONS, FACEBOOK_WEBVIEW_HEIGHT_RATIO, IFacebookGenericButtonTemplate } from "../directives";
/**
 * Template Builder class reference
 */
export declare class FacebookButtonTemplateBuilder {
    private fallbackUrl?;
    private messengerExtensions?;
    private payload?;
    private title;
    private type;
    private url?;
    private webviewHeightRatio?;
    setFallbackUrl(fallbackUrl: string): FacebookButtonTemplateBuilder;
    setMessengerExtensions(messengerExtensions: boolean): FacebookButtonTemplateBuilder;
    setPayload(payload: string): FacebookButtonTemplateBuilder;
    setTitle(title: string): FacebookButtonTemplateBuilder;
    setType(type: FACEBOOK_BUTTONS): FacebookButtonTemplateBuilder;
    setUrl(url: string): FacebookButtonTemplateBuilder;
    setWebviewHeightRatio(webviewHeightRatio: FACEBOOK_WEBVIEW_HEIGHT_RATIO): FacebookButtonTemplateBuilder;
    build(): IFacebookGenericButtonTemplate;
}
