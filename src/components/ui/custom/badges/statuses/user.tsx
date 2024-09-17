import StatusBadge from "./status-badge";
import Translate from "@/components/Translate";

type Props = {
    className?: string;
    children?: React.ReactNode;
    status: boolean;
}

const UserStatusBadge = ({ status }: Props) => {
    if (!status) {
        return (
            <StatusBadge className={'bg-light-green'}>
                <Translate namespace="Blogger-Status" itemKey="Active" />
            </StatusBadge>
        )
    }

    if (status) {
        return (
            <StatusBadge className={'bg-gray-secondary'}>
                <Translate namespace="Blogger-Status" itemKey="Inactive" />
            </StatusBadge>
        )
    }
}

export default UserStatusBadge