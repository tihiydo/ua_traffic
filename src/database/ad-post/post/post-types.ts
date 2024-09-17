export type InstagramAdPostType = ObjectValues<typeof InstagramAdPostType>
export const InstagramAdPostType = {
    Story: 'story',
    StoryTechTask: 'story-tech-task',
} as const;


export type TelegramAdPostType = ObjectValues<typeof TelegramAdPostType>
export const TelegramAdPostType = {
    Post_30x24: 'post-30x24',
    Post_1x24: 'post-1x24',
    Post_2x48: 'post-2x48',
    Post_3x72: 'post-3x72',
    NoDeletion: 'no-deletion',
} as const;


export type AdPostType = InstagramAdPostType | TelegramAdPostType
export const AdPostType = {
    ...TelegramAdPostType,
    ...InstagramAdPostType
}
