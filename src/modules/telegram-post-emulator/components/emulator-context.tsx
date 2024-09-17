"use client"

import React, { createContext, useContext } from "react";
import type { InlineKeyboardItem, AnyMediaItem } from "../types";

type EmulatorContext = {
    media: AnyMediaItem[];
    buttons: InlineKeyboardItem[];
    content: string;
    disabled: boolean
}
const defaultValue: EmulatorContext = {
    buttons: [],
    media: [],
    content: '',
    disabled: false
}

const EmulatorContext = createContext<EmulatorContext>(defaultValue)


type Props = {
    children: React.ReactNode;
    value: Partial<EmulatorContext>;
}

const EmulatorContextProvider = ({ children, value }: Props) => {
    return (
        <EmulatorContext.Provider value={{ ...defaultValue, ...value }}>
            {children}
        </EmulatorContext.Provider>
    )
}

export const useEmulatorContext = () => {
    return useContext(EmulatorContext)
}

export default EmulatorContextProvider