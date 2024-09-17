import React, { type FC } from 'react';
import ReactInputMask from 'react-input-mask';
import { Input } from "@/components/ui/input";

type IMaskInputProps = {
    value: string;
    onChange: (newValue: string) => void;
    mask: string | (string | RegExp)[];
    maskChar?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>

const MaskInput: FC<IMaskInputProps> = ({
    value,
    onChange,
    mask,
    placeholder,
    maskChar = '',
    disabled = false,
    ...props
}) => {
    return (
        <ReactInputMask disabled={disabled} {...props} placeholder={placeholder} mask={mask} value={value} onChange={(e) => onChange(e.target.value)} maskPlaceholder={maskChar}>
            <Input  />
        </ReactInputMask>
    );
};

export default MaskInput;
