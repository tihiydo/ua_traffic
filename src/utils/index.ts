export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const parseStringType = (value: string) => {
    try {
        return JSON.parse(value) as any;
    } catch (error) {
        return value
    }
}

export const isPrimitive = (value: any): boolean => {
    return value !== Object(value)
}

export const excludeKeys = <
    K extends Array<keyof T>,
    T extends Record<string, any>,
>(
    keysToExclude: K,
    obj: T | Partial<T>
): Omit<T, typeof keysToExclude[number]> => {
    const result: Partial<T> = {};

    for (const key in obj) {
        if (!keysToExclude.includes(key as keyof T)) {
            result[key] = obj[key];
        }
    }

    return result as Omit<T, K[number]>;
};


export const pickKeys = <
    K extends Array<keyof T>,
    T extends Record<string, any>,
>(
    keysToPick: K,
    obj: T | Partial<T>
): Pick<T, typeof keysToPick[number]> => {
    const result: Partial<T> = {};

    for (const key in obj) {
        if (keysToPick.includes(key as keyof T)) {
            result[key] = obj[key];
        }
    }

    return result as Pick<T, K[number]>;
}

export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const result: T[][] = [];

    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }

    return result;
}

export function truncate(inputString: string, lengthToLeave: number, postfix = true): string {
    if (lengthToLeave >= inputString.length) {
        return inputString;
    }

    const truncatedString = inputString.slice(0, lengthToLeave);
    return `${truncatedString}${postfix ? '...' : ''}`

}

export function excludeDomainFromUrl(url: string) {
    const urlWithoutProtocol = url.replace(/^https?:\/\//, '');
    const domainEndIndex = urlWithoutProtocol.indexOf('/');
    if (domainEndIndex !== -1) {
        return urlWithoutProtocol.slice(domainEndIndex);
    }
    return '/';
}