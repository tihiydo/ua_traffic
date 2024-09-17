import Translate from '@/components/Translate'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image, { type StaticImageData } from 'next/image'
import React, { type ReactNode } from 'react'

type Props = {
    onClick?: () => void;
    img: StaticImageData | string;
    content: string | ReactNode;
}

const VerificationCard = ({ onClick, img, content }: Props) => {
    return (
        <Card className="py-6 border-[#F4F5F5] shadow-md max-w-[25rem] w-[100%] max-h-[25rem] h-[100%] text-center flex justify-center items-center">
            <CardContent className="">
                <Image src={img} alt="Верифікуйте інстаграм" style={{ margin: "0 auto" }}></Image>
                <p className='w-[100%] font-title uppercase mt-6'>{content}</p>
                <Button className='mt-6' onClick={onClick}><Translate namespace='Blogger' itemKey='verif'/></Button>
            </CardContent>
        </Card>
    )
}

export default VerificationCard