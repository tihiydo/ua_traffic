import { ERROR_CODES } from "@/constants/error-codes";
import { env } from "@/env.mjs";
import nodeFetch from 'node-fetch'

type SuccessResponse = {
    access_token: string,
    expires_in: number
}
export const createLongLivedToken = async (shortLivedToken: string) => {
    try {
        const response = await nodeFetch(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${env.INSTAGRAM_CLIENT_SECRET}&access_token=${shortLivedToken}`)
        const longLivedToken = await response.json() as SuccessResponse;
        console.log(`https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${env.INSTAGRAM_CLIENT_SECRET}&access_token=${shortLivedToken}`, shortLivedToken, longLivedToken)
        return longLivedToken
    } catch (error) {
        throw new Error(ERROR_CODES.IG_DATA_FAIL)
    }
}