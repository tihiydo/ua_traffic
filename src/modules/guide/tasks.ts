import type { Task, TaskCategory } from "./types";

export const TASK_ID = {
    ADVERTISER: {
        DEPOSIT: 'deposit',
        FIRST_AD: 'first-ad',
        ORDER_POST: 'order-post',
        CHECK_STATUS: 'check-status',
    },
    BLOGGER: {
        FIRST_CHANNEL: "first-channel",
        CHANNEL_STATUS: "channel-status",
        FIRST_REQUEST: "first-request",
    },
    CATALOG: {
        FIRST_ORDER: 'first-order',
    }
}

export const tasks: Record<TaskCategory, Task[]> = {
    advertiser: [
        {
            id: TASK_ID.ADVERTISER.DEPOSIT,
            title: 'advertiser1-title',
            description: 'advertiser1-description',
            tooltipText: 'advertiser1-description',
            checked: false,
            category: "advertiser"
        },
        {
            id: TASK_ID.ADVERTISER.FIRST_AD,
            title: "advertiser2-title",
            description: "advertiser2-description",
            tooltipText: "advertiser2-description",
            checked: false,
            category: "advertiser"
        },
        {
            id: TASK_ID.ADVERTISER.ORDER_POST,
            title: "advertiser3-title",
            description: "advertiser3-description",
            tooltipText: "advertiser3-description",
            checked: false,
            category: "advertiser"
        },
        {
            id: TASK_ID.ADVERTISER.CHECK_STATUS,
            title: "advertiser4-title",
            description: "advertiser4-description",
            tooltipText: "advertiser4-description",
            checked: false,
            category: "advertiser"
        },
    ] as const,
    blogger: [
        {
            id: TASK_ID.BLOGGER.FIRST_CHANNEL,
            title: "blogger1-title",
            description: "blogger1-description",
            tooltipText: "blogger1-description",
            checked: false,
            category: 'blogger'
        },
        {
            id: TASK_ID.BLOGGER.CHANNEL_STATUS,
            title: "blogger2-title",
            description: "blogger2-description",
            tooltipText: "blogger2-description",
            checked: false,
            category: 'blogger'
        },
        {
            id: TASK_ID.BLOGGER.FIRST_REQUEST,
            title: "blogger3-title",
            description: "blogger3-description",
            tooltipText: "blogger3-description",
            checked: false,
            category: 'blogger'
        },
    ] as const,
    catalog: [
        {
            id: TASK_ID.CATALOG.FIRST_ORDER,
            title: "catalog1-title",
            description: "catalog1-description",
            tooltipText: "catalog1-description",
            checked: false,
            category: 'catalog'
        }
    ] as const
} as const


