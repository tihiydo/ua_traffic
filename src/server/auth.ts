import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
    getServerSession,
    type DefaultSession,
    type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { SHA256 as sha256 } from "crypto-js";
import { db } from "@/server/db";
import { env } from "@/env.mjs";
import { exclude } from "@/utils/prisma";
import { ERROR_CODES } from "@/constants/error-codes";
import { api } from '@/trpc/server'
import { type User } from "@prisma/client";
import { type DefaultJWT } from "next-auth/jwt";


export type NextAuthUser = Omit<User, 'password'>;

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        user: Omit<User, 'password'>;
    }
}

declare module "next-auth" {
    interface Session extends DefaultSession 
    {
        accessToken: unknown;
        user: NextAuthUser;
    }

    interface User extends NextAuthUser {
        a: null
    }
}


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    session: {
        strategy: "jwt",
    },
    jwt: {
        maxAge: 60,
    },
    callbacks: {
        signIn: async ({ account, user }) => {
            if (account?.provider === 'google') {
                const credentialsUser = await db.user.findFirst({
                    where: {
                        email: user.email
                    },
                    select:
                    {
                        password: true,
                        twofaGoogle: true,
                        twofaGoogleForGoogleUsersIsChecked: true
                    }
                })

                if (credentialsUser?.password) {
                    return `/login?err=${ERROR_CODES.WRONG_AUTH_METHOD}`
                }

                if (!!credentialsUser?.twofaGoogle && user.email) {
                    if (credentialsUser?.twofaGoogleForGoogleUsersIsChecked) {
                        await api.user.twofaSetChecked.mutate({ email: user.email, entered: false })
                        return true
                    } else {
                        return `/login?err=${ERROR_CODES.USER_TWOFA_GOOGLE}&email=${user.email}`
                    }
                }

                return true
            };

            return true
        },

        async jwt({ token, account }) 
        {
            if (!token?.email) return token;

            const dbUser = await db.user.findUnique({
                where: 
                {
                    email: token.email
                }
            });
            if (!dbUser) return token;

            const user = exclude(dbUser, ['password'])
            token.access_token = account?.access_token

            const newToken = { ...token, user }
            return newToken;
        },

        session: async ({ session, token }) => 
        {
            //token =  { ...token, user }
            session = {
                ...session,
                accessToken: token.access_token,
                user: token.user
            };
            console.error(session)

            return session
        },
    },
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return;
                const { email, password } = credentials;

                const dbUser = await db.user.findUnique({
                    where: {
                        email,
                    },
                });

                if (!dbUser) {
                    throw new Error(ERROR_CODES.USER_NOT_FOUND);
                }
                if (!dbUser.password) {
                    throw new Error(
                        ERROR_CODES.WRONG_AUTH_METHOD,
                    );
                }
                if (dbUser.password !== sha256(password).toString()) {
                    throw new Error(ERROR_CODES.WRONG_PASSWORD);
                }

                if (dbUser.banned) {
                    throw new Error(ERROR_CODES.BLOCKED);
                }

                if (email === 'admin@gmail.com') {
                    return dbUser;
                }

                if (email === 'moder@gmail.com') {
                    return dbUser;
                }

                if (!dbUser?.emailVerified) {
                    throw new Error(ERROR_CODES.USER_NOT_VERIFIED);
                }

                if (dbUser?.twofaGoogle !== null) {
                    throw new Error(ERROR_CODES.USER_TWOFA_GOOGLE);
                }

                return dbUser as any;
            },
        }),
    ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
