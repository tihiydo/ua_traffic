
import React from "react";
import MailIcon from "../_components/mail-icon";
import ResendEmail from "./_components/resend-email";
import ChangeEmail from "./_components/change-email";
import Translate from "@/components/Translate";
import { getTranslations } from "next-intl/server";
import { type Metadata } from "next";


export async function generateMetadata(): Promise<Metadata> {
    const authCheckEmailT = await getTranslations('Auth.Check-Email');

    return {
        title: "UATRAFFIC | " + authCheckEmailT('meta/title'),
        description: authCheckEmailT('meta/description'),
        openGraph: {
            title: "UATRAFFIC | " + authCheckEmailT('meta/title'),
            description: authCheckEmailT('meta/description'),
        },
    }
}


const CheckEmailPage = () => {
    return (
        <div className="w-full flex items-center flex-col ">
            <div className="max-w-[400px] w-[100%]" >
                <div className="mb-10">
                    <div>
                        <MailIcon className="mb-4 stroke-yellow" />
                    </div>

                    <h2 className="mb-4 w-[200px] font-title text-[2rem] uppercase leading-[100%]">
                        <Translate namespace="Auth.Check-Email" itemKey="title" />
                    </h2>

                    <p className="text-sm">
                        <Translate namespace="Auth.Check-Email" itemKey="description" />
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <ResendEmail />
                    <ChangeEmail />
                </div>
            </div>
        </div>
    );
};

export default CheckEmailPage;
