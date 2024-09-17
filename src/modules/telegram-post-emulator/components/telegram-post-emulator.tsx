import React from 'react'
import { twMerge } from 'tailwind-merge';
import Background from './background';
import SendMessageButton from './send-message-button';
import Message from './message';
import type { InlineKeyboardItem, AnyMediaItem } from '../types';
import EmulatorContextProvider from './emulator-context';
import Image from 'next/image';
import phone from '@/assets/images/phone-mock.png'

type Props = {
    className?: string;
    inlineKeyboard: InlineKeyboardItem[];
    media: AnyMediaItem[];
    content: string;
    disabled?: boolean;
}

const TelegramPostEmulator = ({
    className,
    content,
    inlineKeyboard,
    media,
    disabled
}: Props) => {
    return (
        <EmulatorContextProvider value={{ buttons: inlineKeyboard, content: content, media: media, disabled }}>
            <div className='w-full flex items-center justify-center'>
                <div className='relative'>
                    <div className="w-[263px] absolute z-50 pointer-events-none">
                        <Image src={phone} alt="phone-mockup" />
                    </div>
                    <div>
                        <div className={twMerge('relative h-[533px] overflow-x-hidden overflow-y-auto rounded-[4.6rem] w-[263px] flex items-end bg-gray py-2 px-1', className)}>
                            <Background />

                            <div className='z-[10] w-full px-6 py-4'>
                                <div className='h-[410px] flex flex-col  overflow-y-auto no-scrollbar'>
                                    <div className='flex-1 '></div>
                                    <Message />
                                </div>
                                <SendMessageButton className='mt-[0.25rem]' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </EmulatorContextProvider>

    )
}

export default TelegramPostEmulator
