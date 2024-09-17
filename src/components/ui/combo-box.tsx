import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { forwardRef, useState, type ReactNode } from "react";

type ComboBoxItem = {
    value: string;
    label: React.ReactNode;
}

type ComboBoxProps = {
    items: readonly ComboBoxItem[];
    value?: string;
    onSelect?: (item: string) => void;
    defaultValue?: string
    placeholder?: string | ReactNode;
    filter?: (value: string, search: string) => number;
}

const  ComboBox = forwardRef<HTMLDivElement, ComboBoxProps>(({ items, placeholder, value, onSelect, filter, defaultValue }, ref) => {
    const defaultT = useTranslations('Default')
    const [open, setOpen] = useState(false)

    const shouldScroll = items.length > 6;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between font-thin w-full"
                >
                    {value
                        ? items.find((item) => item.value === value)?.label
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command filter={filter} ref={ref}>
                    <CommandInput placeholder={defaultT("search")} defaultValue={defaultValue} />
                    <CommandEmpty>Нічого не знайденно.</CommandEmpty>
                    <CommandGroup className={shouldScroll ? "max-h-60 overflow-y-auto" : ""}>
                        {items.map((item) => (
                            <CommandItem
                                key={item.value}
                                value={item.value}
                                onSelect={(currentValue) => {
                                    onSelect?.(currentValue);
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === item.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {item.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
})
ComboBox.displayName = 'ComboBox'

export default ComboBox;
