import React from 'react'
import { Header } from '@/components/header';
import { Footer } from '../../_components/footer';

type Props = {
    children: React.ReactNode;
}

const InfoLayout = ({ children }: Props) => {
    return (
        <div className='flex flex-col min-h-screen h-full'>
            <Header />

            <main className='flex-1 h-full'>
                {children}
            </main>

            <Footer />
        </div>
    )
}

export default InfoLayout