import React from "react";
import { Footer } from "../../_components/footer";
import { redirect } from "@/i18n/navigation";
import { getServerSession } from "next-auth";
import { AdminHeader } from "@/components/header";
import { authOptions } from "@/server/auth";

type Props = {
    children: React.ReactNode;
};

const AdminLayout = async ({ children }: Props) => {
    const session = await getServerSession(authOptions);

    if (session?.user.id !== "ADMIN" && session?.user.id !== "MODER") {
        redirect('/admin-login')
    } else if (session?.user.id == "MODER") {
        redirect('/moder')
    }
    return (
        <>
            <div className="flex flex-col min-h-screen select-text">
                <AdminHeader />
                <main className="flex-1 h-full mb-[1rem] min-h-screen">
                    {children}
                </main>
                <Footer />
            </div>
        </>
    )
};

export default AdminLayout;
