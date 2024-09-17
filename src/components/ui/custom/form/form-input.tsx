import React, { type ReactNode, type HTMLInputTypeAttribute } from "react";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control, FieldValues, Path, PathValue } from "react-hook-form";
import MaskInput from "../mask-input";

type IFormInputProps<T extends FieldValues> = {
    name: Path<T>;
    control: Control<T>;
    label?: string | ReactNode;
    labelRight?: string | ReactNode;
    className?: string,
    placeholder?: string;
    mask?: string | (string | RegExp)[];
    maskChar?: string;
    description?: string;
    type?: HTMLInputTypeAttribute;
    shouldUnregister?: boolean;
    defaultValue?: PathValue<T, Path<T>>;
    disabled?: boolean;
    onChangeTrigger?: (newValue: string) => void;
    transformChangeValue?: (val: string, prevVal?: string) => string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>



const FormInput = <T extends FieldValues>({
    name,
    control,
    label,
    labelRight,
    defaultValue,
    shouldUnregister = true,
    type = "text",
    placeholder,
    description,
    className,
    disabled,
    mask,
    maskChar,
    onChangeTrigger,
    transformChangeValue,
    ...props
}: IFormInputProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            defaultValue={defaultValue}
            shouldUnregister={shouldUnregister}
            render={({ field: { onChange, disabled: fieldDisabled, value: fieldValue, ...field } }) => (
                <FormItem className={className}>
                    {!!label && <FormLabel className="font-bold">{label}</FormLabel>}
                    {!!labelRight && <FormLabel className="font-bold">{labelRight}</FormLabel>}

                    <FormControl>
                        {mask ? (
                            <MaskInput
                                onChange={(newValue) => {
                                    const transformedValue = transformChangeValue
                                        ? transformChangeValue(newValue, fieldValue)
                                        : newValue;

                                    onChange(transformedValue);
                                    onChangeTrigger?.(transformedValue);
                                }}
                                mask={mask}
                                maskChar={maskChar}
                                placeholder={placeholder}
                                disabled={disabled}
                                // @ts-ignore
                                value={fieldValue}
                                {...props}
                                {...field}
                            />

                        ) : (
                            <Input
                                type={type}
                                onChange={(e) => {
                                    const newValue = e.target.value;
                                    const value = transformChangeValue
                                        ? transformChangeValue(newValue, fieldValue)
                                        : newValue;
                                    console.log(newValue)
                                    onChange(value);
                                    onChangeTrigger && onChangeTrigger(value);
                                }}
                                disabled={fieldDisabled ?? disabled}
                                placeholder={placeholder}
                                // @ts-ignore
                                value={fieldValue}
                                {...field}
                                {...props}
                            />
                        )}

                    </FormControl>
                    {description && <FormDescription>{description}</FormDescription>}
                    <FormMessage className="text-sm" />
                </FormItem>
            )}
        />
    );
};

export default FormInput;
