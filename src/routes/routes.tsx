import React from "react";
import Translate from "@/components/Translate";
import { type Route } from "@/routes";

// * Expected usage:
// if url starts with `base` then nav link should highlight
// if base not defined then do the same thing with `link`


type Rotues = {
    signIn: Route;
    signUp: Route;
    catalog: Route;
    blog: Route;
    profile: Route & {
        subRoutes: {
            settings: Route
            profile: Route;
            referral: Route;
            other: Route;
        }
    }
    advertiser: Route & {
        subRoutes: {
            myRequests: Route;
            myPosts: Route;
            newPost: Route;
            billing: Route;
            chats: Route;
            dashboard: Route;
        }
    }
    blogger: Route & {
        subRoutes: {
            dashboard: Route;
            myRequests: Route;
            myChannels: Route;
            newChannel: Route;
            billing: Route;
            chats: Route;
        }
    }
}

export const routes: Rotues = {
    signIn: {
        link: "/login",
        name: <Translate namespace="Nav-Links" itemKey="sign-in" />,
    },

    blog: {
        link: "/blog",
        name: <Translate namespace="Blog" itemKey="navname" />,
        activate: (pathname) => pathname.startsWith('/blog') && !pathname.startsWith('/blogger')
    },

    signUp: {
        link: "/sign-up",
        name: <Translate namespace="Nav-Links" itemKey="sign-up" />,
    },
    catalog: {
        link: '/catalog',
        name: <Translate namespace="Catalogue" itemKey="navname" />
    },

    profile: {
        link: '/profile',
        name: <Translate namespace="Profile" itemKey="namespace" />,
        subRoutes: {
            referral:
            {
                link: '/profile/referral',
                name: <Translate namespace="Profile.Referral" itemKey="navname" />
            },
            settings: {
                link: '/profile/settings',
                name: <Translate namespace="Profile" itemKey="settings" />
            },
            other: {
                link: '/profile/other',
                name: <Translate namespace="Other" itemKey="other" />
            },
            profile: {
                link: "/profile",
                name: <Translate namespace="Profile" itemKey="namespace" />,
                activate: (pathname) => {
                    return pathname === '/profile'
                }
            }
        }
    },
    advertiser: {
        link: '/advertiser/dashboard',
        base: '/advertiser',
        name: <Translate namespace="Default" itemKey="cabinet" />,
        subRoutes: {
            dashboard: {
                link: '/advertiser/dashboard',
                name: <Translate namespace="Advertiser" itemKey="dashboard" />,
            },
            myRequests: {
                link: '/advertiser/my-requests',
                name: <Translate namespace="Advertiser" itemKey="mysposts" />,
            },
            myPosts: {
                link: '/advertiser/my-posts',
                name: <Translate namespace="Advertiser" itemKey="orders" />,
            },
            newPost: {
                link: '/advertiser/new-post',
                name: <Translate namespace="Advertiser" itemKey="newposts" />,
            },
            billing: {
                link: '/advertiser/billing',
                name: <Translate namespace="Advertiser" itemKey="billing" />,
            },
            chats: {
                link: '/advertiser/chats',
                name: <Translate namespace="Advertiser" itemKey="chats" />,
            },
        }
    },
    blogger: {
        link: '/blogger',
        base: '/blogger',
        name: <Translate namespace="Default" itemKey="cabinet" />,
        activate: (pathname) => pathname.startsWith('/blogger'),
        subRoutes: {
            dashboard: {
                link: '/blogger/dashboard',
                name: <Translate namespace="Blogger" itemKey="dashboard" />,
            },
            myRequests: {
                link: '/blogger/my-requests',
                name: <Translate namespace="Blogger" itemKey="myorders" />,
            },
            myChannels: {
                link: '/blogger/my-channels',
                name: <Translate namespace="Blogger" itemKey="mychannels" />
            },
            newChannel: {
                link: '/blogger/new-channel',
                name: <Translate namespace="Blogger" itemKey="addchannel" />
            },
            billing: {
                link: '/blogger/billing',
                name: <Translate namespace="Blogger" itemKey="profit" />
            },
            chats: {
                link: '/blogger/chats',
                name: <Translate namespace="Blogger" itemKey="chats" />
            }
        }
    },
}
