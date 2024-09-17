import React from "react";
import LoginForm from "./_components/login-form";
import Translate from "@/components/Translate";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
    const authLoginT = await getTranslations('Auth.Login');

    return {
        title: "UATRAFFIC | " + authLoginT('meta/title'),
        description: authLoginT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + authLoginT('meta/title'),
            description: authLoginT('meta/description'),
        },
    }
}

const LoginPage = () => {
    return (
        <div className="w-full flex items-center flex-col ">
            <div className="max-w-[400px] w-full" >
                <h2 className="font-title text-[2rem] text-main lg:mb-6 sm:mb-4 mb-3 uppercase w-full max-w-[300px]">
                    <Translate namespace="Auth.Login" itemKey="title" />
                </h2>
                <LoginForm />
            </div>
        </div>);
};

export default LoginPage;
