import { type TranslateFn } from "@/types";
import { type TranslateContents } from "./types"
import { parseStringType } from "@/utils";
import { translateContentsSchema } from "./schemas";
import { type Locale } from "@/i18n/config";

export const createMessage = (content: TranslateContents): string => {
    return JSON.stringify(content);
}

type PraseOpts = Partial<{
    translate: TranslateFn;
    locale: Locale
}>
export const parseMessage = (content: string, options?: PraseOpts): { value: string, parsed: TranslateContents } => {
    const parsedContent = translateContentsSchema.parse(
        parseStringType(content)
    );

    if (parsedContent.kind === 'string') {
        return { value: parsedContent.data, parsed: parsedContent };
    }

    if (parsedContent.kind === 'code') {
        if (!options?.translate) {
            throw new Error("Tranlsate function was not provided")
        };

        return { value: options.translate(parsedContent.code, parsedContent.values), parsed: parsedContent }
    }

    if (parsedContent.kind === 'map') {
        if (!options?.locale) {
            throw new Error("Locale was not provided")
        };

        return { value: parsedContent.data[options.locale].content, parsed: parsedContent }
    }

    return {
        parsed: { kind: 'string', data: 'if you see this something happen in translate-protocol module' },
        value: 'never'
    }
}