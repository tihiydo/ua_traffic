"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar, type CalendarProps } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {  useState } from "react"
import { useLocale } from "next-intl";
import { getLocale } from "@/lib/date-fns";
import Translate from "@/components/Translate"
import { toast } from "react-toastify"

export type RangeDatePickerProps = {
    value: DateRange;
    onChange?: (date?: DateRange) => void;
    className?: string;
    disabled?: boolean;
    calendarProps?: Omit<CalendarProps, 'mode' | 'selected' | 'onSelect'>;
}

function RangeDatePicker({
    className,
    value,
    onChange,
    disabled,
    calendarProps,
}: RangeDatePickerProps) {
    const locale = useLocale();

    const [open, setOpen] = useState(false)
    return (
        <div className={cn("grid gap-2 w-full", className)}>
            <Popover onOpenChange={(e) => setOpen(e)} open={open} defaultOpen={false}>
                <PopoverTrigger asChild onClick={() => setOpen(true)}>
                    <Button
                        onClick={() => setOpen(true)}
                        disabled={disabled}
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !value && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4"  onClick={() => setOpen(true)} />
                        {value?.from ? (
                            value?.to ? (
                                <>
                                    {format(value.from, "LLL dd, y", { locale: getLocale(locale) })} -{" "}
                                    {format(value.to, "LLL dd, y", { locale: getLocale(locale) })}
                                </>
                            ) : (
                                format(value.from, "LLL dd, y")
                            )
                        ) : (
                            <span  onClick={() => setOpen(true)}><Translate namespace='Default' itemKey="selectdatashort"/></span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        locale={ getLocale(locale)}
                        mode="range"
                        defaultMonth={value?.from}
                        selected={value}
                        onSelect={(range => {
                            if (!range) return;

                            onChange?.(range);
                        })}
                        {...calendarProps}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default RangeDatePicker;
