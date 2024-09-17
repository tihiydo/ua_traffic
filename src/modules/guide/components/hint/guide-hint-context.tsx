'use client'
import { createContext, useContext } from "react";
import type { Task } from "../../types";

type GuideHintData = {
    task: Maybe<Task>;
    isActive: boolean
    closeHint: Maybe<() => void>
}

const GuideHintContext = createContext<GuideHintData>({
    task: null,
    isActive: false,
    closeHint: null
})

type Props = {
    task: Maybe<Task>;
    isActive: boolean;
    closeHint: Maybe<() => void>
    children: React.ReactNode;
}

const GuideHintContextProvider = ({ children, task, isActive, closeHint }: Props) => {
    return (
        <GuideHintContext.Provider value={{ task, isActive, closeHint }}>
            {children}
        </GuideHintContext.Provider>
    )
}

export const useGuideHintContext = () => {
    return useContext(GuideHintContext)
}

export default GuideHintContextProvider