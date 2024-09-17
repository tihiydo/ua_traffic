import { ERROR_CODES } from "@/constants/error-codes";
import nodeFetch from 'node-fetch'

export const refreshLongLivedToken = async (accessToken: string) => {
    type SuccessResponse = {
        access_token: string,
        expires_in: number
    }

    try {
        const response = await nodeFetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${accessToken}`)
        const newAccessToken = await response.json() as SuccessResponse;

        return newAccessToken
    } catch (error) {
        throw new Error(ERROR_CODES.IG_DATA_FAIL)
    }

}