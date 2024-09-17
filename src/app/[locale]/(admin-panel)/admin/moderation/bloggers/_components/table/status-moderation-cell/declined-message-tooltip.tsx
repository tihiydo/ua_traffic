import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react";

type Props = {
    message: string;
}

const DeclinedMessageTooltip = ({ message }: Props) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="text-destructive flex items-center gap-1 font-bold">
                    <InfoIcon />
                    Відхилено
                </TooltipTrigger>
                <TooltipContent>
                    <p className="max-w-[400px]">{message}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default DeclinedMessageTooltip