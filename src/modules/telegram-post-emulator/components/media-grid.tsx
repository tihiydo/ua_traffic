import MediaItem from './media-item'
import { useEmulatorContext } from './emulator-context'
import { useMediaTransform } from '../hooks/use-media-transform'
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';



const MediaGrid = () => {
    const { media, content } = useEmulatorContext();

    console.log('media', media)
    const mediaItems = useMediaTransform(media);
    console.log('mediaItems', mediaItems)

    const includesDocumentFiles = mediaItems.some(item => item.type === 'document');
    const isOnlyViewableMedia = mediaItems.every(item => item.type === 'photo' || item.type === 'video');


    return (
        <div className={cn(
            isOnlyViewableMedia ? 'rounded-md overflow-hidden' : '',
            !!media.length && !!content.length ? 'mb-2' : '',
            isOnlyViewableMedia && media.length === 2 ? 'flex' : '',
            isOnlyViewableMedia && media.length === 3 ? 'grid grid-cols-2 grid-rows-2 auto-rows-[1fr]' : '',
            includesDocumentFiles && 'flex flex-col gap-1',
        )}>
            {mediaItems.map((mediaItem, index) => {
                return <Link
                    style={{
                        aspectRatio: isOnlyViewableMedia && mediaItem.type === 'photo' || mediaItem.type === 'video' && media.length === 1
                            ? mediaItem.width / mediaItem.height
                            : 'auto'
                    }}
                    className={cn(
                        'block ', 
                        isOnlyViewableMedia && media.length === 1 ? 'w-full block max-h-[350px]' : '',
                        isOnlyViewableMedia && media.length === 2 ? 'flex-1 h-[120px]' : '',
                        isOnlyViewableMedia && media.length === 3 ? `h-[150px] ${index === 0 && 'row-[1_/_span_2] h-[300px] w-[100%] bg-black'}` : '',

                    )}
                    href={mediaItem.url}
                    target='_blank'
                    key={mediaItem.url}
                >
                    <MediaItem media={includesDocumentFiles ? {
                        type: 'document',
                        contentType: mediaItem.contentType,
                        url: mediaItem.url
                    } : mediaItem} />
                </Link>
            })}
        </div>
    )
}




export default MediaGrid