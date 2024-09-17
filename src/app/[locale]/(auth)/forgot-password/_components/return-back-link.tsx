import Translate from "@/components/Translate";
import { Link } from "@/i18n/navigation";
import React from "react";

const ReturnBackLink = () => {
    return (
        <Link href={"/login"} className="flex w-fit items-center gap-4 group">
            <svg
                className="w-5 stroke-main"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M6.5 8L2.5 12L6.5 16"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M2.5 12H22.5"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            <p className="group-hover:underline">
                <Translate namespace="Auth.Forgot-Password" itemKey="back" />
            </p>
        </Link>
    );
};

export default ReturnBackLink;
