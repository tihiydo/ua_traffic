import { type Route, routes, adminRoutes, moderRoutes } from "@/routes";

export const navLinksClient: Array<Route> = [routes.catalog, routes.advertiser, routes.blogger, routes.blog]
export const navLinksOther: Array<Route> = [routes.catalog, routes.advertiser, routes.blogger]
export const navLinksAdmin: Array<Route> = [adminRoutes.main, adminRoutes.billing, adminRoutes.chats, adminRoutes.users, adminRoutes.moderation, adminRoutes.notifications, adminRoutes.igCookies, adminRoutes.fees, adminRoutes.blog]
export const navLinksModer: Array<Route> = [moderRoutes.chats, moderRoutes.users, moderRoutes.moderation, moderRoutes.igCookies]
export const navLinksGuest: Array<Route> = [routes.blog, routes.catalog, routes.signIn, routes.signUp]; 
