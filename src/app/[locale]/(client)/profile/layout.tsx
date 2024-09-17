import React from "react";
import ProfileNavBar from "./_components/profile-nav-bar";
import ProfileSidebar from "./_components/profile-sidebar";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {       
    return (
        <div className="flex h-screen">
            <div className="hidden lg:block">
                <ProfileSidebar />
            </div>
            <div className="flex-1 overflow-x-hidden flex flex-col">
                <div className="flex-1 p-4 lg:mb-[54px] lg:ml-[25px] lg:mr-[25px] max-w-full">
                    <div className="lg:hidden">
                        <ProfileNavBar />
                    </div>
                    <div className="mt-6">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Layout;