import Image from "next/image";
import React from "react";
import authBgImage from "@/assets/images/auth-bg.jpg";
import { getServerSession } from "next-auth";
import { redirect } from "@/i18n/navigation";
import Translate from "@/components/Translate";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = async ({ children }: Props) => {
    const session = await getServerSession();
    if (session?.user) {
        redirect('/catalog')
    }

    return (
        <div className="grid h-screen lg:grid-cols-2 p-6">
            <div className="flex h-full items-center mx-[8px] sm:mx-[35px]">{children}</div>

            <div className="lg:flex hidden relative h-full items-center justify-center overflow-hidden rounded-md">
                <Image
                    className="absolute object-cover"
                    quality={100}
                    src={authBgImage}
                    alt="auth bg"
                    fill
                    sizes="50vw"
                />

                <div className="border-gray relative flex aspect-square w-[70%] flex-col  justify-center overflow-hidden rounded-md border backdrop-blur-md">
                    <div className="relative mx-auto w-[80%]">
                        <div className="absolute -top-10 h-6 w-full bg-primary"></div>
                        <p className="font-title whitespace-normal break-words text-3xl uppercase  leading-[120%] text-white">
                            <Translate namespace="Auth" itemKey="title" />
                        </p>
                    </div>
                </div>

                <p className="font-kankin absolute -right-14 bottom-20 rotate-90 text-4xl text-white">
          UATRAFFIC
                </p>
            </div>
        </div>
    );
};

export default AuthLayout;
