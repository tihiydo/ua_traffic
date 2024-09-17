'use client';
import React from 'react';
import ReactStars from 'react-rating-stars-component';

interface ClientRatingStarsProps {
  count: number;
  value: number;
  editing: boolean;
  size: number;
  activeColor: string;
  inactiveColor: string;
  isHalf: boolean;
  onChange?: (newValue: number) => void;
  staticMode?: boolean;
}

const ClientRatingStars: React.FC<ClientRatingStarsProps> = ({
    count,
    value,
    editing,
    size,
    activeColor,
    inactiveColor,
    isHalf,
    onChange,
    staticMode = false,
}) => {
    if (staticMode) {
        return (
            <div className="flex">
                {[...Array(count)].map((_, index) => {
                    const starValue = index + 1;
                    return (
                        <span
                            key={index}
                            style={{
                                color: starValue <= value ? activeColor : inactiveColor,
                                fontSize: `${size}px`,
                            }}
                        >
              ★
                        </span>
                    );
                })}
            </div>
        );
    }

    return (
        <ReactStars
            count={count}
            value={value}
            editing={editing}
            size={size}
            activeColor={activeColor}
            color={inactiveColor}
            isHalf={isHalf}
            onChange={onChange}
        />
    );
};

export default ClientRatingStars;