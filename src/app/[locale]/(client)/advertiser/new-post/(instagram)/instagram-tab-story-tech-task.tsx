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
import { Button } from '@/components/ui/button';
import SpinnerLoading from '@/components/ui/custom/spinner-loading';
import { useCreateInstagramPost } from './use-create-instagram-post';
import { StoryEditor, imageNode, useStoryNodesState } from '@/modules/instagram-story-editor';
import TextEditor from '@/components/ui/custom/text-editor';
import { useScreenSize } from '@/hooks/use-screen-size';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { getAttachemntsFormSchema } from '@/database/ad-post/attachments/form-schemas';
import { ChevronRightIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import PostTypeSelect from './post-type-select';
import { Label } from '@/components/ui/label';
import { type InstagramAdPostType } from '@/database/ad-post/post/post-types';
import { type ImageNode } from '@/modules/instagram-story-editor/components/image-node';
import { api } from '@/trpc/react';
import InfoMessage from '@/components/ui/custom/info-message';
import { Link } from '@/i18n/navigation';


export type InstagramStoryTechTaskFormData = {
    title: string;
    media: File[]
    taskContent: string;
}

type Props = {
    onPostTypeChange?: (postType: InstagramAdPostType) => void;
}

const InstagramTabStoryTechTask = ({ onPostTypeChange }: Props) => {
    const { data: user } = api.user.getMyUser.useQuery()
    const [constructorOpen, setConstructorOpen] = useState(false);
    const validationT = useTranslations('Validation');
    const t = useTranslations();

    const schema = useZodSchema<InstagramStoryTechTaskFormData>(() => {
        return z.object({
            title: z.string().min(1, validationT('required-field')),
            media: getAttachemntsFormSchema(validationT, { maxFiles: 1, maxFileSizeMB: 3, maxVideoSizeMB: 30 }),
            taskContent: z.string({ required_error: validationT('required-field') }).min(1, validationT('required-field'))
        })
    }, []);
    const form = useForm<InstagramStoryTechTaskFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: '',
            taskContent: ""
        }
    })
    const { handleSubmit, watch, control } = form;
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
        })
    ],);
    const [nodes] = nodesState

    const { width } = useScreenSize();

    const isLoading = createPost.isLoading;


    useEffect(() => {
        const file = formData.media?.[0];
        const href = file
            ? URL.createObjectURL(file)
            : undefined

        updateNode('image-1', {
            href,
        });
    }, [formData.media])

    const canSubmit = (typeof user?.advertiserBalance === 'number' && (user.advertiserBalance >= 200))

    return (
        <div className='w-full flex flex-col justify-normal items-stretch md:flex-row md:justify-between md:items-start gap-5'>
            <div className='max-w-[600px] w-full'>
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

                            const imageNode = nodes.find(node => {
                                return node.id === 'image-1'
                            })! as ImageNode

                            const { blobs, next } = await createPost.mutate({ files: data.media });
                            next({
                                content: data.taskContent,
                                title: data.title,
                                type: 'story-tech-task',
                                preview: {
                                    social: 'Instagram',
                                    image: {
                                        position: imageNode.position,
                                        href: blobs[0]?.url ?? '',
                                        scale: imageNode.data.scale
                                    }
                                }
                            })
                        })}
                    >
                        <div>
                            <Label className='font-bold block mb-2'>
                                <Translate namespace="Advertiser" itemKey="typepost" />
                                <span className='text-rose-600'> *</span>
                            </Label>

                            <PostTypeSelect
                                value={'story-tech-task'}
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
                                    <FormLabel className="font-bold"><Translate namespace='Advertiser' itemKey='attachment' />
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
                            name='taskContent'
                            render={({ field }) => (
                                <FormItem className='mt-3 md:mt-4 lg:mt-6'>
                                    <FormLabel className="font-bold"><Translate namespace="Advertiser" itemKey="technote" />
                                        <span className='text-rose-600'> *</span>
                                    </FormLabel>
                                    <FormControl>
                                        <TextEditor
                                            disabled={isLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
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
                                            mode='edit'
                                            nodesState={nodesState}
                                        />
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </div>


                        <div className='mt-5 md:mt-6 lg:mt-8'>
                            <Button type='submit' className='gap-2' disabled={isLoading || !canSubmit}>
                                {isLoading && <SpinnerLoading />}
                                <Translate namespace="Advertiser" itemKey="sendmoderation" />
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>

            {/* Desktop view */}
            {width >= 768 && (
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

export default InstagramTabStoryTechTask