'use client'

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";
import googleIcon from "@/assets/icons/google.svg";
import { useState } from "react";
import { useLocale } from "next-intl";
import { env } from "@/env.mjs";

type Props = {
  disabled?: boolean
}

const GoogleAuthButton = ({ disabled }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const locale = useLocale();

    return (
        <Button
            variant={"outline"}
            className="w-full mb-5"
            size={"lg"}
            type="button"
            onClick={async () => {
                const t = await signIn("google", { callbackUrl: `${env.NEXT_PUBLIC_SITE_URL}/${locale}/catalog` });

            }}
            disabled={disabled ?? isLoading}
        >
            <Image src={googleIcon} alt="google" width={"20"} height={"20"}  />
        </Button>
    );
};

export default GoogleAuthButton;
