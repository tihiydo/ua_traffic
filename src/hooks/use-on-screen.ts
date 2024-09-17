import { useEffect, useState } from 'react';



const useOnScreen = (ref: React.RefObject<HTMLElement>, rootMargin: `${number}px` = '0px') => {
    const [isOnScreen, setIsOnScreen] = useState(false);

    useEffect(() => {
        const refCurrent = ref.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry) return
                setIsOnScreen(entry.isIntersecting);
            },
            {
                rootMargin,
            }
        );

        if (refCurrent) {
            observer.observe(ref.current);
        }

        return () => {
            if (refCurrent) {
                observer.unobserve(refCurrent);
            }
        };
    }, [ref, rootMargin]);

    return isOnScreen;
};

export default useOnScreen;
