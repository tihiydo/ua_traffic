'use client'

import { type UseFormReturn, useFieldArray } from 'react-hook-form'
import { type TelegramPostFormData } from '../telegram-post-form'

import CreateLinkModal from './create-link-modal';
import EditLinkModal from './edit-link-modal';

type Props = {
    form: UseFormReturn<TelegramPostFormData>;
}

const TelegramFormLinks = ({ form }: Props) => {
    const { append, fields, remove, update } = useFieldArray({
        control: form.control,
        name: 'links',
    })

    return (
        <div>
            <div className={`flex  flex-wrap justify-start items-center gap-2 `}>
                {fields.map((field, index) => {
                    return <div key={field.id} className='flex-1'>
                        <EditLinkModal
                            link={field}
                            onSubmit={(newValue) => {
                                update(index, newValue)
                            }}
                            onDelete={() => {
                                remove(index)
                            }}
                        />
                    </div>

                })}
            </div>


            <div className='mt-2 '>
                <CreateLinkModal
                    onSubmit={(newLink) => {
                        append(newLink)
                    }}
                />
            </div>
        </div>
    )
}

export default TelegramFormLinks