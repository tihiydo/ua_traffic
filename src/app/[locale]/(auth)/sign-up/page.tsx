import React from "react";
import SignUpForm from "./_components/sign-up-form";
import Translate from "@/components/Translate";
import { type Metadata } from "next";
import { getTranslations } from "next-intl/server";



export async function generateMetadata(): Promise<Metadata> {
    const authSignUpT = await getTranslations('Auth.Sign-Up');

    return {
        title: "UATRAFFIC | " + authSignUpT('meta/title'),
        description: authSignUpT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + authSignUpT('meta/title'),
            description: authSignUpT('meta/description'),
        },
    }
}

const SignupPage = () => {
    return (
        <div className="w-full flex items-center flex-col ">
            <div className="max-w-[400px] w-[100%]" >
                <h2 className="font-title text-main text-[1.5rem] sm:text-[2rem] uppercase max-w-[400px] lg:mb-6 mb-4">
                    <Translate namespace="Auth.Sign-Up" itemKey="title" />
                </h2>

                <SignUpForm />
            </div>
        </div>
    );
};

export default SignupPage;
