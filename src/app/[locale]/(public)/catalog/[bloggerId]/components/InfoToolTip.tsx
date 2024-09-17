import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

const InfoTooltip: React.FC<{ message: string }> = ({ message }) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger className="absolute top-2 right-2">
                <InfoIcon size={24} className='text-gray-last' />
            </TooltipTrigger>
            <TooltipContent>
                <p className="max-w-[200px]">{message}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

export default InfoTooltip;