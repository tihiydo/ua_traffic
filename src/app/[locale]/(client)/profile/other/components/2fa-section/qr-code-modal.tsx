"use client"

import React, { type Dispatch, type SetStateAction } from 'react'
import { X } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { api } from '@/trpc/react';
import { toast } from 'react-toastify';
import Translate from '@/components/Translate';
import { useTranslations } from 'next-intl';

type qrCode = {
    url: string,
    secret: string
}

type Props = {
    qrCode: Maybe<qrCode>
    setQrCode: Dispatch<SetStateAction<Maybe<qrCode>>>
}

const ShowQrCodeModal = (props: Props) => {
    const utils = api.useUtils();
    const t = useTranslations();

    if (props.qrCode != null) {
        document.body.style.overflow = "hidden"

        return (
            <div className="flex justify-center items-center w-full h-screen transition-all duration-400 bg-black bg-opacity-40 absolute top-0 left-0 z-50 backdrop-blur-md">
                <div className="h-[220px] w-[220px] bg-white rounded-2xl flex justify-center items-center relative">
                    <div className="cursor-default absolute top-[-80px] bg-white w-[260px] h-fit px-2 py-2 rounded-2xl text-xs flex justify-center items-center text-center">
                        <Translate namespace="2fagoogle" itemKey="global-description" />
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <X color="#ffffff" size={"20px"} className="absolute top-[0px] right-[-35px] cursor-pointer" onClick={() => {
                                    props.setQrCode(undefined)
                                    document.body.style.overflow = "auto"
                                    utils.user.getMyUser.refetch()
                                }} />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p><Translate namespace="2fagoogle" itemKey="close" /></p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <img src={props.qrCode.url} alt="QR Code"></img>
                    <div className="cursor-default flex-col absolute bottom-[-150px] bg-white w-[265px]  px-2 py-2 rounded-2xl text-xs flex justify-center items-center text-center">
                        <div className="relative">
                            <Translate namespace="2fagoogle" itemKey="global-description-or" />
                            <br />
                            <br />
                            <Translate namespace="2fagoogle" itemKey="your-pin" />
                            <br />
                            <span
                                className="cursor-pointer bg-black text-white px-2 rounded-md"
                                onClick={async () => {
                                    if (props.qrCode !== undefined) {
                                        toast.success(t('2fagoogle.copytobuffer'))
                                        if (props.qrCode) {
                                            navigator.clipboard.writeText(props.qrCode.secret)
                                        }
                                    }

                                }}
                            >
                                {props.qrCode.secret}
                            </span>
                        </div>
                        <div className="absolute right-[-1px] bottom-[27px] bg-yellow text-black px-1 rounded-md font-[900] text-[6px] rotate-[17deg] uppercase">
                            <Translate namespace="2fagoogle" itemKey="taptocopy" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ShowQrCodeModal