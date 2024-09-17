import { createTRPCRouter } from "@/server/api/trpc";
import { createCookieProcedure } from "./procedures/create-cookie";
import { updateCookieProcedure } from "./procedures/udpate-cookie";
import { toggleActiveCookieProcedure } from "./procedures/toggle-activate-cookie";
import { getCookiesProcedure } from "./procedures/get-cookies";
import { deleteCookieProcedure } from "./procedures/delete-cookie";


export const igCookieRouter = createTRPCRouter({
    createCookie: createCookieProcedure,
    updateCookie: updateCookieProcedure,
    toggleActiveCookie: toggleActiveCookieProcedure,
    getCookies: getCookiesProcedure,
    deleteCookie: deleteCookieProcedure
})