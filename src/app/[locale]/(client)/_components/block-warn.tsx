import Translate from '@/components/Translate'
import InfoMessage from '@/components/ui/custom/info-message'
import React from 'react'

type Props = {}

const BlockWarn = (props: Props) => 
{
    return (
        <InfoMessage variant={'warning'} size={'sm'} closable={false} className="my-8 h-24">
            <p className="font-bold mb-2"><Translate namespace='Messages' itemKey='block-warn-title'/></p>
            <Translate namespace='Messages' itemKey='block-warn-description'/>
        </InfoMessage>
    )
}

export default BlockWarn