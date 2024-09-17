'use client'

import { Button } from "@/components/ui/button";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import { useRouter } from "@/i18n/navigation"
import { createMessage } from "@/modules/translate-protocol";
import { NOTIFICATION_CODES } from "@/modules/translate-protocol/constants/notifications";
import { routes } from "@/routes";
import { api } from "@/trpc/react";
import { type WithdrawTransaction } from "@prisma/client";
import { format } from "date-fns";
import { toast } from "react-toastify";

type Props = {
    transaction: WithdrawTransaction
}

const MarkAsDoneButton = ({ transaction }: Props) => {
    const router = useRouter();
    const notify = api.notification.createNotification.useMutation();
    const { data: fee } = api.fee.getFee.useQuery({ type: "Widthdraw" });

    const { isLoading, mutate } = api.admin.withdrawTransaction.markAsDone.useMutation({
        onSuccess: () => {
            const amountWithFee = fee 
                ? transaction.amount * (1 - fee / 100) 
                : transaction.amount;

            notify.mutate({
                recipients: {
                    data: [transaction.userId]
                },
                notificationType: 'Blogger',
                additionalHref: routes.blogger.subRoutes.billing.link,
                text: createMessage({
                    kind: 'code',
                    code: NOTIFICATION_CODES.BLOGGER_WITHDRAW_REQ_PAID,
                    values: {
                        date: format(transaction.createdAt, 'dd.MM.yy HH.mm'),
                        amount: amountWithFee.toFixed(2)
                    }
                }), 
                notifyOptions: {
                    email: true,
                    telegram: true
                }
            })
            router.refresh();
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });

    return (
        <Button
            disabled={isLoading}
            variant={'success'}
            className="font-bold"
            onClick={() => {
                mutate({ transactionId: transaction.id })
            }}
        >
            {isLoading && <SpinnerLoading className="mr-2" />}
            Оплатити
        </Button>
    )
}

export default MarkAsDoneButton