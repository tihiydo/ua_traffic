import { ru, uk, enGB } from "date-fns/locale"


export const getLocale = (locale: string) => {
    if (locale === 'ua') {
        return uk;
    }

    if (locale === 'ru') {
        return ru
    }

    if (locale === 'en') {
        return enGB
    }

    return uk
}