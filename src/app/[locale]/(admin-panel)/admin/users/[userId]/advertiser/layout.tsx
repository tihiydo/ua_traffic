"use client"

import React from "react";
import AdvertiserNavBar from "./_components/advertiser-nav-bar";

type Props = {
    children: React.ReactNode;
    params:
    {
        userId: string
    }
};

const AdvertiserLayout = (props: Props) => {
    return (
        <div className="mb-8 mt-3">
            <div>
                {/* <div className="mb-5">
                    <PageTitle><Translate namespace="Advertiser" itemKey="title"/></PageTitle>
                </div> */}

                <AdvertiserNavBar userId={props.params.userId} />
            </div>

            <div className="mt-6">{props.children}</div>
        </div>
    );
};

export default AdvertiserLayout;
