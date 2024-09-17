"use client";

import { Button } from '@/components/ui/button';
import FileInput from '@/components/ui/custom/form/file-input';
import FormInput from '@/components/ui/custom/form/form-input';
import TextEditor from '@/components/ui/custom/text-editor';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { allowedImgs } from '@/constants/mime-types';
import { uploadFiles } from '@/lib/vercel-blob';
import { api } from '@/trpc/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { transliterate } from './transliterate';
import { z } from 'zod';
import GoBackLink from "@/components/go-back-link";


type Props = {
  initialData?: BlogFormData & { id?: string , title?: string};
  onUpdate?: (data: BlogFormData & { id?: string }) => Promise<void>;
  isEditing?: boolean;
  isArchivedState?: boolean;
  isArchived?: boolean;
};

type SectionData =
  | {
      type: 'TITLE';
      title: string;
      titleRu: string;
      titleEn: string;
    }
  | {
      type: 'TEXT';
      content: string;
      contentRu: string;
      contentEn: string;
    }
  | {
      type: 'IMAGE';
      image: string;
    };

export type BlogFormData = {
  title: string;
  titleRu: string;
  titleEn: string;
  description: string;
  isArchived: boolean;
  descriptionRu: string;
  descriptionEn: string;
  image: string;
  slug: string;
  sections: SectionData[];
};

const sectionSchema = z.object({
    type: z.enum(["TITLE", "TEXT", "IMAGE"]),
    title: z.string().nullable().optional(),
    titleRu: z.string().nullable().optional(),
    titleEn: z.string().nullable().optional(),
    content: z.string().nullable().optional(),
    contentRu: z.string().nullable().optional(),
    contentEn: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
});

const schema = z.object({
    title: z.string().min(1, "Заголовок обов'язковий"),
    titleRu: z.string().min(1, "Заголовок на русском обязателен"),
    titleEn: z.string().min(1, "Title in English is required"),
    description: z.string().optional(),
    descriptionRu: z.string().optional(),
    descriptionEn: z.string().optional(),
    image: z.string().min(1, "Зображення обов'язкове"),
    slug: z.string().optional(),
    sections: z.array(sectionSchema).optional(),
});

const BlogPostForm = ({ initialData, onUpdate, isArchived, isEditing, isArchivedState = true }: Props) => {
    const form = useForm<BlogFormData>({
        resolver: async (values, context, options) => {
            if (isArchived && isEditing) {
                return {
                    values,
                    errors: {},
                };
            }
            return zodResolver(schema)(values, context, options);
        },
        mode: 'onBlur',
        defaultValues: {
            ...(initialData || {}),
            sections: initialData?.sections || [],
        },
    });

    const { control, handleSubmit, setValue, watch, formState: { errors, isValid } } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'sections',
    });

    const { push } = useRouter();

    const { mutate: createArticle } = api.blog.createArticle.useMutation({
        onSuccess: (data) => {
            toast.success('Статтю створено');
            setTimeout(() => {
                push(`/blog/${data.slug}`);
            }, 1000);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const { mutate: createArchArticle } = api.blog.createArticle.useMutation({
        onSuccess: (data) => {
            toast.success('Статтю створено та архівовано');
            push('/admin/blog/archive');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const { mutate: archiveArticle } = api.blog.archiveArticle.useMutation({
        onSuccess: () => {
            toast.success('Статтю архівовано');
            push('/admin/blog/archive');
        },
        onError: (error) => {
            console.error('Помилка при архівуванні статті:', error);
            toast.error('Сталася помилка під час архівування статті');
        },
    });

    const generateSlug = (title: string) => {
        return transliterate(title)
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    };

    const onSubmit = async (data: BlogFormData) => {
        console.log("Submitting form data:", data);
        if (onUpdate) {
            await onUpdate(data);
            return;
        }
        const slug = generateSlug(data.title);
        try {
            await createArticle({
                ...data,
                slug,
            });
            push(`/blog/${slug}`);
        } catch (error) {
            console.error('Помилка при створенні статті:', error);
            toast.error('Сталася помилка під час створення статті');
        }
    };
    const handleArchive = async () => {
        const data = form.getValues();
        const slug = generateSlug(data.title);
        try {
            await createArchArticle({
                ...data,
                slug,
                isArchived: true,
                title: data.title || '',
                image: data.image || '',
                description: data.description || '',
                titleRu: data.titleRu || '',
                titleEn: data.titleEn || '',
                descriptionRu: data.descriptionRu || '',
                descriptionEn: data.descriptionEn || '',
            });
        } catch (error) {
            console.error('Помилка при створенні та архівуванні статті:', error);
            toast.error('Сталася помилка під час створення та архівування статті');
        }
    };

    const addSection = (type: 'TITLE' | 'TEXT' | 'IMAGE') => {
        append({ type } as SectionData);
    };

    const handleFileUpload = async (files: File[], index: number) => {
        console.log('handleFileUpload called with files:', files, 'and index:', index);
        const file = files[0];
        if (!file) {
            console.log('No file selected');
            return;
        }

        try {
            console.log('Attempting to upload file:', file.name);
            const [uploadedImage] = await uploadFiles(`articles/sections`, [file], allowedImgs);
            if (!uploadedImage) {
                console.log('No image uploaded');
                return;
            }

            console.log(`Uploaded image URL for section ${index}:`, uploadedImage.url);
            setValue(`sections.${index}.image`, uploadedImage.url);
            form.trigger(`sections.${index}.image`);
            console.log('Current form values:', form.getValues());
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        }
    };

    useEffect(() => {
        if (fields.length > 0) {
            const lastIndex = fields.length - 1;
            const lastField = fields[lastIndex];
            if (!lastField) return;
            const fieldType = lastField.type;

            if (fieldType === 'TITLE') {
                const inputElement = document.querySelector(`[name="sections.${lastIndex}.title"]`)! as HTMLInputElement;
                inputElement?.focus();
            } else if (fieldType === 'TEXT') {
                const textareaElement = document.querySelector(`[name="sections.${lastIndex}.content"]`)! as HTMLElement;
                textareaElement?.focus();
            }
        }
    }, [fields]);

    const watchedSections = watch('sections');

    return (
        <Form {...form}>
            <div className="max-w-[40rem] w-full mx-auto mt-8 grid grid-cols-1 gap-4">
                <div className="flex justify-start ml-1">
                    <GoBackLink fallbackLink='/admin/blog' />
                </div>
                <div>
                    <h2 className="text-xl font-bold ml-3">
                        {initialData
                            ? `Редагування статті: "${initialData.title}"`
                            : 'Створення статті'}
                        {initialData?.isArchived && <span className="text-red-500"> (Архівовано)</span>}
                    </h2>
                </div>
            </div>


        

            <form onSubmit={handleSubmit(onSubmit)} className="max-w-[40rem] w-full mx-auto p-4">
                

                <FormField
                    name="slug"
                    control={control}
                    render={({ field }) => (
                        <FormItem className='mt-[10px]'>
                            <FormControl>
                                <input type="hidden" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    name="title"
                    control={control}
                    render={({ field }) => (
                        <FormItem className='mt-[10px]'>
                            <FormLabel>Заголовок</FormLabel>
                            <FormControl>
                                <FormInput
                                    placeholder="Заголовок"
                                    control={control}
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    name="titleRu"
                    control={control}
                    render={({ field }) => (
                        <FormItem className='mt-[10px]'>
                            <FormLabel>Заголовок RU</FormLabel>
                            <FormControl>
                                <FormInput
                                    placeholder="Заголовок RU"
                                    control={control}
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    name="titleEn"
                    control={control}
                    render={({ field }) => (
                        <FormItem className='mt-[10px]'>
                            <FormLabel>Заголовок EN</FormLabel>
                            <FormControl>
                                <FormInput
                                    placeholder="Заголовок EN"
                                    control={control}
                                    {...field}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormItem className='mt-[10px]'>
                    <FormLabel>Зображення</FormLabel>
                    <FileInput
                        onChange={(files) => {
                            const file = files[0];
                            if (!file) return;

                            uploadFiles('articles', [file], allowedImgs).then(([uploadedImage]) => {
                                if (!uploadedImage) return;
                                setValue('image', uploadedImage.url);
                            });
                        }}
                        acceptedTypes={allowedImgs}
                    />
                </FormItem>

                <FormField
                    name="description"
                    control={control}
                    render={({ field }) => (
                        <FormItem className='mt-[10px]'>
                            <FormLabel>Опис</FormLabel>
                            <FormControl>
                                <TextEditor
                                    height={300}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage>{errors.description?.message}</FormMessage>
                        </FormItem>
                    )}
                />

                <FormField
                    name="descriptionRu"
                    control={control}
                    render={({ field }) => (
                        <FormItem className='mt-[10px]'>
                            <FormLabel>Опис RU</FormLabel>
                            <FormControl>
                                <TextEditor
                                    height={300}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage>{errors.descriptionRu?.message}</FormMessage>
                        </FormItem>
                    )}
                />

                <FormField
                    name="descriptionEn"
                    control={control}
                    render={({ field }) => (
                        <FormItem className='mt-[10px]'>
                            <FormLabel>Опис EN</FormLabel>
                            <FormControl>
                                <TextEditor
                                    height={300}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage>{errors.descriptionEn?.message}</FormMessage>
                        </FormItem>
                    )}
                />

                <div className="border-t-2 border-slate-300 my-4"></div>


                {fields.map((field, index) => (
                    <div key={field.id} className="mb-10 border-b border-gray-200 pb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium">Секція {index + 1}</h3>
                            <Button className='mt-4' variant="destructive" onClick={() => remove(index)}>Видалити</Button>
                        </div>
                        {field.type === 'TITLE' && (
                            <>
                                <FormField
                                    control={control}
                                    name={`sections.${index}.title`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Заголовок секції</FormLabel>
                                            <FormControl>
                                                <FormInput
                                                    control={control}
                                                    placeholder="Заголовок секції"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage>{(errors.sections?.[index] as any)?.title?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`sections.${index}.titleRu`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Заголовок секції RU</FormLabel>
                                            <FormControl>
                                                <FormInput
                                                    control={control}
                                                    placeholder="Заголовок секції RU"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage>{(errors.sections?.[index] as any)?.titleRu?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`sections.${index}.titleEn`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Заголовок секції EN</FormLabel>
                                            <FormControl>
                                                <FormInput
                                                    control={control}
                                                    placeholder="Заголовок секції EN"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage>{(errors.sections?.[index] as any)?.titleEn?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        {field.type === 'TEXT' && (
                            <>
                                <FormField
                                    control={control}
                                    name={`sections.${index}.content`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Контент секції</FormLabel>
                                            <FormControl>
                                                <TextEditor
                                                    height={300}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage>{(errors.sections?.[index] as any)?.content?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`sections.${index}.contentRu`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Контент секції RU</FormLabel>
                                            <FormControl>
                                                <TextEditor
                                                    height={300}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage>{(errors.sections?.[index] as any)?.contentRu?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`sections.${index}.contentEn`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Контент секції EN</FormLabel>
                                            <FormControl>
                                                <TextEditor
                                                    height={300}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage>{(errors.sections?.[index] as any)?.contentEn?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                        {field.type === 'IMAGE' && (
                            <FormItem>
                                <FormLabel>Зображення секції</FormLabel>
                                <FileInput
                                    onChange={(files) => handleFileUpload(files, index)}
                                    acceptedTypes={allowedImgs}
                                />
                                {/* @ts-ignore */}
                                {watchedSections[index]?.type === 'IMAGE' && watchedSections[index].image && (
                                    <div className="mt-2 relative w-full h-40 flex justify-center items-center overflow-hidden">
                                        <img 
                                            className="object-cover max-w-full max-h-full" 
                                            // @ts-ignore 
                                            src={watchedSections[index].image} 
                                            alt="Uploaded section image" 
                                            width={200}
                                            height={200}
                                        />
                                    </div>
                                )}
                                <FormMessage>{(errors.sections?.[index] as any)?.image?.message}</FormMessage>
                            </FormItem>
                        )}
                    </div>
                ))}

                <div className="mt-4 flex gap-4">
                    <Button type="button" onClick={() => addSection('TITLE')}>Додати заголовок</Button>
                    <Button type="button" onClick={() => addSection('TEXT')}>Додати текст</Button>
                    <Button type="button" onClick={() => addSection('IMAGE')}>Додати зображення</Button>
                </div>
                <div className='flex gap-4'>
                    <Button 
                        type="submit" 
                        className="mt-4" 
                        disabled={isEditing ? false : !isValid}
                    >
                        {isEditing ? 'Зберегти' : 'Створити'}
                    </Button>
                    {isArchivedState && (
                        <Button type="button" onClick={handleArchive} className="mt-4">
        Архівувати
                        </Button>
                    )    
                    }
                    
                </div>
            </form>
        </Form>
    );
};

export default BlogPostForm;
