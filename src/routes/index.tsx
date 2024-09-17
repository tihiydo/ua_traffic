'use client'

import { usePathname } from '@/i18n/navigation';


export type Route = {
    link: `/${string}`
    base?: `/${string}`
    name: React.ReactNode;
    subRoutes?: Record<string, Route>;
    activate?: (pathname: string) => boolean;
}

type Props = {
    children?: (args: { isActive: boolean }) => React.ReactNode;
    route: Route;
}

export const NavLink = ({ children, route }: Props) => {
    const pathname = usePathname();

    const defaultActivate = (pathname: string) => (
        route.base
            ? pathname.startsWith(route.base)
            : pathname.startsWith(route.link)
    )

    const isActive = route.activate
        ? route.activate(pathname)
        : defaultActivate(pathname)

    return children?.({ ...route, isActive })
}

export { routes } from './routes';
export { adminRoutes } from './admin-routes';
export { moderRoutes } from './admin-routes';