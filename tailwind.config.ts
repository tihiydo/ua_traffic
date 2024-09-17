/** @type {import('tailwindcss').Config} */

module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "1rem",
            screens: {
                "2xl": "1400px",
            },
        },

        extend: {
            screens: {
                'xss': '425px',
            },
            boxShadow: {
                'custom': '6px 7px 20px -3px rgb(0 0 0 / 50%)',
                "custom-second": "5px 9px 20px 0px rgb(0 0 0 / 21%)",
                "custom-last": "0px 0px 10px 4px #ffde59",
                "navbar": "6px 0px 28px 0px rgb(52 52 52 / 71%)"
            },
            gridTemplateRows: {
                'channel-card': 'repeat(16, minmax(0, 25px))',
                'auto-fit-200': 'repeat(auto-fit, 200px)'
            },
            gridTemplateColumns: {
                'max': 'repeat(auto-fill, 20rem)',
                'auto-fill-200': 'repeat(auto-fill, minmax(200px, 1fr))',
            },
            colors: {
                primary: "#FFDE59",
                yellow: "#FFDE59",
                "yellow-secondary": "#EDFFB8",
                "light-green": "#CBFFB8",
                blue: "#B8E1FF",
                red: "#FFB8B8",
                main: "#323232",
                gray: "#F4F5F5",
                "gray-secondary": "#BFC7D1",
                "gray-last": "#BDC8D6",
                white: "#FFFFFF",

                destructive: '#d32f2f',
                warning: "#ffcc00",
                success: '#198754',
                info: "#3498db"
            },
            fontFamily: {
                content: ["var(--font-montserrat)"],
                title: ["var(--font-unbounded)"],
                kankin: ["var(--font-kankin)"],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },

        },
    },
    plugins: [
        require("tailwindcss-animate"),
        require("@tailwindcss/line-clamp"), 
        require('tailwindcss-gradients'),
        require('@tailwindcss/container-queries')
    ],
};
