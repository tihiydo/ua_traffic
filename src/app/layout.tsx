import { type Metadata } from "next";

type Props = {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: "UATRAFFIC"
}

const Layout = ({ children }: Props) => {
    return children
}

export default Layout