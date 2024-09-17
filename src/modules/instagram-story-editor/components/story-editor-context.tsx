'use client'

import React, { createContext, useContext } from 'react'


type StoryContext = {
    mode: 'edit' | 'view';
}

const StoryContext = createContext<StoryContext>({ mode: 'view' })

type Props = {
    value: StoryContext;
    children: React.ReactNode;
}

export const StoryContextProvider = ({ children, value }: Props) => {
    return (
        <StoryContext.Provider value={value}>
            {children}
        </StoryContext.Provider>
    )
}

export const useStoryContext = () => {
    return useContext(StoryContext)
}

export default StoryContext