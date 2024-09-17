'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useState, useEffect } from 'react'
import { api } from '@/trpc/react'
import { useRouter } from '@/i18n/navigation'
import Translate from '@/components/Translate'
import ServerErrorMessage from '@/components/server-error-message'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'react-toastify'
import { useTranslations } from 'next-intl'

type Props = {
    children?: React.ReactNode;
}

const TransferMoneyModal = ({ children }: Props) => {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const router = useRouter();
    const [error1, setError] = useState<string | null>(null);
    const t = useTranslations('Default');

    const { data: user, refetch } = api.user.getMyUser.useQuery();
    const [newAdvertiserBalance, setNewAdvertiserBalance] = useState(user?.advertiserBalance ?? 0);
    const [newBloggerBalance, setNewBloggerBalance] = useState(user?.bloggerBalance ?? 0);
    const { data: transferFee, isLoading: isLoadingTransferFee } = api.fee.getFee.useQuery({ type: "Transfer" });

    useEffect(() => {
        if (user) {
            setNewAdvertiserBalance(user.advertiserBalance);
            setNewBloggerBalance(user.bloggerBalance);
        }
    }, [user]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setAmount(value);
            setError(null);
            const numAmount = parseFloat(value) || 0;
            const feeAmount = transferFee ? (numAmount * transferFee / 100) : 0;
            const amountAfterFee = numAmount - feeAmount;
            setNewAdvertiserBalance((user?.advertiserBalance ?? 0) - numAmount);
            setNewBloggerBalance((user?.bloggerBalance ?? 0) + amountAfterFee);
        } else {
            setError('Please enter a valid number');
        }
    };

    const { mutate: transferMoney, error, isLoading } = api.advertiser.transactions.transferMoney.useMutation({
        onSuccess: () => {
            setOpen(false);
            refetch();
            toast.success(t('transferSuccess'));
            router.refresh();
        },
        onError: (error) => {
            toast.error(error.message || t('transferError'));
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError('Please enter a valid positive number');
            return;
        }
        if (numAmount > (user?.advertiserBalance ?? 0)) {
            setError('Insufficient funds in blogger account');
            return;
        }
        const feeAmount = transferFee ? (numAmount * transferFee / 100) : 0;
        const amountAfterFee = numAmount - feeAmount;
        transferMoney({ amount: numAmount, amountAfterFee });
    };

    return (
        <Dialog onOpenChange={setOpen} open={open} modal>
            <DialogTrigger asChild>
                <div>{children}</div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] w-full mx-4 sm:mx-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl sm:text-2xl font-bold text-center mb-4">
                        <Translate namespace='Advertiser' itemKey='transferMoney' />
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col sm:flex-row justify-between mb-6">
                    <div className="space-y-2 mb-4 sm:mb-0">
                        <div>
                            <span className="text-md font-medium">
                                <Translate namespace='Default' itemKey='advertiserBalance' />:
                            </span>
                            <span className="text-lg font-bold ml-2">{user?.advertiserBalance ?? 0} ₴</span>
                        </div>
                        <div>
                            <span className="text-md font-medium">
                                <Translate namespace='Default' itemKey='bloggerBalance' />:
                            </span>
                            <span className="text-lg font-bold ml-2">{user?.bloggerBalance ?? 0} ₴</span>
                        </div>
                    </div>
                    <div className="space-y-2 text-right">
                        <div>
                            <span className="text-md font-medium">
                                <Translate namespace='Default' itemKey='advertiserBalance' />:
                            </span>
                            <span className="text-lg text-rose-500 font-bold ml-2">{newAdvertiserBalance.toFixed(2)} ₴</span>
                        </div>
                        <div>
                            <span className="text-md font-medium">
                                <Translate namespace='Default' itemKey='bloggerBalance' />:
                            </span>
                            <span className="text-lg text-green-500 font-bold ml-2">{newBloggerBalance.toFixed(2)} ₴</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Input
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="1000₴"
                            className="pr-12 text-lg"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">₴</span>
                    </div>
                    <div className='flex items-center'>
                        {typeof transferFee === 'number' && transferFee > 0 && (
                            <div className="text-sm text-gray-600">
                                <p><Translate namespace='Default' itemKey='fee' />: {transferFee}%</p>
                                {amount && (
                                    <p>
                                        <Translate namespace='Default' itemKey='afterFee' />: {(parseFloat(amount) * (1 - transferFee / 100)).toFixed(2)} ₴
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    {error1 && <ServerErrorMessage errorCode={error1} />}
                    <div className="flex justify-center">
                        <Button
                            variant={'default'} 
                            type="submit" 
                            disabled={isLoading || !!error1} 
                            className="w-full sm:max-w-xs font-bold py-2 px-4"
                        >
                            <Translate namespace='Advertiser' itemKey='transfer' />
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default TransferMoneyModal
