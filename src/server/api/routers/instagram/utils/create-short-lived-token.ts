import { env } from "@/env.mjs";
import nodeFetch from 'node-fetch'
import { XWWWFormUrlEncode } from "@/utils/encode";
import { ERROR_CODES } from "@/constants/error-codes";

export const createShortLivedToken = async (code: string) => {
    type GetUserAccessTokenBody = {
        code: string;
        client_id: string;  // env
        client_secret: string; // env
        redirect_uri: string
        grant_type: 'authorization_code',
    }

    type SuccessResponse = {
        access_token: string,
        user_id: number
    }

    type ErrorResponse = {
        code: number
        error_message: string
        error_type: string;
    }

    try {
        const requestData = {
            client_id: env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID,
            client_secret: env.INSTAGRAM_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: 'https://uatraffic.com/blogger/new-channel'
        } satisfies GetUserAccessTokenBody;

        const response = await nodeFetch('https://api.instagram.com/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: XWWWFormUrlEncode(requestData)
        })

        const shortLivedToken = await response.json() as any;

        if ((shortLivedToken as (ErrorResponse | null))?.code) {
            throw new Error((shortLivedToken as ErrorResponse).error_message);
        }

        console.log("SHORT ACCESSED")
        return shortLivedToken as SuccessResponse
    } catch (error) {
        throw new Error(ERROR_CODES.IG_DATA_FAIL)
    }
}