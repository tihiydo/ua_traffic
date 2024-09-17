import { excludeKeys } from "@/utils";
import { useState } from "react";




export function useHelperMapState<T extends Partial<Record<string, any>>>(defaultValue: T) {
    type V = Partial<T>;

    const [state, setState] = useState<V>(defaultValue);

    const remove = (key: keyof V) => {
        setState(
            excludeKeys([key.toString()], state) as V
        )
    }

    const update = <K extends keyof V>(key: K, value: V[K]) => {
        setState({
            ...state,
            [key]: value,
        })
    }

    const clear = () => {
        setState({} as V);
    }

    const exclude = (keys: (keyof V)[]) => {
        setState(
            excludeKeys(keys, state) as V
        )
    }

    const merge = (merged: Partial<V>) => {
        setState({
            ...state,
            ...merged
        })
    }

    return {
        state,
        actions: {
            remove,
            update,
            clear,
            exclude,
            merge
        }
    }
}
