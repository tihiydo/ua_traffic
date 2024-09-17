import { Montserrat, Playfair_Display, Poiret_One } from 'next/font/google'


export const montserrat = Montserrat({
    subsets: ["latin", "cyrillic"],
    weight: ["400"],
    display: "swap",
    variable: "--font-inst-montserrat",
    preload: false
});

export const montserratBold = Montserrat({
    subsets: ["latin", "cyrillic"],
    weight: ["700"],
    display: "swap",
    variable: "--font-inst-montserrat-bold",
    preload: false
});

export const playfairDisplay = Playfair_Display({
    subsets: ["latin", 'cyrillic'],
    weight: ['400'],
    display: "swap",
    variable: "--font-inst-playfairDisplay",
    preload: false
});

export const pioretOne = Poiret_One({
    subsets: ["latin", 'cyrillic'],
    weight: ['400'],
    display: "swap",
    variable: "--font-inst-pioretOne",
    preload: false
});


export const StoryFont = {
    Montserrat: montserrat,
    Boldserrat: montserratBold,
    PlayfairDisplay: playfairDisplay,
    PioretOne: pioretOne
} as const
export type StoryFont = keyof typeof StoryFont;



