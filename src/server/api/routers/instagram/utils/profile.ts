import { TRPCError } from "@trpc/server";
import nodeFetch from 'node-fetch'
import { urlImgToBase64 } from "@/utils/imgs";
import { getIgCrutchData } from "./get-ig-crutch-data";
import { ERROR_CODES } from "@/constants/error-codes";
import { type IGBlogger } from "@/database/blogger";

type BaseProfileData = {
    id: string;
    username: string;
    account_type: string;
}

export const getBaseIGData = async (longLivedToken: string) => {
    try {
        const response = await nodeFetch(`https://graph.instagram.com/v18.0/me?fields=id,username,account_type&access_token=${longLivedToken}`)

        if (response.ok) {
            const baseProfileData = await response.json() as BaseProfileData;

            return baseProfileData;
        }
    } catch (error) {
        throw new Error(ERROR_CODES.IG_DATA_FAIL)
    }
}

type IGData = Pick<IGBlogger, 'username' | 'id' | 'followersCount' | 'profilePicture'>
export const getIGProfileData = async (longLivedToken: string): Promise<IGData> => {
    const baseData = await getBaseIGData(longLivedToken);
    if (!baseData) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: ERROR_CODES.IG_API_ERROR });

    const crutchData = await getIgCrutchData(baseData.username);
    // const avatar = await uploadFromUrl(
    //     crutchData.data.user.profile_pic_url,
    //     {
    //         fileName: baseData.username + `.jpg`,
    //         path: "/avatars"
    //     }
    // )
    const avatar = await urlImgToBase64(crutchData.data.user.profile_pic_url)



    return {
        id: baseData.id,
        profilePicture: avatar,
        username: baseData.username,
        followersCount: crutchData.data.user.edge_followed_by.count,
    };
}

