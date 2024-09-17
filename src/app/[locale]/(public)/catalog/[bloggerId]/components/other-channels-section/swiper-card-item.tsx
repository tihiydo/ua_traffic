import React from "react";

type Props = {
    icon: React.ReactNode;
    content: React.ReactNode;
};

const SwiperCardItem = ({ icon, content }: Props) => {
    return (
        <div className="flex gap-2">
            <div className="text-yellow">{icon}</div>

            {content}
        </div>
    );
};

export default SwiperCardItem;
