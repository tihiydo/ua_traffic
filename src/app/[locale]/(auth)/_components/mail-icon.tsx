import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
};

const MailIcon = ({ className }: Props) => {
    return (
        <svg
            viewBox="0 0 54 42"
            fill={'none'}
            className={twMerge("stroke-main w-14 h-14", className)}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M52 21V2.25H27H2V21V39.75H27"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M52 33.5H34.5"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M40.75 27.25L34.5 33.5L40.75 39.75"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M2 2.25L27 21L52 2.25"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default MailIcon;
