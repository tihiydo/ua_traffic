import React, { Children } from 'react'
import NotificationCardSkeleton from './notification-card-skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import Translate from '@/components/Translate';
import { BellOff } from 'lucide-react';

type Props = {
    isLoading?: boolean;
    children?: React.ReactNode;
}
const NotificationsTab = ({ children, isLoading }: Props) => {
    return (
        <ScrollArea className='h-[280px]'>
            {isLoading ? (
                Array(3).fill(null).map((_, index) => (
                    <NotificationCardSkeleton key={index} />
                ))
            ) : Children.count(children) === 0
                ? (
                    <div style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
                        <div className="flex flex-col items-center text-center text-nowrap">
                            <BellOff size={48} strokeWidth={2} className="text-yellow mb-2"/>
                            <Translate namespace='Notifications' itemKey='no-notifications' />
                        </div>
                    </div>





                )
                : children}
        </ScrollArea>
    )
}

export default NotificationsTab