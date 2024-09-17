'use client';

import React from 'react';
import { useController, type Control } from 'react-hook-form';
import ClientRatingStars from '../../../../(blog)/blog/_components/ClientRatingStars';

interface RatingInputProps {
  name: string;
  control: Control<any>;
  label: React.ReactNode;
}

const RatingInput: React.FC<RatingInputProps> = ({ name, control, label }) => {
    const {
        field: { value, onChange },
    } = useController({
        name,
        control,
        defaultValue: 0,
    });

    return (
        <div className="mb-4">
            <label className="block mb-2">{label}</label>
            <ClientRatingStars
                count={5}
                value={value}
                editing={true}
                size={24}
                activeColor="#ffc107"
                inactiveColor="#ddd"
                isHalf={false}
                onChange={onChange}
            />
        </div>
    );
};

export default RatingInput;