import React from 'react'
import VerificationCard from '../../verification-card'
import instagramBigIcon from "@//assets/images/instagram.png";
import Translate from '@/components/Translate';


type Props = {
    onVerify: () => void; 
    isVerifying: boolean;
}

const InstagramVerifyCard = ({ isVerifying, onVerify }: Props) => {
    return <>
        <div className='flex justify-center items-center h-[32rem]'>
            <VerificationCard
                img={instagramBigIcon}
                content={<Translate namespace='Blogger' itemKey='verifinst' />}
                onClick={() => onVerify()}
            />
        </div>

        <div className={`${isVerifying ? 'block' : 'hidden'} fixed inset-0 overflow-hidden bg-black bg-opacity-50 backdrop-blur-md z-[9998] w-full h-full`}></div>
    </>

}

export default InstagramVerifyCard