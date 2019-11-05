import { FACEBOOK_IMAGE_ASPECT_RATIO, FACEBOOK_TOP_ELEMENT_STYLE, IFacebookElementTemplate, IFacebookGenericButtonTemplate, IFacebookPayloadTemplate } from "../directives";
/**
 * Template Builder class reference
 */
export declare class FacebookTemplateBuilder {
    private buttons;
    private elements;
    private imageAspectRatio?;
    private sharable?;
    private text?;
    private topElementStyle?;
    addButton(button: IFacebookGenericButtonTemplate): FacebookTemplateBuilder;
    addElement(element: IFacebookElementTemplate): FacebookTemplateBuilder;
    setImageAspectRatio(imageAspectRatio: FACEBOOK_IMAGE_ASPECT_RATIO): FacebookTemplateBuilder;
    setSharable(sharable: boolean): FacebookTemplateBuilder;
    setText(text: string): FacebookTemplateBuilder;
    setTopElementStyle(topElementStyle: FACEBOOK_TOP_ELEMENT_STYLE): FacebookTemplateBuilder;
    build(): IFacebookPayloadTemplate;
}
