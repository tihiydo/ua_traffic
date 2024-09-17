export function exclude<T extends Record<string, any | null>, TKey extends keyof T>(
    user: T,
    keys: TKey[],
): Omit<T, TKey> {
    return Object.fromEntries(
        Object.entries(user).filter(([key]) => !keys.includes(key as TKey)),
    ) as Omit<T, TKey>;
}
