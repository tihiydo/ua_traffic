import React from 'react'
import InlineKeyboard from './inline-keyboard'
import MediaGrid from './media-grid'
import { useEmulatorContext } from './emulator-context'
import Translate from '@/components/Translate'
import '../styles/message.css'

type Props = {

}

const Message = ({ }: Props) => {
    const { buttons, content, media } = useEmulatorContext()

    return (
        <div>
            <div className='p-2 rounded-lg bg-white !select-text'>
                <MediaGrid />
                {content ? (
                    <div className='text-sm text-left break-words tg-message' dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                    !media.length ? (
                        <div className='text-sm text-center break-words'>
                            <Translate namespace='Constructor' itemKey='telegram-start-typing' />
                        </div>
                    ) : (
                        null
                    )
                )}

            </div>
            {media.length <= 1 && (
                <InlineKeyboard items={buttons} />
            )}
        </div>
    )
}

export default React.memo(Message)