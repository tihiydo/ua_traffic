'use client'

import { Button } from "@/components/ui/button"
import { ShieldX } from "lucide-react"
import { signOut } from "next-auth/react"
import { env } from "@/env.mjs"


const Blocked = () => {
    return (
        <div className="min-h-screen flex justify-center h-full items-center bg-[#f6f6f6]">
            <div className="flex md:flex-row flex-col">
                <div className="w-fit h-[15rem] flex items-center self-center">
                    <ShieldX size="180px" color="#000000" strokeWidth={1.0} />
                </div>
                <div className="w-[30rem] h-[15rem] p-5 py-10 relative text-center md:text-left">
                    <div className="font-kankin text-5xl">UATRAFFIC</div>
                    <div className="font-content text-base font-bold mt-4">Ваш аккаунт заблокованний<br/>Зв'яжіться будь ласка з адміністрацією</div>
                    <Button className="w-full md:w-fit md:mt-0 mt-[2rem] md:absolute bottom-2" onClick={ async () => { 
                        await signOut({ callbackUrl: env.NEXT_PUBLIC_SITE_URL });
                    }}>
                        Вийти з аккаунту
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Blocked