import { Montserrat, Unbounded } from "next/font/google";
import localFont from "next/font/local";

export const montserrat = Montserrat({
    subsets: ["latin", "cyrillic"],
    weight: ["400", "500", "700"],
    display: "swap",
    variable: "--font-montserrat",
});

export const unbounded = Unbounded({
    subsets: ["cyrillic", "latin"],
    weight: ["900"],
    display: "swap",
    variable: "--font-unbounded",
});

export const kankin = localFont({
    src: [
        {
            path: "./assets/fonts/Kankin.woff2",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-kankin",
    display: "swap",
    weight: "400",
});
