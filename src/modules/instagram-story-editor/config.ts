import { TextAlign, TextBgColor } from "./enums";
import { StoryFont } from "./fonts";

export const config = {
    textNode: {
        maxFontSize: 60,
        minFontSize: 5,
        defaultFontSize: 12,
        defaultFont: StoryFont.Montserrat,
        defaultTextColor: "#000000",
        defaultAlign: TextAlign.Center,
        defaultBgColor: TextBgColor.Transparent
    },
    linkNode: {
        defaultScale: 100,
        maxScale: 200,
        minScale: 50,
    },
    imageNode: {
        defaultScale: 100,
        maxScale: 200,
        minScale: 50,
    },

}