import { type AdvertismentRequestStatus } from "@prisma/client";
import StatusBadge from "./status-badge";
import Translate from "@/components/Translate";

type Props = {
    className?: string;
    children?: React.ReactNode;
    status: AdvertismentRequestStatus;
}

const AdvertismentRequestStatusBadge = ({ status }: Props) => {
    if (status === 'Accepted') {
        return (
            <StatusBadge className={'bg-blue'}>
                <Translate namespace="Advertisment-Request-Status" itemKey="Accepted" />
            </StatusBadge>
        )
    }

    if (status === 'Declined') {
        return (
            <StatusBadge className={'bg-red'}>
                <Translate namespace="Advertisment-Request-Status" itemKey="Declined" />
            </StatusBadge>
        )
    }

    if (status === 'Moderating') {
        return (
            <StatusBadge className={'bg-yellow-secondary'}>
                <Translate namespace="Advertisment-Request-Status" itemKey="Moderating" />
            </StatusBadge>
        )
    }

    if (status === 'Done') {
        return (
            <StatusBadge className={'bg-light-green'}>
                <Translate namespace="Advertisment-Request-Status" itemKey="Done" />
            </StatusBadge>
        )
    }

    if (status === 'New') {
        return (
            <StatusBadge className={'bg-yellow-secondary'}>
                <Translate namespace="Advertisment-Request-Status" itemKey="New" />
            </StatusBadge>
        )
    }
}

export default AdvertismentRequestStatusBadge