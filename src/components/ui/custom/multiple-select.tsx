'use client'

import SpinnerLoading from './spinner-loading';
import Translate from '@/components/Translate';
import { twMerge } from 'tailwind-merge';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { useState } from 'react';
import { Button } from '../button';
import { BanIcon, Check, ChevronRight } from 'lucide-react';
import { Command, CommandGroup, CommandItem } from '../command';
import { cn } from '@/lib/utils';


export type MultipleSelectItem<T extends string = string> = {
    readonly value: T;
    displayValue: React.ReactNode;
    disabled?: boolean;
}

type Props<T extends MultipleSelectItem, V = T['value']> = {
    items: T[]
    value?: V[]
    maxItems?: number;
    defaultValue?: V[]
    onChange?: (value?: V[]) => void;
    disabled?: boolean;
    isLoading?: boolean
    placeholder?: React.ReactNode;
    classNames?: Partial<{
        trigger: string;
        content: string;
    }>
}

function MultipleSelect<T extends MultipleSelectItem>({ isLoading = false, value, onChange, items, placeholder, defaultValue, classNames, disabled, maxItems }: Props<T>) {
    const [open, setOpen] = useState(false)
    const [innerValue, setInnerValue] = useState<Maybe<T['value'][]>>(defaultValue);

    const actualValue = value ?? innerValue;
    const isMax = !!(maxItems && ((actualValue?.length || 0) >= maxItems))

    const getIsItemDisabled = (item: T) => (
        !actualValue?.includes(item.value) && isMax
    )

    return (
        <Popover onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={twMerge("justify-between gap-2 font-normal w-full max-w px-3", classNames?.trigger)}
                >
                    <div className='w-full text-left overflow-x-auto flex-1 no-scrollbar'>
                        {actualValue?.length
                            ? <div className='flex items-center gap-2'>
                                {actualValue.map(value => {
                                    const item = items.find((item) => {
                                        return item.value === value
                                    });
                                    if (!item) return null;

                                    return <div
                                        key={value}
                                        className='flex items-center gap-2 bg-gray-secondary/25 text-main py-1 px-2 rounded-md max-w-[120px]  overflow-x-auto no-scrollbar overflow-y-hidden hover:bg-gray-secondary/40 duration-200 transition-colors'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const newValue = actualValue.filter(v => value !== v)
                                            onChange?.(newValue);
                                            setInnerValue?.(newValue)
                                        }}
                                    >
                                        {item.displayValue}
                                    </div>;
                                })}
                            </div>
                            : placeholder}
                    </div>


                    <div className={twMerge('duration-200 opacity-60 ', open ? 'rotate-90' : 'rotate-0')}>
                        <ChevronRight />
                    </div>
                </Button>
            </PopoverTrigger>

            <PopoverContent className={cn("p-0 max-h-60 overflow-y-auto", classNames?.content)}>
                <Command>
                    <CommandGroup>
                        {isLoading ? (
                            <div className='w-full opacity-70 flex items-center justify-center gap-2 py-0.5 px-1 text-sm'>
                                <SpinnerLoading size={17} />
                                <Translate namespace='Default' itemKey='loading' />
                            </div>
                        ) : (
                            items.length ?
                                items.map((item) => (
                                    <CommandItem
                                        className={cn((item.disabled || getIsItemDisabled(item)) && 'opacity-40')}
                                        disabled={item.disabled || getIsItemDisabled(item)}
                                        key={item.value}
                                        value={item.value}
                                        onSelect={(currentValue) => {
                                            if (actualValue?.map(value => value.toLowerCase())?.includes(currentValue)) {
                                                const newValue = actualValue.filter(value => value.toLowerCase() !== currentValue)
                                                onChange?.(newValue)
                                                setInnerValue(newValue)

                                                return
                                            }

                                            // Do this to avoid lowercasing problem
                                            const itemValue = items.find(item => {
                                                return item.value.toLowerCase() === currentValue;
                                            })?.value
                                            if (!itemValue) return

                                            const newValue = [itemValue, ...(actualValue ?? [])];
                                            if (maxItems && newValue.length > maxItems) return;
                                            onChange?.(newValue);
                                            setInnerValue(newValue)
                                        }}
                                    >
                                        {item.disabled
                                            ? (
                                                <BanIcon
                                                    className={cn(
                                                        "mr-3 h-4 w-4 text-main"
                                                    )}
                                                />
                                            )
                                            : actualValue?.includes(item.value)
                                                ? <Check className={cn("mr-2 h-4 w-4")} />
                                                : <div></div>
                                        }

                                        {item.displayValue}
                                    </CommandItem>
                                ))
                                : (
                                    <div className='text-sm py-0.5 px-1 text-center text-main/60 w-full'>
                                        <Translate namespace='Default' itemKey='cantfind' />
                                    </div>
                                )
                        )}
                    </CommandGroup>
                </Command>
            </PopoverContent>

        </Popover>



    );
}


export default MultipleSelect