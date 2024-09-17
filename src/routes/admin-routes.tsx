import { type Route } from "@/routes";

type AdminRoutes = {
    main: Route;
    billing: Route;
    chats: Route;
    users: Route;
    blog: Route;
    igCookies: Route;
    fees: Route
    notifications: Route;
    moderation: Route & {
        subRoutes: {
            bloggers: Route;
            posts: Route;
            requests: Route;
        }
    };
}

export const adminRoutes: AdminRoutes = {
    billing: {
        link: "/admin/billing",
        name: 'Біллінг'
    },
    chats: {
        link: "/admin/chatlist",
        name: 'Чати'
    },
    users: {
        link: "/admin/users",
        name: 'Користувачі'
    },
    igCookies: {
        link: '/admin/ig-cookies',
        name: 'Inst Cookie'
    },
    fees: {
        link: '/admin/fees',
        name: 'Комісії'
    },
    notifications: {
        link: '/admin/notifications',
        name: "Сповіщення"
    },
    main: {
        link: "/admin/main",
        name: 'Головна',
    },
    blog: {
        link: "/admin/blog",
        name: 'Блог'
    },
    moderation: {
        base: "/admin/moderation",
        link: "/admin/moderation/bloggers",
        name: 'Модерація',
        subRoutes: {
            bloggers: {
                link: "/admin/moderation/bloggers",
                name: "Блогери",
            },
            posts: {
                link: "/admin/moderation/advertisments",
                name: "Блогери",
            },
            requests: {
                link: '/admin/moderation/adv-requests',
                name: 'Рекламні заявки'
            }
        }
    },
}


type ModerRoutes = {
    chats: Route;
    users: Route;
    igCookies: Route;
    moderation: Route & {
        subRoutes: {
            bloggers: Route;
            posts: Route;
            requests: Route;
        }
    };
}

export const moderRoutes: ModerRoutes = {
    chats: {
        link: "/moder/chatlist",
        name: 'Чати'
    },
    users: {
        link: "/moder/users",
        name: 'Користувачі'
    },
    igCookies: {
        link: '/moder/ig-cookies',
        name: 'Instagram Cookie'
    },
    moderation: {
        base: "/moder/moderation",
        link: "/moder/moderation/bloggers",
        name: 'Модерація',
        subRoutes: {
            bloggers: {
                link: "/moder/moderation/bloggers",
                name: "Блогери",
            },
            posts: {
                link: "/moder/moderation/advertisments",
                name: "Блогери",
            },
            requests: {
                link: '/moder/moderation/adv-requests',
                name: 'Рекламні заявки'
            }
        }
    },
}
