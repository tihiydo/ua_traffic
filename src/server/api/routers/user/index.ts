import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getPasswordToken, getVerificationToken } from "./token";
import { sendResetPasswordEmail } from "./emails/reset-password-email";
import { SHA256 as sha256 } from "crypto-js";
import { udpateUserProcedure } from "./procedures/update-user";
import { getMyUserProcedure } from "./procedures/get-my-user";
import { sendChangeEmailEmailProcedure } from "./procedures/send-change-email-email";
import { changeEmailProcedure } from "./procedures/change-email";
import { getUserBlock } from "./procedures/is-blocked";
import { ERROR_CODES } from "@/constants/error-codes";
import { sendVerificationEmail } from "./emails/verification-email";
import { changeLocaleProcedure } from "./procedures/change-locale";
import { toggleSaveBlogger } from "./procedures/save-blogger";
import { getSavedBloggers } from "./procedures/get-saved-bloggers";
import { verificateTelegram } from "./procedures/verificate-telegram";
import { generate2fa } from "./procedures/2fa-google-generate";
import { verify2fa } from "./procedures/2fa-google-verify";
import { setEnteredTwoFaForGoogleUsers } from "./procedures/2fa-google-for-google-users";
import { getUserReferrals } from "./procedures/referrals";
import { setInviter } from "./procedures/referrals-set";
import { haveReferrals } from "./procedures/have-referrals";
import { changeClientHeaderTab } from "./procedures/change-client-header-tab";
import { getClientHeaderTab } from "./procedures/get-client-header-tab";
import { removeUser } from "./procedures/remove-user";

export const userRouter = createTRPCRouter({
    createUser: publicProcedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const result = await ctx.db.$transaction(async () => {
                const existingUser = await ctx.db.user.findFirst({
                    where: {
                        email: input.email,
                    },
                });

                if (existingUser) {
                    throw new TRPCError({
                        message: ERROR_CODES.EMAIL_IN_USE,
                        code: "BAD_REQUEST",
                    });
                }

                const user = await ctx.db.user.create({
                    data: {
                        email: input.email,
                        password: sha256(input.password).toString(),
                    },
                });

                const verificationToken = await getVerificationToken(user.email!);
                if (!verificationToken) {
                    throw new TRPCError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: ERROR_CODES.SERVER_ERROR,
                    });
                }

                return { user, verificationToken };
            });

            await sendVerificationEmail(
                result.user.email!,
                result.verificationToken.token,
            );

            return result;
        }),

    getTodos: protectedProcedure
        .query(async ({ ctx }) => {
            return ctx.db.todo.findMany({
                where: { userId: ctx.session.user.id },
                orderBy: { createdAt: 'desc' }
            });
        }),

    getTodoSections: protectedProcedure
        .query(async ({ ctx }) => {
            return ctx.db.todoSection.findMany({
                where: { userId: ctx.session.user.id },
                include: { todos: true },
                orderBy: { createdAt: 'desc' }
            });
        }),

    addTodoSection: protectedProcedure
        .input(z.object({ name: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.todoSection.create({
                data: {
                    name: input.name,
                    userId: ctx.session.user.id
                }
            });
        }),

    updateTodoSection: protectedProcedure
        .input(z.object({ id: z.string(), name: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.todoSection.update({
                where: { id: input.id, userId: ctx.session.user.id },
                data: { name: input.name }
            });
        }),

    deleteTodoSection: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.todoSection.delete({
                where: { id: input.id, userId: ctx.session.user.id }
            });
        }),

    addTodo: protectedProcedure
        .input(z.object({ text: z.string(), sectionId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.todo.create({
                data: {
                    text: input.text,
                    userId: ctx.session.user.id,
                    sectionId: input.sectionId
                }
            });
        }),

    toggleTodo: protectedProcedure
        .input(z.object({ id: z.string(), completed: z.boolean() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.todo.update({
                where: { id: input.id, userId: ctx.session.user.id },
                data: { completed: input.completed }
            });
        }),
    deleteTodo: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.db.todo.delete({
                where: { id: input.id, userId: ctx.session.user.id }
            });
        }),

    verifyTelegram: verificateTelegram,
    verifyEmail: publicProcedure
        // get the token here
        .input(z.object({ tokenString: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // find token
            const token = await ctx.db.verificationToken.findFirst({
                where: {
                    token: input.tokenString,
                },
            });

            if (!token) {
                throw new TRPCError({
                    message: ERROR_CODES.ANY_TOKEN_NOT_FOUND,
                    code: "NOT_FOUND",
                });
            }

            // if token not found or token has expired
            if (token.expires.getTime() < new Date().getTime()) {
                throw new TRPCError({
                    message: ERROR_CODES.TOKEN_EXPIRED,
                    code: "BAD_REQUEST",
                });
            }

            const user = await ctx.db.user.findFirst({
                where: {
                    email: token?.identifier,
                },
            });
            if (user?.emailVerified) return user;

            // update user with email equal to token identifier
            const result = await ctx.db.$transaction([
                ctx.db.user.update({
                    where: {
                        email: token.identifier,
                    },
                    data: {
                        emailVerified: new Date(),
                    },
                }),
                ctx.db.verificationToken.delete({
                    where: {
                        token: token.token,
                    },
                }),
            ]);

            return result[0];
        }),

    sendPasswordResetEmail: publicProcedure
        .input(z.string().email())
        .mutation(async ({ ctx, input: email }) => {
            const user = await ctx.db.user.findFirst({
                where: {
                    email,
                },
                select: {
                    id: true,
                    emailVerified: true,
                },
            });

            if (!user) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: ERROR_CODES.USER_NOT_FOUND,
                });
            }

            if (!user.emailVerified) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: ERROR_CODES.USER_NOT_VERIFIED,
                });
            }

            const passwordChangeToken = await getPasswordToken(email);
            if (!passwordChangeToken) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: ERROR_CODES.SERVER_ERROR,
                });
            }

            await sendResetPasswordEmail(email, `/new-password?passwordToken=${passwordChangeToken.token}`);
        }),

    sendPasswordChangeEmail: protectedProcedure
        .mutation(async ({ ctx }) => {
            const user = await ctx.db.user.findUnique({
                where: {
                    id: ctx.session.user.id,
                },
                select: {
                    id: true,
                    emailVerified: true,
                    email: true,
                },
            });

            if (!user?.email) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: ERROR_CODES.CANT_CHANGE_PASSWORD_WITHOUT_EMAIL,
                });
            }

            if (!user.emailVerified) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: ERROR_CODES.USER_NOT_FOUND,
                });
            }

            const passwordChangeToken = await getPasswordToken(user.email);
            if (!passwordChangeToken) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: ERROR_CODES.SERVER_ERROR,
                });
            }

            await sendResetPasswordEmail(user.email, `/profile/settings?p-token=${passwordChangeToken.token}`);
        }),

    changePassword: publicProcedure
        .input(
            z.object({
                token: z.string(),
                newPassword: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const passwordChangeToken = await ctx.db.passwordChangeToken.findFirst({
                where: {
                    token: input.token,
                },
            });
            if (!passwordChangeToken) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: ERROR_CODES.ANY_TOKEN_NOT_FOUND,
                });
            }

            if (passwordChangeToken!?.expires.getTime() < new Date().getTime()) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: ERROR_CODES.TOKEN_EXPIRED,
                });
            }

            const result = await ctx.db.$transaction([
                ctx.db.user.update({
                    where: {
                        email: passwordChangeToken?.identifier,
                    },
                    data: {
                        password: sha256(input.newPassword).toString(),
                    },
                }),
                ctx.db.passwordChangeToken.delete({
                    where: {
                        token: passwordChangeToken.token,
                    },
                }),
            ]);

            return result[0];
        }),

    resendVerificationEmail: publicProcedure
        .input(z.string().email())
        .mutation(async ({ ctx, input: email }) => {
            const user = await ctx.db.user.findFirst({
                where: {
                    email,
                },
                select: {
                    emailVerified: true,
                },
            });
            if (user?.emailVerified) {
                throw new TRPCError({
                    message: ERROR_CODES.USER_ALREADY_VERIFIED,
                    code: "BAD_REQUEST",
                });
            }

            const verificationToken = await getVerificationToken(email);
            if (!verificationToken) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: ERROR_CODES.SERVER_ERROR,
                });
            }

            await sendVerificationEmail(email, verificationToken.token);
        }),

    getCabinetColor: protectedProcedure
        .input(z.enum(["blogger", "advertiser", "profile"]))
        .query(async ({ ctx, input }) => {
            const user = await ctx.db.user.findUnique({
                where: { id: ctx.session.user.id },
                select: {
                    bloggerCabinetColor: true,
                    advertiserCabinetColor: true,
                    profileCabinetColor: true
                }
            });

            switch (input) {
            case "blogger":
                return user?.bloggerCabinetColor;
            case "advertiser":
                return user?.advertiserCabinetColor;
            case "profile":
                return user?.profileCabinetColor;
            default:
                return null;
            }
        }),

    updateCabinetColor: protectedProcedure
        .input(z.object({
            cabinetType: z.enum(["blogger", "advertiser", "profile"]),
            color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
        }))
        .mutation(async ({ ctx, input }) => {
            const { cabinetType, color } = input;
            let updateField: string;

            switch (cabinetType) {
            case "blogger":
                updateField = "bloggerCabinetColor";
                break;
            case "advertiser":
                updateField = "advertiserCabinetColor";
                break;
            case "profile":
                updateField = "profileCabinetColor";
                break;
            }

            const updatedUser = await ctx.db.user.update({
                where: { id: ctx.session.user.id },
                data: { [updateField]: color },
            });

            return updatedUser;
        }),

    getProfileCabinetColor: protectedProcedure
        .query(async ({ ctx }) => {
            const user = await ctx.db.user.findUnique({
                where: { id: ctx.session.user.id },
                select: { profileCabinetColor: true }
            });

            return user?.profileCabinetColor;
        }),

    updateProfileCabinetColor: protectedProcedure
        .input(z.object({
            color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
        }))
        .mutation(async ({ ctx, input }) => {
            const updatedUser = await ctx.db.user.update({
                where: { id: ctx.session.user.id },
                data: { profileCabinetColor: input.color },
            });

            return updatedUser;
        }),


    getMyUser: getMyUserProcedure,
    getBlockedOrNo: getUserBlock,
    removeUser,
    updateUser: udpateUserProcedure,
    twofaGenerate: generate2fa,
    twofaVerify: verify2fa,
    twofaSetChecked: setEnteredTwoFaForGoogleUsers,
    sendChangeEmailEmail: sendChangeEmailEmailProcedure,
    changeEmail: changeEmailProcedure,
    changeLocale: changeLocaleProcedure,
    toggleSaveBlogger: toggleSaveBlogger,
    getSavedBloggers: getSavedBloggers,
    getRefferals: getUserReferrals,
    haveReferrals: haveReferrals,
    setRefferal: setInviter,
    changeClientHeaderTab,
    getClientHeaderTab
});
