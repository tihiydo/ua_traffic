import { type ReviewStatus } from "@prisma/client"
import StatusBadge from "./status-badge";
import Translate from "@/components/Translate";

type Props = {
    className?: string;
    children?: React.ReactNode;
    status: ReviewStatus;
}

const ReviewStatusBadge = ({ status }: Props) => {
    if (status === 'Approved') {
        return (
            <StatusBadge className={'bg-light-green'}>
                <Translate namespace="Blogger-Status" itemKey="Active" />
            </StatusBadge>
        )
    }

    if (status === 'Pending') {
        return (
            <StatusBadge className={'bg-gray-secondary'}>
                <Translate namespace="Blogger-Status" itemKey="Inactive" />
            </StatusBadge>
        )
    }

    if (status === 'Rejected') {
        return (
            <StatusBadge className={'bg-red'}>
                <Translate namespace="Blogger-Status" itemKey="Declined" />
            </StatusBadge>
        )
    }
}

export default ReviewStatusBadge