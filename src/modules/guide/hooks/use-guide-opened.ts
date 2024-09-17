import { useEffect, useState } from "react";
import { useGuideStore } from ".."
import { useScreenSize } from "@/hooks/use-screen-size";

export const useGuideOpened = () => {
    const isOpened = useGuideStore(state => state.isOpened);
    const { width } = useScreenSize();
    const [isActuallyOpened, setIsActuallyOpened] = useState(false);

    useEffect(() => {
        if (!isOpened || width < 900) {
            return setIsActuallyOpened(false)
        }

        setIsActuallyOpened(true)
    }, [isOpened, width])


    return isActuallyOpened
}