'use client'

import { api } from '@/trpc/react';
import React, { useState } from 'react'
import Translate from '@/components/Translate'
import SpinnerLoading from '@/components/ui/custom/spinner-loading'
import { useTranslations } from 'next-intl'
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import ShowQrCodeModal from './qr-code-modal';
import { type GetMyUserData } from '@/server/api/routers/user/procedures/get-my-user';
import { useRouter } from '@/i18n/navigation';

type QrCode = {
    url: string,
    secret: string
}

type Props = {
    user: GetMyUserData
}

const TwoFASection = ({ user }: Props) => {
    const router = useRouter();
    const TwoFAGoogleT = useTranslations('2fagoogle')
    const [qrCodeState, setQRCodeState] = useState<Maybe<QrCode>>(null);

    const { mutateAsync: verify, isLoading: loadingTwoFaVerify } = api.user.twofaVerify.useMutation({
        onSuccess: async (res) => {
            if (res?.totpResult) {
                router.refresh()
                setQRCodeState(null)
                toast.success(TwoFAGoogleT('successremove'));
            } else {
                toast.error(TwoFAGoogleT('validationsms'));
            }
        },
    });

    const { isLoading: loading, mutateAsync: generateQrCode } = api.user.twofaGenerate.useMutation({
        onSuccess: (result) => {
            router.refresh()
            if (result !== undefined) setQRCodeState({ url: result.url, secret: result.secret });
        },

    });

    if (user.twofaGoogle === null) {
        return <>
            <div className="mt-6 h-full">
                <div className="max-w-[500px] w-full">
                    <div>
                        <h3 className="font-bold text-lg mb-0.5">2FA Google</h3>
                        <div className="text-sm"><Translate namespace="2fagoogle" itemKey="start-description" /></div>
                        <Button
                            className="mt-3"
                            onClick={async () => generateQrCode()}
                        >
                            {loading ? <SpinnerLoading /> : <Translate namespace="2fagoogle" itemKey="create" />}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    }

    if (user.id) {
        return <>
            <ShowQrCodeModal qrCode={qrCodeState} setQrCode={setQRCodeState} />
            <div className="mt-6 h-full">
                <div className="max-w-[500px] w-full">
                    <div>
                        <h3 className="font-bold text-lg nb">2FA Google</h3>
                        <div className="text-sm">
                            <Translate namespace="2fagoogle" itemKey="ihave" />
                        </div>

                        <Button
                            onClick={async () => {
                                await verify({ remove: true, email: user.email ?? ''});
                            }}
                            className="mt-3"
                            variant={"destructive"}
                            disabled={loadingTwoFaVerify}
                        >
                            {loadingTwoFaVerify
                                ? <SpinnerLoading color="#ffffff" />
                                : <Translate namespace="2fagoogle" itemKey="delete" />
                            }
                        </Button>
                    </div>
                </div>
            </div>
        </>
    }

    return null;
}

export default TwoFASection