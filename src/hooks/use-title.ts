import { useEffect, useState } from 'react';

export function useTitle(text: string) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) document.title = text;
    }, [mounted]);
}
