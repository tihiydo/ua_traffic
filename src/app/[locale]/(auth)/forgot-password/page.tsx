import React from "react";
import MailIcon from "../_components/mail-icon";
import ForgotPasswordForm from "./_components/forgot-password-form";
import ReturnBackLink from "./_components/return-back-link";
import Translate from "@/components/Translate";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const authForgotPasswordT = await getTranslations('Auth.Forgot-Password');

    return {
        title: "UATRAFFIC | " + authForgotPasswordT('meta/title'),
        description: authForgotPasswordT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + authForgotPasswordT('meta/title'),
            description: authForgotPasswordT('meta/description'),
        },
    }
}

const ForgotPasswordPage = () => {
    return (
        <div className="w-full flex items-center flex-col ">
            <div className="max-w-[400px] w-[100%]">
                <div className="mb-8">
                    <div>
                        <MailIcon className="mb-4 " />
                    </div>

                    <h2 className="mb-4 w-[200px] font-title text-[2rem] uppercase">
                        <Translate namespace="Auth.Forgot-Password" itemKey="title" />
                    </h2>

                    <p className="text-sm">
                        <Translate namespace="Auth.Forgot-Password" itemKey="description" />
                    </p>
                </div>

                <ForgotPasswordForm />

                <div className="flex justify-center mt-5">
                    <ReturnBackLink />
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
