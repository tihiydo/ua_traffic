import { TASK_ID } from "@/modules/guide/tasks";
import { db } from "@/server/db";

export async function checkIsTaskCompleted(userId: string, taskId: string): Promise<boolean> {
    // Advertiser
    if (taskId === TASK_ID.ADVERTISER.DEPOSIT) {
        return (await db.depositTransaction.count({
            where: {
                userId: userId
            }
        })) >= 1;
    }

    if (taskId === TASK_ID.ADVERTISER.FIRST_AD) {
        return (await db.advertismentPost.count({
            where: {
                creatorId: userId
            }
        })) >= 1
    }

    if (taskId === TASK_ID.ADVERTISER.CHECK_STATUS) {
        return (await db.advertismentPost.count({
            where: {
                creatorId: userId
            }
        })) >= 1
    }

    // Catalog
    if (taskId === TASK_ID.CATALOG.FIRST_ORDER) {
        return (await db.advertismentRequest.count({
            where: {
                AdvertismentPost: {
                    creatorId: userId
                }
            }
        })) >= 1
    }

    // Blogger
    if (taskId === TASK_ID.BLOGGER.FIRST_CHANNEL) {
        return (await db.blogger.count({
            where: {
                userId: userId
            }
        })) >= 1
    }

    if (taskId === TASK_ID.BLOGGER.CHANNEL_STATUS) {
        return (await db.blogger.count({
            where: {
                userId: userId
            }
        })) >= 1
    }

    if (taskId === TASK_ID.BLOGGER.FIRST_REQUEST) {
        return (await db.advertismentRequest.count({
            where: {
                Blogger: {
                    userId: userId
                }
            }
        })) >= 1
    }


    return false
}