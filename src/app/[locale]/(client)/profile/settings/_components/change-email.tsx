'use client';

import { type api as serverApi } from "@/trpc/server";
import ChangeEmailForm from "./change-email-form";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "react-toastify";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import { signOut } from "next-auth/react";
import { useMutableSearchParams } from "@/hooks/use-mutable-search-params";
import InfoMessage from "@/components/ui/custom/info-message";
import ServerErrorMessage from "@/components/server-error-message";
import Translate from "@/components/Translate";

type Props = {
    user: NonNullable<Awaited<ReturnType<typeof serverApi.user.getMyUser.query>>>
}

const ChangeEmail = ({ user }: Props) => {
    const searchParams = useSearchParams();
    const { mutate: sendChangeEmailEmail, isLoading: isSending, error: sendingError, isSuccess: isSent } = api.user.sendChangeEmailEmail.useMutation({
        onSuccess: () => {
            toast.success('Лист відправлено')
        }
    })
    const { mutate: changeEmail, isLoading: isChanging, error: changeEmailError } = api.user.changeEmail.useMutation({
        onSuccess: (data) => {
            toast.success('Email змінено');
            signOut({ callbackUrl: `/login?email=${data.email}` });
        }
    })
    const token = searchParams.get('v-email')
    const { delete: deleteSearchParam } = useMutableSearchParams();

    return (
        <div>
            {token ? (
                <div>
                    <InfoMessage variant={'warning'} size={'sm'} closable={false} className="my-2">
                        <Translate namespace='Profile' itemKey='email-change-warn' />
                    </InfoMessage>

                    {!!changeEmailError?.message && (
                        <ServerErrorMessage size={'sm'} className="my-3" errorCode={changeEmailError?.message} />
                    )}

                    <div className="flex gap-3 items-center">
                        <Button disabled={isChanging} onClick={() => {
                            changeEmail({ token })
                        }}>
                            {isChanging && <SpinnerLoading className="mr-2" />}
                            Змінити
                        </Button>

                        <Button onClick={() => {
                            deleteSearchParam('v-email')
                        }}>
                            Не змінювати
                        </Button>
                    </div>

                </div>

            ) : (
                <div>
                    <p className="text-sm"><Translate namespace="Profile" itemKey="emailchangedesc" /></p>

                    <div className="my-3">
                        {!!sendingError?.message && (
                            <ServerErrorMessage size={'sm'} errorCode={sendingError.message} />
                        )}
                        <ChangeEmailForm
                            disabled={isSent}
                            currentEmail={user.email ?? ''}
                            isLoading={isSending}
                            onSubmit={(data) => {
                                sendChangeEmailEmail({ email: data.email })
                            }} />
                    </div>

                </div>



            )}

        </div>
    )
}

export default ChangeEmail