'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from "@/components/ui/button";
import Translate from '@/components/Translate';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { toast } from 'react-toastify';
import { api } from '@/trpc/react';
import { useErrorTranslate } from '@/hooks/use-error';
import { type Chat } from '@prisma/client';
import { useRouter } from 'next/router';

const TelegramSupportModal = () => {
    const [open, setOpen] = useState(false);
    const [showCommissionRequest, setShowCommissionRequest] = useState(false);
    const [commissionType, setCommissionType] = useState('');

    const translateError = useErrorTranslate();
    const { mutate, isLoading } = api.chat.chatWithAdmin.useMutation({
        onSuccess: (chat: Chat) => {
            console.log('Chat with admin created:', chat);
            toast.success(<Translate namespace="Default" itemKey="chatCreatedSuccess" />);
            setOpen(false);
        },
        onError: ({ message }) => {
            toast.error(translateError(message));
        }
    });

    const handleCommissionRequest = () => {
        if (commissionType) {
            mutate({ commissionType: commissionType as "deposit" | "withdrawal" | "transfer" });
        } else {
            toast.error(<Translate namespace="Default" itemKey="pleaseSelectCommissionType" />);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setShowCommissionRequest(false);
            setCommissionType('');
        }
        setOpen(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="default" className="w-full">
                    <Translate namespace="Constructor" itemKey="telegram-support" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {showCommissionRequest ? (
                            <Translate namespace="Default" itemKey="commissionChangeRequest" />
                        ) : (
                            <Translate namespace="Default" itemKey="supportOptions" />
                        )}
                    </DialogTitle>
                </DialogHeader>
                {!showCommissionRequest ? (
                    <div className="flex flex-col space-y-4">
                        <Button onClick={() => window.open('https://t.me/uatraffic_support', '_blank')}>
                            <Translate namespace="Constructor" itemKey="telegram-support" />
                        </Button>
                        <Button onClick={() => setShowCommissionRequest(true)}>
                            <Translate namespace="Default" itemKey="requestCommissionChange" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col space-y-4">
                        <Select onValueChange={setCommissionType} value={commissionType}>
                            <SelectTrigger>
                                <SelectValue placeholder={<Translate namespace="Default" itemKey="selectCommissionType" />} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="deposit"><Translate namespace="Default" itemKey="deposit" /></SelectItem>
                                <SelectItem value="withdrawal"><Translate namespace="Default" itemKey="withdrawal" /></SelectItem>
                                <SelectItem value="transfer"><Translate namespace="Default" itemKey="transfer" /></SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleCommissionRequest} disabled={isLoading}>
                            {isLoading && <SpinnerLoading className='mr-2' />}
                            <Translate namespace="Default" itemKey="send" />
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default TelegramSupportModal;