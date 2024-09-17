import { z } from "zod";

export const passwordSchema = z
    .string()
    .refine((data) => data.length >= 6, {
        message: "Пароль має містити щонайменше 6 символів",
    })
    .refine((data) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(data), {
        message: "Пароль має містити щонайменше 1 спец. символ",
    })
    .refine((data) => /\d/.test(data), {
        message: "Пароль має містити хоча б одне число",
    })
    .refine((data) => /[A-Z]/.test(data), {
        message: "Пароль має містити хоча б одну велику літеру",
    });
