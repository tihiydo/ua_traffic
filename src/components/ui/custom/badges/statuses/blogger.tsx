import { type BloggerStatus } from "@prisma/client"
import StatusBadge from "./status-badge";
import Translate from "@/components/Translate";

type Props = {
    className?: string;
    children?: React.ReactNode;
    status: BloggerStatus;
}

const AdvertismentPostStatusBadge = ({ status }: Props) => {
    if (status === 'Active') {
        return (
            <StatusBadge className={'bg-light-green'}>
                <Translate namespace="Blogger-Status" itemKey="Active" />
            </StatusBadge>
        )
    }

    if (status === 'Inactive') {
        return (
            <StatusBadge className={'bg-gray-secondary'}>
                <Translate namespace="Blogger-Status" itemKey="Inactive" />
            </StatusBadge>
        )
    }

    if (status === 'Declined') {
        return (
            <StatusBadge className={'bg-red'}>
                <Translate namespace="Blogger-Status" itemKey="Declined" />
            </StatusBadge>
        )
    }

    if (status === 'Moderating') {
        return (
            <StatusBadge className={'bg-yellow-secondary'}>
                <Translate namespace="Blogger-Status" itemKey="Moderating" />
            </StatusBadge>
        )
    }
}

export default AdvertismentPostStatusBadge