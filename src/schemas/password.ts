import { type TranslateFn } from "@/types";
import { z } from "zod";


export const getPasswordSchema = (t: TranslateFn<'Validation'>, args?: { length?: number }) => {
    const DEFAULT_PASSWORD_LENGTH = 6;

    return z
        .string()
        .refine((data) => data.length >= (args?.length ?? DEFAULT_PASSWORD_LENGTH), {
            message: t('min-length', { length: args?.length ?? DEFAULT_PASSWORD_LENGTH }),
        })
        .refine((data) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(data), {
            message: t('password-spec-symbol'),
        })
        .refine((data) => /\d/.test(data), {
            message: t('password-num'),
        })
        .refine((data) => /[A-Z]/.test(data), {
            message: t('password-uppercase'),
        });
}