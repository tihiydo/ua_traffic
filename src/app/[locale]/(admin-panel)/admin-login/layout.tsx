import React from "react";
import { Footer } from "../../_components/footer";
import { redirect } from "@/i18n/navigation";
import { getServerSession } from "next-auth";
import { Header } from "@/components/header";
import { authOptions } from "@/server/auth";

type Props = {
    children: React.ReactNode;
};

const AdminLoginLayout = async ({ children }: Props) => 
{
    const session = await getServerSession(authOptions);

    if (session?.user.id == "ADMIN") 
    {
        redirect('/admin')
    }
    else if(session?.user.id == "MODER")
    {
        redirect("/moder")
    }

    return (
        <>
            <div className="flex flex-col min-h-screen p-3 pt-0 md:pt-0 md:p-12">
                <Header />
                {children}
            </div>
            <Footer />
        </>
    )
};

export default AdminLoginLayout;
