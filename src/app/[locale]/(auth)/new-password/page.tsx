import React from "react";
import NewPasswordForm from "./_components/new-password-form";
import Translate from "@/components/Translate";
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
    const authNewPasswordT = await getTranslations('Auth.New-Password');

    return {
        title: "UATRAFFIC | " + authNewPasswordT('meta/title'),
        description: authNewPasswordT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + authNewPasswordT('meta/title'),
            description: authNewPasswordT('meta/description'),
        },
    }
}

const NewPasswordPage = () => {
    return (
        <div className="w-full flex items-center flex-col ">
            <div className="max-w-[400px] w-[100%]" >
                <div className="mb-8">
                    <h2 className="mb-4 w-[200px] font-title text-[2rem] uppercase leading-[100%]">
                        <Translate namespace="Auth.New-Password" itemKey="title" />
                    </h2>

                    <p className="text-sm">
                        <Translate namespace="Auth.New-Password" itemKey="description" />
                    </p>
                </div>

                <NewPasswordForm />
            </div>
        </div>
    );
};

export default NewPasswordPage;
