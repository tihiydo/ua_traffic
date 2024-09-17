import { type Blogger } from '@/database/blogger'
import React from 'react'
import InstagramForceBloggerEditForm from './instagram-edit-force-blogger-form copy';
import TelegramForceBloggerEditForm from './telegram-edit-force-blogger-form';

type Props = {
    blogger: Blogger;
}

const ForceBloggerEditForm = ({ blogger }: Props) => {
    if (!blogger.fake) return null; 
    
    if (blogger.type === 'Instagram') {
        return <InstagramForceBloggerEditForm blogger={blogger} />
    }

    if (blogger.type === 'Telegram') {
        return <TelegramForceBloggerEditForm isLoading={false} blogger={blogger} />
    }
}

export default ForceBloggerEditForm