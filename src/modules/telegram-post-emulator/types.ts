export type InlineKeyboardItem = {
    display: string;
    href: string;
}

export type MediaItem =
    | {
        url: string;
        type: 'photo';
        contentType: string;
        width: number;
        height: number;
    }
    | {
        url: string;
        type: 'video';
        contentType: string;
        width: number;
        height: number;
    }
    | {
        url: string;
        type: 'document';
        contentType: string;
    }
    | {
        url: string;
        type: 'audio';
        contentType: string;
    }

export type AnyMediaItem = string | MediaItem;