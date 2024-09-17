import { getWindow } from "@/utils/window";
import { useCallback, useEffect, useState } from "react";

type Options<T> = {
  defaultValue?: T;
};

export function useLocalStorage<T extends Record<string, any>>(
    path: string,
    options?: Options<T>,
) {
    const window = getWindow();

    const [signUpSession, setSignUpSession] = useState<T | undefined>(
        options?.defaultValue ??
      (window 
          ? JSON.parse(window.localStorage?.getItem(path) ?? "{}") as T
          : {} as T),
    );

    useEffect(() => {
        if (!window) return;

        window.addEventListener("storage", function (e) {
            if (e.key === path) {
                const value = JSON.parse(e.newValue ?? "{}") as T
                setSignUpSession(value);
            }
        });
    }, [path]);

    const setSignUpSessionHandler = useCallback(
        (value: T) => {
            // for other pages
            localStorage?.setItem(
                path,
                JSON.stringify({ ...(signUpSession ?? {}), ...value }),
            );

            // for page where state was mutated
            setSignUpSession({ ...signUpSession, ...value });
        },
        [path, signUpSession],
    );

    return [signUpSession, setSignUpSessionHandler] as const;
}
