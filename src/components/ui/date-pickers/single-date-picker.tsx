"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, type CalendarProps } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { forwardRef } from "react"
import { useLocale } from "next-intl";
import { getLocale } from "@/lib/date-fns";
import Translate from "@/components/Translate"

export type SingleDatePickerProps = {
    value: Date;
    onChange?: (date?: Date) => void;
    disabled?: boolean;
    calendarProps?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;
} & React.HTMLAttributes<HTMLDivElement>

function SingleDatePicker({
    className,
    value,
    onChange,
    disabled,
    calendarProps
}: SingleDatePickerProps) {
    const locale = useLocale();

    return (
        <div className={cn("grid gap-2 w-full", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        disabled={disabled}
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !value && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? (
                            format(value, "LLL dd, y", { locale: getLocale(locale) })
                        ) : (
                            <span><Translate namespace='Default' itemKey="selectdatashort"/></span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        locale={getLocale(locale)}
                        initialFocus
                        mode="single"
                        defaultMonth={value}
                        selected={value}
                        onSelect={(range => {
                            onChange?.(range);
                        })}
                        {...calendarProps}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default forwardRef<any, SingleDatePickerProps>(SingleDatePicker);