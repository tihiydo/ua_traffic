import { type AdvertismentPostStatus } from "@prisma/client";
import StatusBadge from "./status-badge";
import Translate from "@/components/Translate";
import { cn } from "@/lib/utils";

type Props = {
    className?: string;
    children?: React.ReactNode;
    status: AdvertismentPostStatus;
}

const AdvertismentPostStatusBadge = ({ status, className }: Props) => {
    if (status === 'Accepted') {
        return (
            <StatusBadge className={cn('bg-light-green', className)}>
                <Translate namespace="Advertisment-Post-Status" itemKey="Accepted" />
            </StatusBadge>
        )
    }

    if (status === 'Declined') {
        return (
            <StatusBadge className={cn('bg-red', className)}>
                <Translate namespace="Advertisment-Post-Status" itemKey="Declined" />
            </StatusBadge>
        )
    }

    if (status === 'Moderating') {
        return (
            <StatusBadge className={cn('bg-yellow-secondary', className)}>
                <Translate namespace="Advertisment-Post-Status" itemKey="Moderating" />
            </StatusBadge>
        )
    }
}

export default AdvertismentPostStatusBadge