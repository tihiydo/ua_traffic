import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useZodSchema } from '@/hooks/use-zod-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import FormInput from '@/components/ui/custom/form/form-input';
import FileInput from '@/components/ui/custom/form/file-input';
import { ALLOWED_INSTAGRAM_FILES } from '../constants';
import Translate from '@/components/Translate';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { useCreateInstagramPost } from './use-create-instagram-post';
import { StoryEditor, imageNode, linkNode, textNode, useStoryNodesState } from '@/modules/instagram-story-editor';
import { useScreenSize } from '@/hooks/use-screen-size';
import { type TextNode } from '@/modules/instagram-story-editor/components/text-node/text-node';
import { type LinkNode } from '@/modules/instagram-story-editor/components/link-node/link-node';
import { StoryFont } from '@/modules/instagram-story-editor/fonts';
import { getAttachemntsFormSchema } from '@/database/ad-post/attachments/form-schemas';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useEffect, useState } from 'react';
import { ChevronRightIcon, XIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import PostTypeSelect from './post-type-select';
import { type InstagramAdPostType } from '@/database/ad-post/post/post-types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ImageNode } from '@/modules/instagram-story-editor/components/image-node';
import { truncate } from '@/utils';
import InfoMessage from '@/components/ui/custom/info-message';
import { Link } from '@/i18n/navigation';
import { api } from '@/trpc/react';

type InstagramStoryFormData = {
    title: string;
    media: File[]
    link: string
    linkText?: string;
    content: string
}

type Props = {
    onPostTypeChange?: (postType: InstagramAdPostType) => void;
}

const InstagramTabStory = ({ onPostTypeChange }: Props) => {
    const { data: user } = api.user.getMyUser.useQuery()
    const [constructorOpen, setConstructorOpen] = useState(false);
    const validationT = useTranslations('Validation');
    const t = useTranslations();
    const schema = useZodSchema<InstagramStoryFormData>(() => {
        return z.object({
            title: z.string().min(1, validationT('required-field')),
            media: getAttachemntsFormSchema(validationT, { maxFiles: 1, maxFileSizeMB: 3, maxVideoSizeMB: 30 }),
            link: z.string(),
            linkText: z.string().optional(),
            content: z.string().max(150, validationT('max-length', { length: 150 }))
        })
    }, []);
    const form = useForm<InstagramStoryFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            link: '',

            content: '',
            title: '',
        }
    })
    const { handleSubmit, watch, control, } = form;
    const createPost = useCreateInstagramPost();
    const formData = watch();
    const { nodesState, updateNode } = useStoryNodesState([
        imageNode({
            id: 'image-1',
            position: {
                x: 5,
                y: 100,
            },
            data: {
                href: '',
            }
        }),
        textNode({
            id: 'text-1',
            position: {
                x: 0,
                y: 150
            },
            data: {
                text: ''
            },
        }),
        linkNode({
            id: 'link-1',
            position: {
                x: 0,
                y: 225,
            },
            data: {
                link: '',
                text: '',
            }
        }),

    ],);
    const [nodes] = nodesState

    const { width: windowWidth } = useScreenSize();
    const isLoading = createPost.isLoading;

    useEffect(() => {
        updateNode('text-1', {
            text: formData.content,
        });
    }, [formData.content])

    useEffect(() => {
        const file = formData.media?.[0];
        const href = file
            ? URL.createObjectURL(file)
            : undefined

        updateNode('image-1', {
            href,
        });
    }, [formData.media])

    useEffect(() => {
        updateNode('link-1', {
            link: formData.link,
            text: formData.linkText,
        });
    }, [formData.link, formData.linkText])

    const canSubmit = (typeof user?.advertiserBalance === 'number' && (user.advertiserBalance >= 200))

    return (
        <div className='w-full flex flex-col justify-normal items-stretch md:flex-row md:justify-between md:items-start gap-5'>
            <div
                className='max-w-[600px] w-full'
            >
                {!canSubmit ? (
                    <InfoMessage variant={'error'} className='mb-4 max-w-none'>
                        <p className=''>
                            <Translate namespace='Advertiser.New-Post-Page' itemKey='not-enough-balance' />
                        </p>

                        <Link className='hover:underline group text-main/80 mt-3 flex gap-1 items-center ' href={'/advertiser/billing'}>
                            <Translate namespace='Default' itemKey='deposit-balance' />

                            <ChevronRightIcon className='group-hover:ml-1 group-hover:scale-110 duration-150' />
                        </Link>
                    </InfoMessage>
                ) : (null)}
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(async data => {
                            const textNode = nodes.find(node => {
                                return node.id === 'text-1'
                            })! as TextNode

                            const linkNode = nodes.find(node => {
                                return node.id === 'link-1'
                            })! as LinkNode

                            const imageNode = nodes.find(node => {
                                return node.id === 'image-1'
                            })! as ImageNode

                            try {
                                const { blobs, next } = await createPost.mutate({
                                    files: data.media,
                                })
                                await next({
                                    content: data.content,
                                    title: data.title,
                                    type: 'story',
                                    preview: {
                                        social: 'Instagram',
                                        text: {
                                            position: textNode.position,
                                            align: textNode.data.align,
                                            bgColor: textNode.data.bgColor,
                                            fontSize: textNode.data.fontSize,
                                            textColor: textNode.data.textColor,
                                            content: textNode.data.text,
                                            height: textNode.height ?? 0,
                                            width: textNode.width ?? 0,
                                            font: Object.entries(StoryFont)
                                                .find(([, font]) => {
                                                    if (textNode.data.font?.variable === font.variable) return true
                                                })?.[0] ?? 'Montserrat'
                                        },
                                        link: {
                                            position: linkNode.position,
                                            text: linkNode.data.text,
                                            href: linkNode.data.link,
                                            scale: linkNode.data.scale
                                        },
                                        image: {
                                            position: imageNode.position,
                                            href: blobs[0]?.url ?? '',
                                            scale: imageNode.data.scale
                                        }
                                    }
                                })
                            } catch (error) {

                            }

                        })}
                    >

                        <div>
                            <Label className='font-bold block mb-2'>
                                <Translate namespace="Advertiser" itemKey="typepost" />
                                <span className='text-rose-600'> *</span>
                            </Label>

                            <PostTypeSelect
                                value={'story'}
                                onChange={onPostTypeChange}
                                classNames={{ trigger: 'w-full', content: 'max-w-[600px] w-[90vw]' }}
                            />
                        </div>

                        <FormInput
                            disabled={isLoading}
                            placeholder={t("Advertiser.enterpostname")}
                            label={<Translate namespace="Advertiser" itemKey="postname" />}
                            labelRight={<span className='text-rose-600'> *</span>}
                            control={control}
                            transformChangeValue={(val, prevVal) => (
                                val.length > 80
                                    ? prevVal ?? ''
                                    : val
                            )}
                            name='title'
                            className='mt-3 md:mt-4 lg:mt-6'
                        />


                        <FormField
                            control={control}
                            name='media'
                            render={({ field }) => (
                                <FormItem className='mt-3 md:mt-4 lg:mt-6'>
                                    <FormLabel className="font-bold">
                                        <Translate namespace='Advertiser' itemKey='attachment' />
                                        <span className='text-rose-600'> *</span>
                                    </FormLabel>
                                    <FormControl>
                                        <FileInput
                                            disabled={isLoading}
                                            multiple
                                            acceptedTypes={ALLOWED_INSTAGRAM_FILES}
                                            onChange={(files) => {
                                                field.onChange(files)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name='content'
                            render={({ field }) => (
                                <FormItem className='mt-3 md:mt-4 lg:mt-6'>
                                    <FormLabel className="font-bold block"><Translate namespace="Advertiser" itemKey="text" /></FormLabel>
                                    <FormControl>
                                        <Textarea
                                            value={field.value}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                field.onChange(truncate(newValue, 150, false));

                                            }}
                                            className='placeholder:text-gray-secondary'
                                            placeholder={t('Advertiser.enter-post-text') + '...'}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormInput
                            control={control}
                            className='mt-3 md:mt-4 lg:mt-6'
                            name='link'
                            label={t('Advertiser.link')}
                            placeholder={t('Advertiser.your-link') + '...'}
                        />

                        <FormInput
                            control={control}
                            className='mt-3 md:mt-4 lg:mt-6'
                            name='linkText'
                            label={t('Advertiser.link-text')}
                            placeholder={t('Advertiser.your-link-text') + '...'}
                        />

                        {/* Mobile view */}
                        <div className='block md:hidden'>
                            <Drawer
                                dismissible={false}
                                open={constructorOpen}
                                onOpenChange={(isOpen) => setConstructorOpen(isOpen)}
                            >
                                <DrawerTrigger asChild>
                                    <Button className='w-full mt-5' variant="outline">
                                        <Translate namespace='Constructor' itemKey='open' />
                                    </Button>
                                </DrawerTrigger>

                                <DrawerContent className='pb-5'>
                                    <DrawerHeader>
                                        <div className='flex justify-between items-center gap-3'>
                                            <DrawerTitle className='text-left'>
                                                <Translate namespace='Constructor' itemKey='post-constructor' />
                                            </DrawerTitle>

                                            <Button onClick={() => setConstructorOpen(false)} size={'icon'} variant={'ghost'}>
                                                <XIcon />
                                            </Button>
                                        </div>
                                    </DrawerHeader>

                                    <div className='flex justify-center mt-5'>
                                        <StoryEditor
                                            mode={'edit'}
                                            nodesState={nodesState}
                                        />
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </div>


                        <div className='mt-5 md:mt-6 lg:mt-8'>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type='submit'
                                            disabled={isLoading || !canSubmit}
                                            className='gap-2'>
                                            {isLoading && <SpinnerLoading />}
                                            <Translate namespace="Advertiser" itemKey="sendmoderation" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p><Translate namespace="Advertiser" itemKey="moderation-descr" /></p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </form>
                </Form>
            </div>


            {/* Desktop view */}
            {windowWidth >= 768 && (
                <div className='flex-1 hidden md:flex justify-center'>
                    <StoryEditor
                        mode={'edit'}
                        nodesState={nodesState}
                    />
                </div>
            )}
        </div>
    )
}

export default InstagramTabStory