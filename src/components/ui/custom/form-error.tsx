import { InfoIcon, XIcon } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "../button";

type Props = {
  error?: string;
  className?: string;
  onClose?: () => void;
};

const FormError = ({ error, className, onClose }: Props) => {
    if (!error) return null;
    return (
        <div
            className={twMerge(
                "flex items-center justify-between gap-5 rounded-lg border-2 border-destructive border-opacity-40 bg-red bg-opacity-30 px-4 py-3 text-destructive",
                className,
            )}
        >
            <div className="flex items-center gap-3">
                <InfoIcon  className="min-w-fit" />
                <p>{error}</p>
            </div>

            {!!onClose && (
                <Button
                    type="button"
                    size="icon"
                    variant={"ghost"}
                    className="h-8 min-h-[2rem] w-8 min-w-[2rem] !bg-opacity-5 hover:bg-destructive"
                    onClick={() => {
                        onClose?.();
                    }}
                >
                    <XIcon size={20} />
                </Button>
            )}
        </div>
    );
};

export default FormError;
