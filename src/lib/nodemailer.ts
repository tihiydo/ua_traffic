import { env } from "@/env.mjs";
import nodemailer, { type SendMailOptions, type Transporter } from "nodemailer";

const user = env.NODEMAILER_EMAIL;
const password = env.NODEMAILER_SECRET;

export const transporter: Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user,
        pass: password,
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const generateMailOptions = (
    to: string[],
    subject: string,
    html: string,
): SendMailOptions => {
    return {
        from: user,
        to,
        subject,
        html,
    };
};
