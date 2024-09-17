import React from 'react'
import { type BloggerStatus } from '@prisma/client';
import DeclinedMessageTooltip from './declined-message-tooltip';
import AcceptBloggerModal from './accept-blogger-modal';
import { type Blogger } from '@/database/blogger';
import DeclineBloggerModal from './decline-blogger-modal';
import DisactivateBloggerButton from './disactivate-blogger-button';
import ActivateBloggerButton from './activate-blogger-button';


type Props = {
    blogger: Blogger
}

const StatusModerationCell = ({ blogger }: Props) => {
    const bloggerStatusMap: Record<BloggerStatus, React.ReactNode> = {
        Active: <DisactivateBloggerButton blogger={blogger} />,
        Inactive: <ActivateBloggerButton blogger={blogger} />,
        Moderating: <div className="flex">
            <AcceptBloggerModal blogger={blogger} isLoading={false} />

            <DeclineBloggerModal blogger={blogger} />
        </div>,
        Declined: <DeclinedMessageTooltip message={blogger.declinedMessage ?? ''} />
    }

    return bloggerStatusMap[blogger.status];
}

export default StatusModerationCell