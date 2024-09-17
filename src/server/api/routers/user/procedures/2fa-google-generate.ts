import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { TOTP } from 'otpauth';
import { randomBytes } from 'node:crypto'
const QRCode = require('qrcode');
import * as base32 from 'hi-base32';

export const generate2fa = protectedProcedure
    .mutation(async ({ ctx }) => {
        const user = await ctx.db.user.findUnique
            ({
                where:
                {
                    id: ctx.session.user.id
                },
                select:
                {
                    twofaGoogle: true,
                    email: true
                }
            })
        if (!user) return

        if (user.twofaGoogle == null) {
            const buffer = randomBytes(15);
            const base32Secret = base32.encode(buffer).replace(/=/g, "").substring(0, 24);
            const totp = new TOTP({
                label: `UATRAFFIC | ${user.email?.split("@")[0]?.toUpperCase()}`,
                algorithm: "SHA1",
                digits: 6,
                secret: base32Secret
            });
            const url = await QRCode.toDataURL(totp.toString(), { width: 200, height: 200 })
            const updateUser = await ctx.db.user.update({
                where:
                {
                    id: ctx.session.user.id
                },
                data:
                {
                    twofaGoogle: base32Secret
                }
            })
            return { url, secret: base32Secret, updateUser }
        }
    })