import Translate from '@/components/Translate';
import { Button } from '@/components/ui/button';
import { env } from '@/env.mjs';
import { SearchX } from 'lucide-react';
import Link from 'next/link';

export default async function NotFound() {

    return (
        <div className="min-h-screen flex justify-center h-full items-center bg-black text-white">
            <div className="flex md:flex-row flex-col">
                <div className="w-fit max-h-[15rem] flex items-center self-center">
                    <SearchX size="180px" strokeWidth={2.0} />
                </div>
                <div className="w-full  max-h-[15rem] p-2 md:p-5 py-10 relative text-center md:text-left">
                    <div className="font-title md:text-4xl text-2xl font-bold">UATRAFFIC /404</div>
                    <div className="font-content text-base font-light mt-4">
                        <Translate namespace='Not-Found' itemKey='title' />
                    </div>
                    <Link href={env.NEXT_PUBLIC_SITE_URL}>
                        <Button className="w-full md:w-fit   md:mt-0 mt-[2rem] md:absolute bottom-2 text-black text-left">
                            <Translate namespace='Not-Found' itemKey='back-link' />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}