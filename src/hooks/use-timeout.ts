import { useEffect, useRef, useState } from 'react';

type TimeoutStatus = 'idle' | 'running' | 'paused';

interface TimeoutOptions {
    immediate?: boolean;
}

const useTimeout = (callback: () => void, delay: number, options?: TimeoutOptions) => {
    const [status, setStatus] = useState<TimeoutStatus>('idle');
    const savedCallback = useRef<() => void>();
    const timer = useRef<NodeJS.Timeout>();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    const start = () => {
        if (status !== 'running') {
            setStatus('running');
            timer.current = setTimeout(() => {
                savedCallback.current && savedCallback.current();
                setStatus('idle');
            }, delay);
        }
    };

    const reset = () => {
        if (status === 'running') {
            clearTimeout(timer.current!);
            setStatus('idle');
            start();
        }
    };

    const pause = () => {
        if (status === 'running') {
            clearTimeout(timer.current!);
            setStatus('paused');
        }
    };

    const resume = () => {
        if (status === 'paused') {
            setStatus('running');
            timer.current = setTimeout(() => {
                savedCallback.current && savedCallback.current();
                setStatus('idle');
            }, delay);
        }
    };

    useEffect(() => {
        if (options?.immediate) {
            start();
        }
        return () => {
            clearTimeout(timer.current!);
        };
    }, []);

    return { start, reset, pause, resume, status };
};

export default useTimeout;