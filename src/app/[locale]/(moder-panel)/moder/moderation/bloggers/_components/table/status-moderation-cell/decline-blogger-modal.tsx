import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import SpinnerLoading from "@/components/ui/custom/spinner-loading";
import { useUpdateBlogger } from "./use-update-blogger";
import { NOTIFICATION_CODES } from "@/modules/translate-protocol/constants/notifications";
import { createMessage } from "@/modules/translate-protocol";
import { routes } from "@/routes";
import { type Blogger } from "@/database/blogger";


type Props = {
    blogger: Blogger;
}

const DeclineBloggerModal = ({ blogger }: Props) => {
    const [declineMessage, setDeclineMessage] = useState('');
    const notify = api.notification.createNotification.useMutation();
    const [open, setOpen] = useState<boolean>(false);
    const updateBlogger = useUpdateBlogger();
    const declineBlogger = api.admin.blogger.declineBlogger.useMutation({
        onSuccess: (blogger) => {
            setOpen(false)
            updateBlogger(blogger);

            notify.mutate({
                text: createMessage({
                    kind: 'code',
                    code: NOTIFICATION_CODES.BLOGGER_DECLINED,
                    values: {
                        channel: `@${blogger.username}`
                    }
                }),
                recipients: {
                    data: [blogger.userId]
                },
                notificationType: 'Blogger',
                additionalHref: `${routes.blogger.subRoutes.myChannels.link}/${blogger.id}`,
            })
        }
    });

    return (
        <Dialog
            open={open}
            onOpenChange={(openState) => {
                setOpen(openState);
            }}
        >
            <DialogTrigger asChild>
                <Button
                    onClick={() => setOpen(true)}
                    className="mx-1 font-bold"
                    variant={'cancel'}
                >
                    Відхилити
                </Button >
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Відхилення каналу</DialogTitle>

                </DialogHeader>

                <div>
                    <div className="mb-4">
                        <Label className="mb-1.5 block font-bold">Причина відхилення</Label>
                        <Textarea
                            onChange={(e) => {
                                setDeclineMessage(e.target.value);
                            }}
                        />
                    </div>

                    <Button
                        variant={'destructive'}
                        disabled={declineMessage.length === 0 || declineBlogger.isLoading}
                        onClick={() => {
                            declineBlogger.mutate({
                                bloggerId: blogger.id,
                                declineMessage
                            })
                        }}
                    >
                        {declineBlogger.isLoading && <SpinnerLoading className="mr-2" />}

                        Відхилити
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default DeclineBloggerModal