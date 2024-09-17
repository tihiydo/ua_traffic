"use client";

import { useState, useEffect, useRef } from 'react';
import { api } from "@/trpc/react";
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';

const CabinetColorPicker = ({ cabinetType }: { cabinetType: "blogger" | "advertiser" | "profile" }) => {

    const defaultColor = cabinetType === 'blogger' ? '#FFDD5F' : cabinetType === 'advertiser' ? '#69C5DE' : cabinetType === 'profile' ? '#FFDD5F' : '#69C5DE';
    const { data: currentColor, isLoading } = api.user.getCabinetColor.useQuery(cabinetType);
    const [color, setColor] = useState(currentColor || defaultColor);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const t = useTranslations('Other');

    const utils = api.useUtils();

    const updateColorMutation = api.user.updateCabinetColor.useMutation({
        onSuccess: () => {
            utils.user.getCabinetColor.invalidate(cabinetType);
            toast.success(t('colorchange'));
        },
        onError: () => {
            toast.error(t('errorcolor'));
        },
    });

    useEffect(() => {
        if (currentColor && !isLoading) {
            setColor(currentColor);
        }
    }, [currentColor, isLoading]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleColorChange = (newColor: string) => {
        setColor(newColor);
        updateColorMutation.mutate({ cabinetType, color: newColor });
        setIsOpen(false);
    };

    const colorOptions = [
        "#FFDD5F", "#9F90EF", "#559EFD", "#50CC96", "#69C5DE",
        "#6E5DC7", "#0966E5", "#1E8359", "#2A7998", "#C8372C"
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <div 
                className="w-[50px] h-[50px] rounded-md cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => setIsOpen(!isOpen)}
            />
            {isOpen && (
                <div className="absolute left-0 z-50 mt-4 bg-white border border-slate-300 rounded-md shadow-lg p-2" style={{ width: '215px' }}>
                    <div className="grid grid-cols-5 gap-3">
                        {colorOptions.map((colorOption) => (
                            <div
                                key={colorOption}
                                className={`w-8 h-8 rounded-md cursor-pointer ${color === colorOption ? 'ring-1 ring-offset-2 ring-slate-400' : ''}`}
                                style={{ backgroundColor: colorOption }}
                                onClick={() => handleColorChange(colorOption)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CabinetColorPicker;