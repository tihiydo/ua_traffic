'use client'

import SpinnerLoading from './ui/custom/spinner-loading';
import Translate from '@/components/Translate';
import { twMerge } from 'tailwind-merge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useState } from 'react';
import { Button } from './ui/button';
import { BanIcon, Check, ChevronRight } from 'lucide-react';
import { Command, CommandGroup, CommandItem } from './ui/command';
import { cn } from '@/lib/utils';


export type FormSelectItem<T extends string = string> = {
    readonly value: T;
    displayValue: React.ReactNode;
    disabled?: boolean;
}

type Props<T extends FormSelectItem, V = T['value']> = {
    items: T[]
    value?: V
    defaultValue?: V
    unselectable?: boolean;
    onChange?: (value?: V) => void;
    disabled?: boolean;
    isLoading?: boolean
    placeholder?: React.ReactNode;
    notFound?: React.ReactNode;
    classNames?: Partial<{
        trigger: string;
        content: string;
    }>
}


function Select<const T extends string>({ isLoading = false, value, onChange, items, placeholder, defaultValue, classNames, disabled, unselectable, notFound }: Props<FormSelectItem<T>>) {
    const [open, setOpen] = useState(false)
    const [innerValue, setInnerValue] = useState<Maybe<FormSelectItem<T>['value']>>(defaultValue);

    const actualValue = value ?? innerValue;

    return (
        <Popover onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabled}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={twMerge("justify-between font-normal w-full px-3", classNames?.trigger)}
                >
                    <div className='w-full text-left overflow-hidden'>
                        {actualValue
                            ? items.find((item) => item.value === actualValue)?.displayValue
                            : placeholder}
                    </div>


                    <div className={twMerge('duration-200 opacity-60', open ? 'rotate-90' : 'rotate-0')}>
                        <ChevronRight />
                    </div>
                </Button>
            </PopoverTrigger>

            <PopoverContent className={cn("p-0 max-h-[200px] overflow-y-auto", classNames?.content)}>
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
                                        className={cn('', item.disabled && 'opacity-40')}
                                        disabled={item.disabled}
                                        key={item.value}
                                        value={item.value}
                                        onSelect={(lowercasedValue) => {
                                            const selectedItem = items.find(item => item.value.toLowerCase() === lowercasedValue);
                                            if (!selectedItem) return;

                                            if (unselectable && selectedItem.value === actualValue) {
                                                onChange?.(undefined);
                                                setInnerValue(undefined)
                                                setOpen(false)
                                                return
                                            }


                                            onChange?.(selectedItem.value);
                                            setInnerValue(selectedItem.value)
                                            setOpen(false)
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
                                            : item.value === value
                                                ? (<Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        value === item.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                />)
                                                : <div></div>
                                        }

                                        {item.displayValue}
                                    </CommandItem>
                                ))
                                : (
                                    notFound ?? <div className='text-sm py-0.5 px-1 text-center text-main/60 w-full'>
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


export default Select