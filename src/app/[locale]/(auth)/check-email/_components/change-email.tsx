'use client'

import Translate from '@/components/Translate';
import { useSignUpSession } from '../../_hooks/useSignUpSession'
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';

``
const ChangeEmail = () => {
    const { replace } = useRouter();
    const [, setSignUpSession] = useSignUpSession();
    return (
        <>
            <p className="flex items-center">
                <Translate namespace="Auth.Check-Email" itemKey="wrong-email-q" />

            </p>
            <Button className="font-bold " variant={'link'} onClick={() => {
                replace('/sign-up')
                setSignUpSession({ email: '', lastSendDate: null })
            }}>
                <Translate namespace="Auth.Check-Email" itemKey="change-email" />
            </Button>
        </>
    )
}

export default ChangeEmail