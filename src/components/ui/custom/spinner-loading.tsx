import { Loader2, type LucideProps } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
} & LucideProps;

const SpinnerLoading = ({ className, ...props }: Props) => {
    return (
        <Loader2
            size={20}
            className={twMerge("animate-spin ", className)}
            {...props}
        />
    );
};

export default SpinnerLoading;
