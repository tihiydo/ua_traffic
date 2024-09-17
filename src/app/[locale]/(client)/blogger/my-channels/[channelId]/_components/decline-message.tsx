import Translate from '@/components/Translate';
import InfoMessage from '@/components/ui/custom/info-message';
import React from 'react'

type Props = {
    message: string;
}

const DeclinedMessage = ({ message }: Props) => {
    return (
        <InfoMessage variant={'error'}>
            <Translate namespace='Blogger' itemKey='channel-declined' />{'. '} {message}
        </InfoMessage>
    )
}

export default DeclinedMessage;