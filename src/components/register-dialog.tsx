
import React from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Link } from '@/i18n/navigation'

type Props = {
    children: React.ReactNode
}

const RegisterDialog = ({ children }: Props) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className='max-w-[420px]'>
                <div>
                    <h4 className='font-bold mb-1'>
                        Необхідна реєстрація
                    </h4>
                    <p className='text-sm font-medium text-main/70'>
                        Щоб виконати цю дію вам потрібно зареєструватись
                    </p>
                </div>


                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3'>
                    <Button
                        className=''
                        asChild
                    >
                        <Link href={'/sign-up'}>
                            Зареєструватись
                        </Link>
                    </Button>

                    <Button
                        className=''
                        variant={'outline'}
                        asChild
                    >
                        <Link href={'/login'}>
                            Увійти
                        </Link>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default RegisterDialog