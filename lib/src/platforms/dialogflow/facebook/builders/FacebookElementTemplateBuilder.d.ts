import { FACEBOOK_WEBVIEW_HEIGHT_RATIO, IFacebookElementTemplate, IFacebookGenericButtonTemplate } from "../directives";
/**
 * Template Builder class reference
 */
export declare class FacebookElementTemplateBuilder {
    private buttons;
    private imageUrl?;
    private subtitle?;
    private title;
    private defaultActionUrl?;
    private defaultActionFallbackUrl?;
    private defaultMessengerExtensions?;
    private defaultWebviewHeightRatio?;
    private sharable?;
    private url?;
    addButton(button: IFacebookGenericButtonTemplate): FacebookElementTemplateBuilder;
    setImageUrl(imageUrl: string): FacebookElementTemplateBuilder;
    setSubtitle(subtitle: string): FacebookElementTemplateBuilder;
    setTitle(title: string): FacebookElementTemplateBuilder;
    setUrl(url: string): FacebookElementTemplateBuilder;
    setDefaultActionUrl(defaultActionUrl: string): FacebookElementTemplateBuilder;
    setDefaultActionFallbackUrl(defaultActionFallbackUrl: string): FacebookElementTemplateBuilder;
    setDefaultMessengerExtensions(defaultMessengerExtensions: boolean): FacebookElementTemplateBuilder;
    setDefaultWebviewHeightRatio(defaultWebviewHeightRatio: FACEBOOK_WEBVIEW_HEIGHT_RATIO): FacebookElementTemplateBuilder;
    setSharable(sharable: boolean): FacebookElementTemplateBuilder;
    build(): IFacebookElementTemplate;
}
