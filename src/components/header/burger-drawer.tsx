'use client'

import { Spin as Hamburger } from 'hamburger-react'
import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '../ui/navbar-sheet';
import { usePathname } from '@/i18n/navigation';

type Props = {
    children: React.ReactNode;
}

const BurgerDrawer = ({ children }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false)
    }, [pathname]);

    return (
        <Sheet onOpenChange={setIsOpen} open={isOpen}>
            <SheetTrigger onClick={() => setIsOpen(!isOpen)}>
                <Hamburger toggled={isOpen} />
            </SheetTrigger>
            <SheetContent side={'left'} className='text-main p-2 pt-[1.3rem]'>
                {children}
            </SheetContent>
        </Sheet>
    )
}

export default BurgerDrawer