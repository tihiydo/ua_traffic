import { ERROR_CODES } from "@/constants/error-codes"
import { useTranslations } from "next-intl"

type Options = Partial<{
    showUnknownContents: boolean;
}>
export const useErrorTranslate = (opts?: Options) => {
    const t = useTranslations('Validation');

    const tranlsateError = (errorCode: string) => {
        const isEnumerated = Object.values(ERROR_CODES).includes(errorCode ?? '')

        if (opts?.showUnknownContents && !isEnumerated) {
            return errorCode;
        }

        return isEnumerated ? t(errorCode) : t('unknown')
    }

    return tranlsateError
} 