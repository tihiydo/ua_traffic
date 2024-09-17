import { db } from "@/server/db";
import { v4 as generateToken } from "uuid";

export const getVerificationToken = async (email: string) => {
    // create DateTime 1 day long
    const expirationDate = new Date(Date.now() + 1000 * 60 * 15);

    const existingToken = await db.verificationToken.findFirst({
        where: {
            identifier: email,
        },
    });

    if (
        existingToken &&
    existingToken?.expires.getTime() > new Date().getTime()
    ) {
        return existingToken;
    }

    // if token not found or token expired
    if (
        !existingToken ||
    existingToken.expires.getTime() < new Date().getTime()
    ) {
        const token = generateToken();

        if (existingToken) {
            await db.verificationToken.delete({
                where: {
                    token: existingToken.token,
                },
            });
        }

        const verificationToken = db.verificationToken.create({
            data: {
                expires: expirationDate,
                identifier: email,
                token: token,
            },
        });

        return verificationToken;
    }
};

export const getPasswordToken = async (email: string) => {
    // create DateTime 15 minutes long
    const expirationDate = new Date(Date.now() + 1000 * 60 * 15);

    const existingToken = await db.passwordChangeToken.findFirst({
        where: {
            identifier: email,
        },
    });

    if (
        existingToken &&
    existingToken?.expires.getTime() > new Date().getTime()
    ) {
        return existingToken;
    }

    if (
        !existingToken ||
    existingToken.expires.getTime() < new Date().getTime()
    ) {
        if (existingToken) {
            await db.passwordChangeToken.delete({
                where: {
                    token: existingToken.token,
                },
            });
        }
    
        const token = generateToken();

        const passwordChangeToken = db.passwordChangeToken.create({
            data: {
                expires: expirationDate,
                identifier: email,
                token: token,
            },
        });

        return passwordChangeToken;
    }
};
