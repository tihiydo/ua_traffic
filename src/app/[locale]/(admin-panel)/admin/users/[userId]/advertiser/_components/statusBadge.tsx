import { twMerge } from "tailwind-merge";
import { type AdvertismentStatus } from "./columns";

type Props = {
  status: AdvertismentStatus;
};

type StatusMapItem = {
  className: string;
  title: string;
};
const statusMap: Record<AdvertismentStatus, StatusMapItem> = {
    accepted: {
        title: "Прийнято",
        className: "bg-blue",
    },
    cancelled: {
        title: "Відхилено",
        className: "bg-red",
    },

    new: {
        title: "Нова",
        className: "bg-yellow-secondary",
    },
    success: {
        title: "Виконано",
        className: "bg-light-green",
    },
    return: {
        title: "Повернення",
        className: "bg-gray-secondary",
    },
};

const StatusBadge = ({ status }: Props) => {
    const statusData = statusMap[status];
    return (
        <div
            className={twMerge(
                "w-full rounded-[50px] text-center text-sm py-1 px-3 max-w-[150px]",
                statusData.className,
            )}
        >
            {statusData.title}
        </div>
    );
};

export default StatusBadge;