import { getWindow } from '@/utils/window';
import { useState, useEffect } from 'react';

export const useScreenSize = () => {
    const window = getWindow();

    const [screenSize, setScreenSize] = useState({
        width: window?.innerWidth ?? 0,
        height: window?.innerHeight ?? 0,
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window?.innerWidth ?? 0,
                height: window?.innerHeight ?? 0,
            });
        };

        window?.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window?.removeEventListener('resize', handleResize);
        };
    }, []);

    return screenSize;
};
